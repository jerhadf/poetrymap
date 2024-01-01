import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (request.body) {
    const body = await request.json();
    const { location, title, url } = body;


    try {
      if (!location || !title || !url) throw new Error('Location, title, and url are required');
      await sql`INSERT INTO Poems (location, title, url) VALUES (${location}, ${title}, ${url});`;
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const poems = await sql`SELECT * FROM Poems;`;
    return NextResponse.json({ poems }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Request body is null' }, { status: 400 });
  }
}