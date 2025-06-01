// src/components/Table.tsx
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchRecords } from '../api/records';
import type { Record } from '../api/records';

interface TableProps {
  extraRecords?: Record[];
}

export const Table: React.FC<TableProps> = ({ extraRecords = [] }) => {
  // Массив локально добавленных записей через форму
  const [localItems, setLocalItems] = useState<Record[]>([...extraRecords]);
  // Массив записей, подгруженных с API
  const [apiItems, setApiItems] = useState<Record[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const LIMIT = 20;

  // Если prop extraRecords меняется, мы просто перезаписываем localItems
  useEffect(() => {
    setLocalItems([...extraRecords]);
  }, [extraRecords]);

  // При первом рендере загружаем первую страницу API
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    try {
      const newRecs = await fetchRecords(page, LIMIT);
      setApiItems(prev => [...prev, ...newRecs]);
      setPage(prev => prev + 1);
      if (newRecs.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading records:', error);
      setHasMore(false);
    }
  };

  // Объединяем сначала локальные, а потом из API
  const allItems = [...localItems, ...apiItems];

  return (
    <InfiniteScroll
      dataLength={allItems.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Загрузка...</h4>}
      endMessage={<p style={{ textAlign: 'center' }}>Больше нет данных</p>}
    >
      <table
        border={1}
        cellPadding={5}
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
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
          {allItems.map((record, index) => (
            // Используем index в качестве ключа только для иллюстрации; лучше key={record.id}, если id уникален
            <tr key={record.id ?? index}>
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
  );
};

