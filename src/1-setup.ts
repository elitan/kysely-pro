import { db } from "./utils/db";

async function main() {
  const posts = await db.selectFrom("blogPosts").selectAll().execute();

  console.log({ posts });
}

main();
