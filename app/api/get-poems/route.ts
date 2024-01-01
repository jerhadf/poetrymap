// endpoint to select all poem markers from the database
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const poems = await sql`SELECT * FROM Poems`;
    return NextResponse.json({ poems }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}