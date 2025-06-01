export interface Record {
    id: number;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    // … добавь до 15
  }
  
  const API_URL = 'http://localhost:4000';
  
  export async function fetchRecords(page: number, limit = 20): Promise<Record[]> {
    const res = await fetch(`${API_URL}/records?_page=${page}&_limit=${limit}`);
    if (!res.ok) throw new Error('Ошибка сети');
    return res.json();
  }
  