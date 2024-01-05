# 1. Setup

## Start Docker

```bash
docker compose up -d
```

> To learn more about Docker, check out [Docker in 100 Seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ).

## Install Kysely, other dependencies

```bash
npm install --save-dev typescript ts-node @types/node kysely pg @types/pg kysely-codegen
```

## Initialize TypeScript

```bash
tsc -init .
```

## Configure Kysely Codegen

```json
{
  ...,
  "scripts": {
    ...,
    "codegen": "kysely-codegen --dialect postgres --camel-case --out-file ./src/utils/kysely-types.d.ts"
  },
  "dependencies": {
    ...
  }
}
```

## Setup Kysely

In `src/utils/db.ts`:

```ts
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { type DB } from "./kysely-types";
import { Pool } from "pg";

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL as string,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});
```

## Insert table into Postgres

```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT DEFAULT 'Untitled Post',
  content TEXT DEFAULT 'No content yet.',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments_enabled BOOLEAN DEFAULT TRUE
);
```
