import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (request.body) {
    const body = await request.json();
    const { location, title, url } = body;

    try {
      if (!location || !title || !url) throw new Error('Location, title, and url are required');
      const client = await db.connect();

      // Check if a poem with the same URL already exists
      const existingPoem = await client.sql`SELECT * FROM Poems WHERE url = ${url};`;

      // If poems with the same URL already exist, delete them
      if (existingPoem.rowCount > 0) {
        await client.sql`DELETE FROM Poems WHERE url = ${url};`;
      }

      // Insert the new poem into the database
      await client.sql`
        INSERT INTO Poems (location, title, url)
        VALUES (${location}, ${title}, ${url});
      `;

      client.release()
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const client = await db.connect();
    const poems = await client.sql`SELECT * FROM Poems;`;
    client.release()
    return NextResponse.json({ poems }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Request body is null' }, { status: 400 });
  }
}