import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
    try {
      const client = await db.connect()
      const { location } = await request.json();
      await client.sql`DELETE FROM Poems WHERE location = ${location}`;
      client.release()
      return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }