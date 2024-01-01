// endpoint to select all poem markers from the database
import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const client = await db.connect()
    const { rows: poems } = await client.sql`SELECT * FROM Poems`;
    client.release()
    return NextResponse.json({ poems }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}