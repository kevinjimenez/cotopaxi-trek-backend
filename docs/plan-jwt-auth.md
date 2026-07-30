# Plan: Autenticación JWT + Mutation `login`

## 1. Dónde estamos (resumen del historial)

Stack: NestJS 11 + GraphQL (Apollo Server, `autoSchemaFile` en `src/schema.gpl`) + Prisma 7 (adapter `pg`) sobre Postgres, schema multi-tenant (`Company` → `User`/`Season`/`Mountain`).

Pasos ya completados (`git log`):

1. **`feat/users-module`** — scaffold de `UsersModule` con `BaseRepository` genérico y mutation `createUser`.
2. **`refactor/users-repo-tx-pattern`** — se quitó `BaseRepository` para `Users`/`UserCredentials` y se unificó el patrón "tx opcional" (`tx ?? this.databasesService`) que ahora usan ambos repos.
3. **`user-credentials` conectado a Prisma** — `UserCredentialsService.create` guarda la fila en `user_credentials`; `UsersService.create` crea `User` + `UserCredential` dentro de una `$transaction`.
4. **`feat/schema-companies-seasons-mountains`** — se agregaron `Company`, `Season`, `Mountain`, `SeasonMountain`, `UserSeason`, `Booking` y sus relaciones (incluida `Booking.createdBy` como relación nombrada).
5. **`feat/schema-multitenant-remodel`** — remodelado a PascalCase + `@map`/`@@map` a snake_case, `companyId` scoping, uniques compuestos por compañía, alineación de DTOs/repos a camelCase y uso de `UncheckedCreateInput` donde el DTO trae el FK escalar en vez del objeto de relación.

**Gap detectado que hay que resolver como parte de este plan**: `UserCredentialsRepository.create` guarda `password` tal cual llega del DTO — **no hay hashing**. Antes de meter JWT hay que cerrar ese hueco (login no puede comparar contra texto plano).

## 2. Qué falta para login + JWT

- Dependencias nuevas (no están en `package.json`): `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, y sus tipos.
- Variables de entorno para el secreto/expiración del JWT (`src/common/config/envs.ts` solo valida `PORT`, `NODE_ENV`, `DATABASE_URL`).
- Hashing de password al crear `UserCredential` + método para compararlo en login.
- Un `AuthModule` nuevo (dto, model, service, resolver, strategy, guard).
- Contexto de GraphQL debe exponer `req` para que Passport pueda leer el header `Authorization`.
- (Opcional pero recomendado dado que ya existe `RoleType`) guard de roles para proteger queries/mutations por `admin`/`superadmin`.

## 3. Pasos de implementación

### 3.1 Instalar dependencias

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add -D @types/passport-jwt @types/bcrypt
```

### 3.2 Variables de entorno

`.env` / `.env.example`:

```
JWT_SECRET=change-me-in-prod
JWT_EXPIRES_IN=1d
```

`src/common/config/envs.ts` — agregar al schema y al export:

```ts
interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi.string().default('local'),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().default('1d'),
  })
  .unknown(true);

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
};
```

### 3.3 Hashear el password (cerrar el gap actual)

`src/user-credentials/user-credentials.service.ts` — hashear antes de delegar al repo:

```ts
import * as bcrypt from 'bcrypt';

create(payload: CreateUserCredentialInput, tx?: PrismaTransaction) {
  const hashedPassword = bcrypt.hashSync(payload.password, 10);
  return this.userCredentialsRepository.create(
    { ...payload, password: hashedPassword },
    tx,
  );
}
```

Agregar también un método para comparar (lo usará `AuthService`):

```ts
async validatePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
```

### 3.4 Repo/servicio de `Users`: buscar por identificador de login

Login necesita encontrar el `User` + sus `credentials` por `email`, `username` o `phone`. Agregar en `UsersRepository`:

```ts
findByIdentifierWithCredential(identifier: string, tx?: PrismaTransaction) {
  const database = tx ?? this.databasesService;
  return database.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
        { phone: identifier },
      ],
    },
    include: { credentials: true },
  });
}
```

Y exponerlo en `UsersService`.

### 3.5 Estructura del `AuthModule`

```
src/auth/
  auth.module.ts
  auth.service.ts
  auth.resolver.ts
  dto/
    login.input.ts
  models/
    auth-payload.model.ts
  strategies/
    jwt.strategy.ts
  guards/
    gql-auth.guard.ts
    roles.guard.ts
  decorators/
    current-user.decorator.ts
    roles.decorator.ts
```

**`dto/login.input.ts`**

```ts
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  identifier: string; // email, username o phone

  @Field()
  @IsString()
  password: string;
}
```

**`models/auth-payload.model.ts`**

```ts
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
```

