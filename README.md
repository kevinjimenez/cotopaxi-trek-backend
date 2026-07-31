<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Stack

- **[NestJS](https://nestjs.com/)** (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`) — framework principal, sobre Express.
- **GraphQL** con enfoque **code-first**: el schema (`src/schema.gpl`) se autogenera a partir de los decoradores TypeScript (`@ObjectType`, `@Field`, `@Resolver`, `@Query`), no se escribe a mano.
  - `@nestjs/graphql` — integración de GraphQL con Nest.
  - `@nestjs/apollo` + `@apollo/server` + `@as-integrations/express5` — driver de Apollo Server sobre Express.
  - `graphql` — librería base del lenguaje de queries.
- **[Prisma](https://www.prisma.io/)** (`prisma` + `@prisma/client`) — ORM y cliente de base de datos, schema en `src/databases/prisma/schema.prisma`.
- **TypeScript** + **pnpm** como gestor de paquetes.
- **Jest** para tests unitarios y e2e.

## Project setup

```bash
$ pnpm install
```

Esto instala todo lo que ya está declarado en `package.json`. Las secciones de abajo documentan **cómo se agregó cada dependencia**, por si necesitas replicarlo en otro proyecto o entender de dónde salió cada paquete.

### GraphQL + Apollo

```bash
pnpm add @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql
```

### Validación de variables de entorno (Joi + dotenv)

```bash
pnpm add joi dotenv
```

### Compresión de respuestas HTTP

```bash
pnpm add compression
pnpm add -D @types/compression
```

### Validación de DTOs / inputs (ValidationPipe global)

```bash
pnpm add class-validator class-transformer
```

### Prisma (ORM)

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

Después de instalarlo hay que inicializar el schema (si no existe todavía) y generar el cliente — ver la sección [Base de datos (Prisma)](#base-de-datos-prisma) más abajo para el detalle de `migrate dev` vs `generate`.

### Prisma driver adapter para Postgres

```bash
pnpm add @prisma/adapter-pg pg
```

Se usa en `src/databases/databases.service.ts` para conectar Prisma a Postgres a través de un [driver adapter](https://www.prisma.io/docs/orm/overview/databases/database-drivers) (`PrismaPg`) en vez de la conexión nativa del engine. Por eso el `datasource db` en `schema.prisma` no define `url`: la connection string se le pasa al adapter en runtime, usando `envs.databaseUrl`.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

Al levantar el proyecto (por ejemplo con `pnpm run start:dev`), Nest genera el schema GraphQL automáticamente en `src/schema.gpl` y expone un único endpoint en:

```
http://localhost:3000/graphql
```

### `@Field()` inferido vs `@Field(() => Tipo)` explícito

En el enfoque code-first, `@Field()` sin argumentos usa `reflect-metadata` para adivinar el tipo GraphQL a partir del tipo de TypeScript. Eso funciona bien para `string`, `boolean` y clases simples, pero **hay que ser explícito con `@Field(() => Tipo)`** en estos casos:

- **Enums** — un enum de Prisma (`RoleType`) es un `const` object + union type; en runtime no queda tipo que `reflect-metadata` pueda leer.
  ```ts
  @Field(() => RoleType)
  role?: RoleType;
  ```
- **Arrays** — TypeScript emite `Array` como metadata, sin el tipo de los elementos.
  ```ts
  @Field(() => [UserCredential])
  credentials: UserCredential[];
  ```
- **`number` cuando es `Int`, no `Float`** — por defecto `@Field()` sobre un `number` mapea a `Float`. Para enteros reales (`sort_order`, `altitude_meters`) hay que forzarlo.
  ```ts
  @Field(() => Int)
  sort_order: number;
  ```
- **`ID`** — si quieres que GraphQL trate el campo como identificador y no como texto libre.
  ```ts
  @Field(() => ID)
  id: string;
  ```
- **Referencias circulares o clases declaradas más abajo/en otro archivo** — el `() => Tipo` es un *thunk* (función perezosa) que se evalúa recién cuando GraphQL construye el schema, no en el momento del import. Evita errores cuando dos modelos se referencian entre sí.

### Troubleshooting: el puerto 3000 ya está en uso

Si al levantar el proyecto ves un error de `EADDRINUSE` (o simplemente no arranca porque el puerto ya está ocupado, por ejemplo de una corrida anterior que quedó colgada), revisa qué proceso lo está usando:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Esto te da el `PID` del proceso. Para liberarlo:

```bash
kill <PID>
```

## Health check (GraphQL)

El módulo `src/health` expone una query para verificar que la API está arriba y respondiendo.

- **Modelo** (`src/health/model/health.model.ts`): define el tipo `Health` con los campos `environment`, `message` y `port`.
- **Resolver** (`src/health/health.resolver.ts`): expone la query `checkHealth`, que devuelve un `Health`.
- **Service** (`src/health/health.service.ts`): contiene la lógica que arma la respuesta.

### Cómo validar / probar la query

**Opción 1 — Apollo Sandbox (navegador):**

Con el servidor corriendo, abre `http://localhost:3000/graphql` y ejecuta:

```graphql
query {
  checkHealth {
    environment
    message
    port
  }
}
```

**Opción 2 — curl (terminal):**

```bash
curl -s -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { checkHealth { environment message port } }"}'
```

Respuesta esperada:

```json
{"data":{"checkHealth":{"environment":"...","message":"api paradeisos is up and running","port":0}}}
```

## Base de datos (Prisma)

El schema vive en `src/databases/prisma/schema.prisma` y la conexión se configura con la variable `DATABASE_URL` en tu `.env` (ver `.env.example`).

### Relaciones: 1-a-1, 1-a-N y N-a-N

**1-a-1** — ejemplo `users` ↔ `user_credentials`:

```prisma
model users {
  id          String            @id @default(uuid(7))
  credentials user_credentials? // lado "uno": opcional, no genera columna en la tabla
}

model user_credentials {
  id      Int    @id @default(autoincrement())
  user_id String @unique // @unique es lo que fuerza que sea 1-a-1 (sin esto sería 1-a-N)
  user    users  @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

La clave es el `@unique` sobre la FK (`user_id`): garantiza que cada `user` tenga como máximo una fila en `user_credentials`.

**1-a-N** — ejemplo `companies` (1) → `seasons` (N):

```prisma
model companies {
  id      String    @id @default(uuid(7))
  seasons seasons[] // lado "muchos", campo virtual (no es columna)
}

model seasons {
  id         Int        @id @default(autoincrement())
  company_id String?
  company    companies? @relation(fields: [company_id], references: [id]) // lado "uno"
}
```

La FK (`company_id`) vive del lado "muchos" (`seasons`). El array `seasons[]` en `companies` es solo virtual, Prisma lo resuelve con una query aparte.

**N-a-N** — ejemplo `users` ↔ `seasons` vía tabla puente `user_seasons`:

```prisma
model users {
  id           String         @id @default(uuid(7))
  user_seasons user_seasons[]
}

model seasons {
  id           Int            @id @default(autoincrement())
  user_seasons user_seasons[]
}

model user_seasons {
  id        Int      @id @default(autoincrement())
  status    Boolean  @default(true) // dato propio de la relación (ni de users ni de seasons)
  user_id   String?
  user      users?   @relation(fields: [user_id], references: [id])
  season_id Int?
  season    seasons? @relation(fields: [season_id], references: [id])
}
```

Usamos una tabla puente **explícita** (`user_seasons`) en vez del atajo N-a-N implícito de Prisma (`users seasons[]` / `seasons users[]` sin modelo intermedio) porque necesitamos guardar datos propios de la relación — en este caso `status` — algo que el N-a-N implícito no permite.

### Relaciones nombradas — dos FKs al mismo modelo

Cuando un modelo tiene **más de una** relación hacia el mismo modelo destino, Prisma no puede adivinar cuál FK corresponde a cuál campo inverso — hay que nombrar cada relación con `@relation("nombre", ...)` para desambiguar. Ejemplo: `bookings` referencia a `users` dos veces (el cliente dueño de la reserva, y quién la registró en el sistema):

```prisma
model users {
  id String @id @default(uuid(7))

  bookings         bookings[] @relation("booking_user")
  created_bookings bookings[] @relation("booking_created_by")
}

model bookings {
  id     String  @id @default(uuid(7))
  status Boolean @default(true)

  user_id String?
  user    users?  @relation("booking_user", fields: [user_id], references: [id]) // cliente dueño de la reserva

  created_by String?
  createdBy  users?  @relation("booking_created_by", fields: [created_by], references: [id]) // quién la registró
}
```

El string dentro de `@relation("...")` (`"booking_user"`, `"booking_created_by"`) es una etiqueta arbitraria — no genera tabla ni columna, solo le dice a Prisma qué campo array (`bookings`/`created_bookings`) le corresponde a qué FK (`user_id`/`created_by`). Tiene que ser único por par de relaciones y coincidir en ambos lados; si solo hay **una** relación entre dos modelos (como `seasons` → `companies`), no hace falta nombrarla.

### `XCreateInput` vs `XUncheckedCreateInput` — dos formas de escribir una relación

Por cada modelo, Prisma genera **dos** variantes de input para `create`/`update`, y hay que elegir la correcta según cómo tengas el dato de la relación a mano.

**`XCreateInput`** ("checked") — exige el objeto de relación completo, no el FK escalar:

```ts
await databasesService.userCredential.create({
  data: {
    password: '...',
    user: { connect: { id: userId } }, // conecta a un User que ya existe
  },
});
```

Te da más expresividad (`connect`, `connectOrCreate`, `create` anidado para crear el padre y el hijo en el mismo query), y TypeScript valida que la relación tenga la forma correcta.

**`XUncheckedCreateInput`** — acepta el FK escalar directo, sin pasar por el objeto de relación:

```ts
await databasesService.userCredential.create({
  data: {
    password: '...',
    userId: userId, // el id directo, sin `connect`
  },
});
```

Se llama "unchecked" porque TypeScript no valida que ese id corresponda a una fila real (Postgres sí lo valida en runtime, vía la FK constraint) — le "quitas" esa capa de chequeo a cambio de simplicidad.

**Cuál usar**: si tu DTO/service ya trae el id como dato plano (el caso más común en este proyecto — `userId`, `companyId`, etc. llegan como `string` desde el resolver), usa `Unchecked` y evítate armar el objeto `{ connect: { id } }` a mano. Si estás construyendo la relación en el mismo query (conectar explícitamente, o crear padre e hijo juntos), usa la variante `Checked`.

Mismo patrón aplica a `XUpdateInput` / `XUncheckedUpdateInput`.

### Resolver → Service → Repository: quién habla con quién

Regla que seguimos en todos los módulos (`users`, `companies`, `seasons`, etc.): **cada capa tiene un solo "idioma" que entiende, y no se salta capas.**

- **Resolver** — recibe y devuelve tipos de GraphQL (`@InputType()` como `CreateSeasonInput`, `@ObjectType()` como `Season`). Es la puerta de entrada de la API; no sabe nada de Prisma.
- **Service** — recibe el DTO del resolver y orquesta la lógica de negocio (transacciones, llamar a otros services, decidir qué pasa antes/después). Es el traductor entre el contrato de la API (DTO) y el contrato de persistencia (input de Prisma).
- **Repository** — solo habla con `DatabasesService`/Prisma. Sus métodos están tipados con los inputs que genera Prisma (`Prisma.SeasonUncheckedCreateInput`, `Prisma.CompanyCreateInput`, etc.), **nunca** con un DTO de GraphQL.

```ts
// seasons.resolver.ts — habla GraphQL
@Mutation(() => Season)
createSeason(@Args('createSeasonInput') input: CreateSeasonInput) {
  return this.seasonsService.create(input);
}

// seasons.service.ts — recibe el DTO, orquesta
create(payload: CreateSeasonInput) {
  return this.seasonsRepository.create(payload);
}

// seasons.repository.ts — solo conoce Prisma
create(payload: Prisma.SeasonUncheckedCreateInput, tx?: PrismaTransaction) {
  const database = tx ?? this.databasesService;
  return database.season.create({ data: payload });
}
```

**¿Por qué importa, si hoy el DTO y el input de Prisma tienen casi la misma forma?** Porque aunque *hoy* `CreateSeasonInput` sea estructuralmente compatible con `Prisma.SeasonUncheckedCreateInput` (y TypeScript te dejaría pasarlo directo sin quejarse), tipar el repository con el DTO en vez del tipo de Prisma rompe la dirección de la dependencia:

1. **El repository no debería conocer GraphQL.** Si algún día necesitas ese mismo repository desde un seed script, un cron job, o un endpoint REST, no debería arrastrar `@Field()`/`class-validator` con él.
2. **El tipo de Prisma se regenera solo cuando cambia el schema** (`prisma generate`). Si tipas el repository contra Prisma y mañana agregas/quitas una columna, TypeScript te marca el error de compilación en el momento. Un DTO escrito a mano no se entera solo de esos cambios.
3. **El `Service` es el lugar diseñado para ese cambio futuro que seguro llega**: por ejemplo, sacar `companyId` del JWT del usuario autenticado en vez de confiar en lo que mandó el cliente en el input. Ese día solo tocas el `Service` — el `Repository` no cambia, porque su contrato (`Prisma.SeasonUncheckedCreateInput`) sigue siendo el mismo.

### Otros tipos generados que vas a usar seguido

Además de `Create`/`Unchecked`, Prisma genera (por modelo) varios tipos más que vale la pena conocer:

- **`XWhereInput`** — filtros de búsqueda (`findMany`, `count`, `updateMany`, `deleteMany`). Soporta combinaciones (`AND`/`OR`/`NOT`) y operadores por campo (`contains`, `gte`, `in`, etc.).
  ```ts
  databasesService.user.findMany({ where: { companyId, status: true } });
  ```
- **`XWhereUniqueInput`** — igual que `WhereInput` pero restringido a campos únicos (`id`, o cualquier `@unique`/`@@unique`). Es lo único válido para `findUnique`, `update`, `delete` (esos comandos necesitan garantía de que devuelven/afectan una sola fila).
  ```ts
  databasesService.user.findUnique({ where: { id } });
  ```
- **`XCreateManyInput` / `XUncheckedCreateManyInput`** — para `createMany`, insertar varias filas en un solo query. Sigue la misma lógica checked/unchecked, pero sin soporte para relaciones anidadas (solo FKs escalares).
- **`XOrderByWithRelationInput`** — para `orderBy`, incluso ordenando por un campo de una relación (`orderBy: { company: { name: 'asc' } }`).
- **`XSelect` / `XInclude`** — controlan qué campos/relaciones trae la respuesta. `select` es una lista blanca explícita (solo lo que pidas); `include` trae todos los campos del modelo más las relaciones que agregues (como ya usas en `findByIdWithCredential` con `include: { credentials: true }`).

### `@map` y `@@map` — nombres distintos entre Prisma y la base

Los modelos usan PascalCase singular (`Company`, `User`) y los campos camelCase (`createdAt`), como es convención en TypeScript. Pero las tablas y columnas reales en Postgres siguen `snake_case` plural (`companies`, `created_at`), como es convención SQL. `@map`/`@@map` traducen entre ambos mundos sin mezclar estilos:

```prisma
model Company {
  id        String   @id @default(uuid(7)) @db.Uuid
  createdAt DateTime @default(now()) @map("created_at") // campo Prisma: createdAt / columna real: created_at

  @@map("companies") // modelo Prisma: Company / tabla real: companies
}
```

- `@map("created_at")` va sobre un **campo** — traduce el nombre de la columna.
- `@@map("companies")` (con doble `@`) va a nivel de **modelo**, dentro del bloque — traduce el nombre de la tabla.

Sin esto, Prisma usaría literalmente `Company`/`createdAt` como nombres de tabla/columna, mezclando camelCase con el resto de la base.

### `@unique`, `@@unique` y `@@index` — unicidad simple, compuesta e índices

**`@unique`** (un solo `@`) va sobre **un campo individual**, dentro de la misma línea del campo — fuerza que esa columna sola sea única en toda la tabla:

```prisma
model UserCredential {
  userId String @unique @map("user_id") // ningún otro user_credentials puede repetir este user_id
}

model Company {
  slug String @unique @db.VarChar(80) // el slug es único a nivel global, entre todas las companies
}
```

**`@@unique([...])`** (doble `@@`) va dentro del bloque del modelo, no pegado a un campo — fuerza unicidad sobre la **combinación** de varias columnas juntas, no cada una por separado:

```prisma
model User {
  companyId String? @map("company_id")
  email     String?

  @@unique([companyId, email], map: "users_company_id_email_key")
}
```

Acá el mismo `email` puede repetirse entre distintas `companies`, pero no dos veces dentro de la misma `company_id` — así se modela unicidad "scoped" en un esquema multi-tenant. Esto **no se puede lograr con `@unique` simple** en ninguno de los dos campos por separado.

**`@@index([...])`**: crea un índice para acelerar queries que filtran/ordenan por esa columna (ej. `WHERE company_id = ...`), **sin forzar unicidad** — a diferencia de `@unique`/`@@unique`, permite valores repetidos:

```prisma
model User {
  companyId String? @map("company_id")

  @@index([companyId], map: "idx_users_company")
}
```

El `map: "..."` en los tres (`@unique` también lo acepta) es opcional: le pone un nombre explícito a la constraint/índice en Postgres en vez de dejar que Prisma genere uno automático (útil para que el nombre sea legible en los logs de la base o al hacer rollback manual).

Prisma tiene dos comandos que se confunden fácil porque casi siempre se usan juntos, pero resuelven cosas distintas:

### `prisma migrate dev` — cuando cambias el schema

```bash
pnpm prisma migrate dev --name nombre_del_cambio
```

Úsalo cuando **modificas `schema.prisma`** (agregas/quitas un modelo, un campo, una relación, un índice, etc.) y quieres que ese cambio se refleje en la base de datos real. Este comando:

1. Compara tu schema contra el estado actual de la base.
2. Genera un archivo SQL nuevo en `src/databases/prisma/migrations/` con los `ALTER TABLE`/`CREATE TABLE` necesarios.
3. Aplica esa migración a tu base de datos local.
4. Regenera el Prisma Client automáticamente al final (o sea, ya incluye el `generate`).

En pocas palabras: **cambia la estructura de la base de datos**, y deja un historial (los archivos de migración) que se versiona en git para que el resto del equipo y producción puedan aplicar el mismo cambio.

### `prisma generate` — cuando solo necesitas el cliente actualizado

```bash
pnpm prisma generate
```

Úsalo cuando **no tocaste la base de datos**, pero necesitas que el Prisma Client (el objeto `PrismaClient` que usas en tu código, con autocompletado tipado) se actualice. Este comando:

- Lee `schema.prisma` y regenera el código TypeScript del cliente en la carpeta configurada como `output` (`../generated/prisma`, ignorada en git).
- **No toca la base de datos** — no crea tablas ni corre SQL.

Casos típicos donde solo necesitas `generate`, sin `migrate`:
- Acabas de clonar el repo o hacer `pull` de cambios de otra persona que ya incluían migraciones nuevas — corres `generate` para que tu editor/TypeScript conozca los tipos actualizados (o directamente `pnpm install`, que lo dispara automáticamente vía el hook `postinstall` de Prisma).
- Borraste la carpeta `node_modules`/`generated` por error y necesitas reconstruir el cliente sin cambiar nada del schema.

### Regla práctica

> Si cambiaste `schema.prisma` → `migrate dev` (esto ya regenera el cliente por ti).
> Si el schema no cambió pero el cliente generado no existe o está desactualizado → `generate` a secas.

### Troubleshooting: cambio de tipo de columna falla por datos existentes

Si cambias el tipo de un campo que ya tiene filas en la base (ej. pasar `id String` a `id String @db.Uuid`), `migrate dev` puede fallar con algo así:

```
⚠️ We found changes that cannot be executed:
  • Changed the type of `id` on the `users` table. No cast exists, the column would be
    dropped and recreated, which cannot be done since the column is required and there
    is data in the table.
```

Pasa porque Postgres no sabe cómo convertir los valores existentes al nuevo tipo automáticamente. En desarrollo local, si no te importa perder los datos actuales, lo más simple es resetear la base primero (queda vacía) y recién ahí generar la migración nueva — sin data que convertir, el cambio de tipo no tiene conflicto:

```bash
# 1. Vacía la base y reaplica las migraciones YA existentes (sin los cambios nuevos del schema)
pnpm prisma migrate reset

# 2. Con la base vacía, genera y aplica la migración con los cambios pendientes del schema
pnpm prisma migrate dev --name nombre_del_cambio
```

No hace falta pasar `--schema`: Prisma ya lo toma de `prisma.config.ts`.

Si en cambio necesitas **conservar los datos** (por ejemplo en producción, o porque tienes data local que no quieres perder), no uses `migrate reset`. En su lugar:

```bash
pnpm prisma migrate dev --create-only --name nombre_del_cambio
```

Esto genera el archivo de migración sin aplicarlo. Ábrelo y agrega manualmente un `USING` antes del `ALTER COLUMN` para castear los valores existentes, por ejemplo:

```sql
ALTER TABLE "users" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
```

(el cast `::uuid` funciona si los valores actuales ya son UUIDs válidos como texto). Después aplica la migración editada con `pnpm prisma migrate dev`.

### Troubleshooting: `ReferenceError: exports is not defined in ES module scope`

Si al correr `pnpm run start:prod` (o `node dist/...`) ves este error apuntando a un archivo dentro de `dist/.../generated/prisma/client.js`, es porque el generador `prisma-client` de Prisma **genera código ESM nativo por defecto** (usa `import.meta.url`). Este proyecto es CommonJS (no tiene `"type": "module"` en `package.json`), así que `tsc` transpila el resto del archivo a CJS (`exports.x = ...`) pero **no puede transformar `import.meta.url`** — queda un archivo híbrido que Node no puede ejecutar ni como CJS ni como ESM.

**Solución:** forzar al generador a emitir CommonJS agregando `moduleFormat = "cjs"` en el bloque `generator client` de `schema.prisma`:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../generated/prisma"
  moduleFormat = "cjs"
}
```

Después, regenerar el cliente:

```bash
pnpm prisma generate
```

Nota relacionada: `nest build` compila a `dist/src/main.js` (no `dist/main.js`), por la estructura de carpetas del proyecto — el script `start:prod` ya apunta a la ruta correcta (`node dist/src/main`).

## `type` vs `interface` — cuándo usar cada uno

Regla práctica que seguimos en este repo:

**`interface`** — cuando defines la forma de un objeto "desde cero" (no derivada de otro tipo), sobre todo si algo la va a `implements` o `extends`:

```ts
// src/common/interfaces/hashing-adapter.interface.ts
export interface HashingAdapter {
  hash(plain: string): string;
  compare(plain: string, hash: string): Promise<boolean>;
}
// BcryptAdapter implements HashingAdapter

// src/auth/interfaces/request-with-user.interface.ts
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
```

**`type`** — cuando el tipo se **deriva/computa** a partir de otra cosa: uniones, genéricos, utility types, o el resultado de un tipo condicional/mapeado:

```ts
// src/auth/types/authenticated-user.type.ts
export type AuthenticatedUser = Prisma.UserGetPayload<{
  include: { credentials: true };
}>;
```

`Prisma.UserGetPayload<...>` es un alias genérico basado en tipos condicionales/mapeados (`GetResult<Payload, Args>` por dentro) — no una forma de objeto estática, así que no se puede escribir como `interface AuthenticatedUser extends Prisma.UserGetPayload<...>` (un `interface` solo puede extender object types estáticos, no un genérico que se resuelve condicionalmente). `type` también es la única opción para uniones (`'a' | 'b'`), tuplas, `Pick<T, K>`, `keyof T`, tipos de función, etc. — cosas que `interface` no puede expresar.

**Regla de bolsillo:** si vas a `implements` o `extends` algo → `interface`; si estás derivando un tipo de otro con genéricos/uniones → `type`. No hay un ganador "más usado" en general — la decisión la da esta regla, no popularidad. En el código relacionado a Prisma vas a ver casi siempre `type` (así generan ellos mismos sus tipos); en contratos de servicios (DTOs, adapters) es más común `interface`.

## Autenticación (JWT)

### `JWT_EXPIRES_IN` — qué tipo espera y qué valores acepta

`AuthModule` registra `JwtModule.register({ signOptions: { expiresIn: envs.jwtExpiresIn } })`. `expiresIn` **no acepta un `string` cualquiera**: su tipo real (heredado de `jsonwebtoken` vía `@nestjs/jwt`, definido en el paquete [`ms`](https://www.npmjs.com/package/ms)) es:

```ts
type Unit =
  | 'Years' | 'Year' | 'Yrs' | 'Yr' | 'Y'
  | 'Weeks' | 'Week' | 'W'
  | 'Days' | 'Day' | 'D'
  | 'Hours' | 'Hour' | 'Hrs' | 'Hr' | 'H'
  | 'Minutes' | 'Minute' | 'Mins' | 'Min' | 'M'
  | 'Seconds' | 'Second' | 'Secs' | 'Sec' | 's'
  | 'Milliseconds' | 'Millisecond' | 'Msecs' | 'Msec' | 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

type StringValue =
  | `${number}` // milisegundos, sin unidad: "3600000"
  | `${number}${UnitAnyCase}` // sin espacio: "1d", "2h"
  | `${number} ${UnitAnyCase}`; // con espacio: "1 day", "2 hours"
```

O directamente un `number` (interpretado siempre en **segundos**, no milisegundos — es la convención de `jsonwebtoken`, distinta a la de `ms`).

Como `envs.jwtExpiresIn` viene de `process.env` tipado como `string` genérico en `envs.ts`, TS no puede verificar en tiempo de compilación que cumple el formato `StringValue`. Por eso en `auth.module.ts` se castea explícitamente:

```ts
import { JwtSignOptions } from '@nestjs/jwt';

signOptions: {
  expiresIn: envs.jwtExpiresIn as JwtSignOptions['expiresIn'],
},
```

**Valores válidos para `JWT_EXPIRES_IN` en `.env`** (ejemplos, no exhaustivo — ver `Unit` arriba):

| Ejemplo    | Significado         |
| ---------- | -------------------- |
| `60`       | 60 segundos (número puro → segundos) |
| `"30s"`    | 30 segundos           |
| `"15m"`    | 15 minutos            |
| `"2h"`     | 2 horas               |
| `"1d"`     | 1 día                 |
| `"2 days"` | 2 días (forma larga, con espacio) |
| `"1w"`     | 1 semana              |
| `"1y"`     | 1 año                 |

Nota: `ms`/`jsonwebtoken` no distinguen mayúsculas/minúsculas (`UnitAnyCase`), así que `"1D"`, `"1d"` y `"1 Day"` son equivalentes.

### `@CurrentUser()` — leer el user autenticado en un resolver

`CurrentUser` (`src/auth/decorators/current-user.decorator.ts`) es un `createParamDecorator` que lee `req.user` (lo que `JwtStrategy.validate()` devolvió) desde el contexto de GraphQL. Tiene **dos formas de uso**, según si quieres el objeto completo o un solo campo:

**Caso A — sin argumento: devuelve el `AuthenticatedUser` completo**

```ts
@UseGuards(GqlAuthGuard)
@Query(() => User, { name: 'me' })
me(@CurrentUser() user: AuthenticatedUser) {
  return user;
}
```

Úsalo cuando el resolver expone un `@ObjectType()` (ej. `User`) y el cliente necesita elegir qué campos pedir. La query **sí lleva selection set** (llaves con los campos):

```graphql
query {
  me {
    id
    username
    role
  }
}
```

**Caso B — con argumento (`@CurrentUser('campo')`): devuelve solo ese campo**

```ts
@UseGuards(GqlAuthGuard)
@Query(() => String, { name: 'me' })
me(@CurrentUser('id') userId: string) {
  return userId;
}
```

Úsalo cuando solo necesitas un valor puntual (ej. el `id` para otra query/mutation) y el resolver expone un tipo escalar (`String`, `Boolean`, etc.), no un `ObjectType`. La query **no lleva selection set** — un escalar no tiene subcampos que elegir:

```graphql
query {
  me
}
```

**Regla práctica:** el tipo declarado en `@Query(() => X, ...)` y lo que devuelve la función deben coincidir. Si declaras `() => User` pero devuelves un `string` (o viceversa), no falla en compilación — falla en runtime cuando Apollo intenta resolver campos del `ObjectType` sobre un valor que no los tiene (ej. `Cannot return null for non-nullable field User.name`).

En ambos casos hay que mandar el JWT del login en el header, si no la query falla con `Unauthorized` (por el `GqlAuthGuard`):

```
Authorization: Bearer <accessToken>
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
