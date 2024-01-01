import { sql } from '@vercel/postgres';
import csv from 'csv-parser';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const result = 'Table created and data inserted'
    // create the table for the poems if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS Poems (location varchar(255), title varchar(255), url varchar(255));`;
    // Read the CSV file and insert the data into the table
    fs.createReadStream('/scripts/poems_table.csv')
      .pipe(csv())
      .on('data', async (row) => {
        const { location, title, url } = row;
        await sql`INSERT INTO Poems (location, title, url) VALUES (${location}, ${title}, ${url}) ON CONFLICT (url) DO NOTHING;`;
      });
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}