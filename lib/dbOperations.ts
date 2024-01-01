import { db } from '@vercel/postgres';

type Poem = {
    location: string;
    title: string;
    url: string;
};

export async function addPoem(poem: Poem) {
  const client = await db.connect();
  const { location, title, url } = poem;
  await client.sql`INSERT INTO Poems (location, title, url) VALUES (${location}, ${title}, ${url});`;
  client.release();
}