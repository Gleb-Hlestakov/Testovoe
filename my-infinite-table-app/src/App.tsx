// src/App.tsx
import React, { useState } from 'react';
import { Form } from './components/Form';
import { Table } from './components/Table';
import type { Record } from './api/records';

const App: React.FC = () => {
  // Тут храним новые записи, добавленные через форму
  const [recordsFromForm, setRecordsFromForm] = useState<Record[]>([]);

  // Функция-колбэк, её мы передадим в Form
  const handleNewRecord = (newRec: Record) => {
    // Ставим в начало списка, чтобы видеть новые сразу сверху
    setRecordsFromForm(prev => [newRec, ...prev]);
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Infinite Table + Форма</h1>

      {/* Форма для добавления записи */}
      <Form onNew={handleNewRecord} />

      {/* Таблица, которая объединит записи из формы и из API */}
      <Table extraRecords={recordsFromForm} />
    </div>
  );
};

export default App;