**`auth.service.ts`**

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userCredentialsService: UserCredentialsService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ identifier, password }: LoginInput) {
    const user = await this.usersService.findByIdentifierWithCredential(identifier);

    if (!user || !user.credentials) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await this.userCredentialsService.validatePassword(
      password,
      user.credentials.password,
    );

    if (!isValid || !user.status) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
```

**`strategies/jwt.strategy.ts`**

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/common/config/envs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate(payload: { sub: string; role: string; companyId: string | null }) {
    const user = await this.usersService.findByIdWithCredential(payload.sub);
    if (!user || !user.status) {
      throw new UnauthorizedException();
    }
    return user; // queda disponible como req.user
  }
}
```

**`guards/gql-auth.guard.ts`** (necesario porque Passport espera `req`/`res` de HTTP, no el `ExecutionContext` de GraphQL):

```ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
```

**`decorators/current-user.decorator.ts`**

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
```

**`auth.resolver.ts`**

```ts
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './models/auth-payload.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
```

**`auth.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/common/config/envs';
import { UserCredentialsModule } from 'src/user-credentials/user-credentials.module';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    UserCredentialsModule,
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
```

> Nota: `UsersModule` hoy no exporta `UsersService`/`UsersRepository`. Hay que agregar `exports: [UsersService]` en `users.module.ts` para que `AuthModule` y `JwtStrategy` puedan inyectarlo.

### 3.6 Registrar `AuthModule` y exponer `req` en el contexto GraphQL

`src/app.module.ts`:

```ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
  sortSchema: true,
  context: ({ req }) => ({ req }), // requerido por GqlAuthGuard / CurrentUser
}),
```

Y agregar `AuthModule` al array de `imports`.

### 3.7 Proteger resolvers existentes (ejemplo)

```ts
@UseGuards(GqlAuthGuard)
@Query(() => [User], { name: 'users' })
findAll() {
  return this.usersService.findAll();
}
```

### 3.7.1 Restringir por rol: `@Roles()` + `RolesGuard`

`GqlAuthGuard` solo confirma que hay un JWT válido (autenticación). Para autorización por rol (`admin`/`superadmin`/`customer`) se necesita una segunda capa: un decorador que declare qué roles puede pasar, y un guard que lea esa metadata + el `role` que `JwtStrategy.validate` ya dejó en `req.user`.

**`decorators/roles.decorator.ts`**

```ts
import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/databases/generated/prisma/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
```

`SetMetadata` adjunta la lista de roles permitidos al handler (la query/mutation) o a la clase completa del resolver; `RolesGuard` la lee con `Reflector`.

**`guards/roles.guard.ts`**

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { RoleType } from 'src/databases/generated/prisma/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../types/authenticated-user.type';

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext<{ req: RequestWithUser }>().req;

    return requiredRoles.includes(user.role);
  }
}
```

`getAllAndOverride` revisa primero el metadata del método (`context.getHandler()`) y si no encuentra nada cae al de la clase (`context.getClass()`) — así se puede poner `@Roles(...)` a nivel de resolver completo o solo en una query puntual.

**Uso combinado** (orden importa: `GqlAuthGuard` primero para que exista `req.user`, `RolesGuard` después para leerlo):

```ts
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(RoleType.admin, RoleType.superadmin)
@Query(() => [User], { name: 'users' })
findAll() {
  return this.usersService.findAll();
}
```

Sin `@Roles(...)` en el handler/clase, `RolesGuard` deja pasar a cualquier usuario autenticado (`requiredRoles` vacío → `return true`) — por eso siempre va junto con `GqlAuthGuard`, nunca solo.

**Registro en `auth.module.ts`**: agregar `RolesGuard` a `providers` (no necesita imports nuevos, `Reflector` ya lo provee `@nestjs/core` globalmente) y exportarlo si otros módulos van a usarlo directo en sus resolvers:

```ts
providers: [AuthResolver, AuthService, JwtStrategy, RolesGuard],
exports: [JwtModule, PassportModule, RolesGuard],
```

### 3.8 Verificación

1. `pnpm start:dev`.
2. Mutation de prueba en Apollo Sandbox / Postman (ya existe `postman.json` en el repo):
   ```graphql
   mutation {
     login(loginInput: { identifier: "correo@ejemplo.com", password: "secreto" }) {
       accessToken
       user { id name role }
     }
   }
   ```
3. Verificar que un `createUser` nuevo guarda el password hasheado (revisar la tabla `user_credentials` directamente).
4. Probar una query protegida (`users`) sin header `Authorization` → debe fallar con `Unauthorized`; con `Authorization: Bearer <accessToken>` → debe pasar.
5. Confirmar que el JWT decodificado (jwt.io) trae `sub`, `role`, `companyId` y respeta `JWT_EXPIRES_IN`.
6. Con `@Roles(RoleType.admin, RoleType.superadmin)` en `users`, loguear con un usuario `customer` y confirmar que la query falla (guard deniega, no `Unauthorized` sino `Forbidden` si se lanza explícitamente); loguear con `admin`/`superadmin` y confirmar que pasa.

## 4. Orden sugerido de PRs/commits

1. `fix: hashear password en user-credentials con bcrypt`
2. `feat: exportar UsersService y agregar findByIdentifierWithCredential`
3. `feat: agregar AuthModule con JWT (login resolver, strategy, guard)`
4. `feat: proteger queries/mutations existentes con GqlAuthGuard (+ roles opcional)`
