import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface BlogPosts {
  commentsEnabled: Generated<boolean | null>;
  content: Generated<string | null>;
  createdAt: Generated<Timestamp | null>;
  id: Generated<number>;
  isPublished: Generated<boolean | null>;
  likes: Generated<number | null>;
  publishDate: Generated<Timestamp | null>;
  title: Generated<string | null>;
  viewCount: Generated<number | null>;
}

export interface DB {
  blogPosts: BlogPosts;
}
