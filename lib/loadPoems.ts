import { addPoem } from '@/lib/dbOperations';
import csv from 'csv-parser';
import fs from 'fs';

type Poem = {
    location: string;
    title: string;
    url: string;
};

export async function loadPoems() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('/scripts/poems_table.csv')
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      })
      .pipe(csv())
      .on('data', async (row) => {
        const { location, title, url } = row;
        const poem: Poem = {
          location,
          title,
          url,
        };

        // Add the poem to the database
        await addPoem(poem);
      })
      .on('end', resolve);
  });
}