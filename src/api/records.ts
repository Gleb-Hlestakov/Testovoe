export interface Record {
  id: number | string
  [key: string]: any
}

const API_URL = 'http://localhost:4000'

export async function fetchRecords(page: number, limit = 20): Promise<Record[]> {
  const res = await fetch(
    `${API_URL}/records?_page=${page}&_limit=${limit}`
  )
  if (!res.ok) throw new Error('Ошибка сети')
  return res.json()
}



