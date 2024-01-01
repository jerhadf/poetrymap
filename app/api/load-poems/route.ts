import { addPoem } from '@/lib/dbOperations';
import csv from 'csv-parser';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

type Poem = {
    location: string;
    title: string;
    url: string;
};

export default {
  async GET(req: NextApiRequest, res: NextApiResponse) {
    fs.createReadStream('/scripts/poems_table.csv')
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ error: 'Error reading CSV file' });
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
      .on('end', () => {
        res.status(204).end(); // Return a 204 No Content status code
      });
  }
}