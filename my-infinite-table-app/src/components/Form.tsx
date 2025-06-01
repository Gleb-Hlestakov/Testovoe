// src/components/Form.tsx
import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Record } from '../api/records';

interface FormValues {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
}

interface FormProps {
  onNew: (rec: Record) => void;
}

export const Form: React.FC<FormProps> = ({ onNew }) => {
  // Инициализируем пустой «контролируемый» стейт для 5 полей
  const [values, setValues] = useState<FormValues>({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция-обработчик изменения любого поля
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // При сабмите отправляем запрос на добавление
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Формируем тело запроса: 
      // json-server сам проставит новый id
      const response = await fetch('http://localhost:4000/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }

      const newRecord: Record = await response.json();
      // Передаём наверх добавленную запись
      onNew(newRecord);

      // Сбрасываем форму после успешного добавления
      setValues({
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
      });
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div>
        <label>
          Поле 1:{' '}
          <input
            name="field1"
            value={values.field1}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Поле 2:{' '}
          <input
            name="field2"
            value={values.field2}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Поле 3:{' '}
          <input
            name="field3"
            value={values.field3}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Поле 4:{' '}
          <input
            name="field4"
            value={values.field4}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Поле 5:{' '}
          <input
            name="field5"
            value={values.field5}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? 'Сохраняем…' : 'Добавить запись'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>Ошибка: {error}</div>
      )}
    </form>
  );
};
