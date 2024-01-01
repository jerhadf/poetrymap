import { db } from '@vercel/postgres';
import csv from 'csv-parser';
import fs from 'fs';
import { NextResponse } from 'next/server';

// visit http://localhost:3000/api/create-poems-table to run this endpoint

export async function GET(request: Request) {
  try {
    const client = await db.connect()
    // create the table for the poems if it doesn't exist
    await client.sql`CREATE TABLE IF NOT EXISTS Poems (location varchar(255), title varchar(255), url varchar(255));`;
    // Read the CSV file and insert the data into the table
    await new Promise((resolve, reject) => {
        fs.createReadStream('/scripts/poems_table.csv')
            .pipe(csv())
            .on('data', async (row) => {
            const { location, title, url } = row;
            await client.sql`INSERT INTO Poems (location, title, url) VALUES (${location}, ${title}, ${url}) ON CONFLICT (url) DO NOTHING;`;
            })
            .on('end', resolve)
            .on('error', reject);
    });
    // Fetch the top 10 rows from the table
    const result = await client.sql`SELECT * FROM Poems LIMIT 5`;
    const rows = result.rows.map(row => `Location: ${row.location}, Title: ${row.title}, URL: ${row.url}`);
    client.release()
    return NextResponse.json({ message: 'Table created and data inserted', rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}