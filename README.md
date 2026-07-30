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
