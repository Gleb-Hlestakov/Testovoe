import React, { useState, useEffect, useRef, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchRecords } from '../api/records'
import type { Record as ApiRecord } from '../api/records'

interface TableProps {
  extraRecords?: ApiRecord[]
}

export const Table: React.FC<TableProps> = ({ extraRecords = [] }) => {
  const [apiItems, setApiItems] = useState<ApiRecord[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const mountedRef = useRef(false)
  const LIMIT = 20

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    loadMore()
  }, [])

  const loadMore = async () => {
    try {
      const newRecs = await fetchRecords(page, LIMIT)
      setApiItems(prev => [...prev, ...newRecs])
      setPage(prev => prev + 1)
      if (newRecs.length < LIMIT) {
        setHasMore(false)
      }
    } catch {
      setHasMore(false)
    }
  }

  const merged: ApiRecord[] = useMemo(() => {
    const ids = new Set<string | number>()
    const result: ApiRecord[] = []

    apiItems.forEach(r => {
      if (!ids.has(r.id)) {
        ids.add(r.id)
        result.push(r)
      }
    })
    extraRecords.forEach(r => {
      if (!ids.has(r.id)) {
        ids.add(r.id)
        result.push(r)
      }
    })
    return result
  }, [apiItems, extraRecords])

  const columns: string[] = useMemo(() => {
    const keysOrder: string[] = []
    const seen = new Set<string>()

    merged.forEach(record => {
      Object.keys(record).forEach(key => {
        if (key === 'id') return
        if (!seen.has(key)) {
          seen.add(key)
          keysOrder.push(key)
        }
      })
    })
    return keysOrder
  }, [merged])

  const fieldLabels: Record<string, string> = {
    field1: 'Поле 1',
    field2: 'Поле 2',
    field3: 'Поле 3',
    field4: 'Поле 4',
    field5: 'Поле 5',
    field6: 'Поле 6',
    field7: 'Поле 7',
  }

  return (
    <InfiniteScroll
      dataLength={merged.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4 style={{ textAlign: 'center' }}>Загрузка...</h4>}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>ID</th>
            {columns.map(col => (
              <th key={col} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {fieldLabels[col] ?? col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {merged.map(record => (
            <tr key={record.id}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {record.id}
              </td>
              {columns.map(col => (
                <td
                  key={col}
                  style={{ border: '1px solid #ccc', padding: '0.5rem' }}
                >
                  {record[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </InfiniteScroll>
  )
}
