import React, { useState, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchRecords } from '../api/records'
import type { Record } from '../api/records'

interface TableProps {
  extraRecords?: Record[]
}

export const Table: React.FC<TableProps> = ({ extraRecords = [] }) => {
  const [apiItems, setApiItems] = useState<Record[]>([])
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

  const merged = [
    ...extraRecords.filter(r => !apiItems.some(a => a.id === r.id)),
    ...apiItems,
  ]

  return (
    <InfiniteScroll
      dataLength={merged.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4 className="load-message">Загрузка...</h4>}
      endMessage={<p className="load-message">Больше нет данных</p>}
    >
      <table className="infinite-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Поле 1</th>
            <th>Поле 2</th>
            <th>Поле 3</th>
            <th>Поле 4</th>
            <th>Поле 5</th>
          </tr>
        </thead>
        <tbody>
          {merged.map(record => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.field1}</td>
              <td>{record.field2}</td>
              <td>{record.field3}</td>
              <td>{record.field4}</td>
              <td>{record.field5}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfiniteScroll>
  )
}
