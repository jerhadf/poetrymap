import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// visit http://localhost:3000/api/create-poems-table to run this endpoint

export async function GET(request: Request) {
  try {
    const client = await db.connect()
    // create the table for the poems if it doesn't exist
    await client.sql`CREATE TABLE IF NOT EXISTS Poems (location varchar(255), title varchar(255), url varchar(255));`;
    client.release()
    return NextResponse.json({ message: 'Table created'}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}