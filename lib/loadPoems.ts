import { addPoem } from '@/lib/dbOperations';
import poems from '@/scripts/poems_table.json';

type Poem = {
    location: string;
    title: string;
    url: string;
};

export async function loadPoems() {
    for (const poem of poems) {
      // Add the poem to the database
      await addPoem(poem as Poem);
    }
  }