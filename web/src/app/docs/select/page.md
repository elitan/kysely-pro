asdasd asd sd oiajsd oijasoid j

---

## Select all columns

```ts
const persons = await db.selectFrom("person").selectAll().execute();
```

```sql
SELECT
  *
FROM
  "person"
```

## A single column

```ts
const persons = await db.selectFrom("person").select("id").execute();
```

```sql
SELECT
  "id"
FROM
  "person"
```

## Multiple columns

This is how you will probably use `.select()` most of the time. In the query below, we also show how to use the table name in the column name (`person.id`).

```ts
const persons = await db
  .selectFrom("person")
  .select(["person.id", "first_name"])
  .execute();
```

```sql
SELECT
  "person"."id",
  "first_name"
FROM
  "person"
```

## Column with a table

```ts
const persons = await db
  .selectFrom(["person", "pet"])
  .select("person.id")
  .execute();
```

## Aliased Columns

```ts
const persons = await db
  .selectFrom("person as p")
  .select(["first_name as fn", "p.last_name as ln"])
  .execute();
```

```sql
SELECT
  "first_name" AS "fn",
  "p"."last_name" AS "ln"
FROM
  "person" AS "p"
```

## Select count

Use [function calls](/docs/function-calls) to select count.

```ts
const persons = await db
  .selectFrom("person")
  .select((eb) => eb.fn.countAll().as("count"))
  .execute();
```

```sql
SELECT
  count(*) AS "count"
FROM
  "person"
```

## Nested array

```ts
import { jsonArrayFrom } from "kysely/helpers/postgres";

const result = await db
  .selectFrom("person")
  .select((eb) => [
    "id",
    jsonArrayFrom(
      eb
        .selectFrom("pet")
        .select(["pet.id as pet_id", "pet.name"])
        .whereRef("pet.owner_id", "=", "person.id")
        .orderBy("pet.name"),
    ).as("pets"),
  ])
  .execute();
```

```sql
SELECT
"id",
(
  SELECT
    COALESCE(JSON_AGG(agg), '[]')
  FROM
    (
      SELECT
        "pet"."id" AS "pet_id",
        "pet"."name"
      FROM
        "pet"
      WHERE
        "pet"."owner_id" = "person"."id"
      ORDER BY
        "pet"."name"
    ) AS agg
) AS "pets"
FROM
"person"
```

## Complex Selection

```ts
import { sql } from "kysely";

const persons = await db
  .selectFrom("person")
  .select(({ eb, selectFrom, or }) => [
    // Select a correlated subquery
    selectFrom("pet")
      .whereRef("person.id", "=", "pet.owner_id")
      .select("pet.name")
      .orderBy("pet.name")
      .limit(1)
      .as("first_pet_name"),

    // Build and select an expression using
    // the expression builder
    or([eb("first_name", "=", "Jennifer"), eb("first_name", "=", "Arnold")]).as(
      "is_jennifer_or_arnold",
    ),

    // Select a raw sql expression
    sql<string>`concat(first_name, ' ', last_name)`.as("full_name"),
  ])
  .execute();
```

```sql
SELECT
  (
    SELECT
      "pet"."name"
    FROM
      "pet"
    WHERE
      "person"."id" = "pet"."owner_id"
    ORDER BY
      "pet"."name"
    LIMIT
      $1
  ) AS "first_pet_name",
  (
    "first_name" = $2
    OR "first_name" = $3
  ) AS "is_jennifer_or_arnold",
  concat(first_name, ' ', last_name) AS "full_name"
FROM
  "person"
```
