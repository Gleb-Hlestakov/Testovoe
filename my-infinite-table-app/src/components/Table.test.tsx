// src/components/Table.test.tsx

import React from 'react';

// React Testing Library
import { render, screen, waitFor } from '@testing-library/react';

// jest-dom добавляет матчеры (toBeInTheDocument и т.п.)
import '@testing-library/jest-dom';

// MSW: мокаем сетевые запросы
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Импортируем сам компонент Table
import { Table } from './Table';

// -------------------------------------------------------------
// 1) Настраиваем Mock Service Worker
//    Когда придёт GET на http://localhost:4000/records,
//    вернём два объекта { id: 1, … } и { id: 2, … }.
// -------------------------------------------------------------
const server = setupServer(
  rest.get('http://localhost:4000/records', (req: any, res: any, ctx: any) => {
    return res(
      ctx.json([
        {
          id: 1,
          field1: 'A',
          field2: 'B',
          field3: 'C',
          field4: 'D',
          field5: 'E',
        },
        {
          id: 2,
          field1: 'X',
          field2: 'Y',
          field3: 'Z',
          field4: 'W',
          field5: 'V',
        },
      ])
    );
  })
);

// -------------------------------------------------------------
// 2) Jest-хуки для управления MSW-сервером
//    beforeAll  – запустить server.listen() перед всеми тестами
//    afterEach  – сбросить любые кастомные хендлеры после каждого теста
//    afterAll   – закрыть server после всех тестов
// -------------------------------------------------------------
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// -------------------------------------------------------------
// 3) Сам тест
//    – Рендерим <Table />
//    – Проверяем, что до получения ответа есть текст «Загрузка»
//    – Ждём, пока появятся ячейки «A» и «X», и ассертим их
// -------------------------------------------------------------
test('таблица сначала показывает «Загрузка…», а затем рендерит данные из API', async () => {
  // Рендерим компонент
  render(<Table />);

  // 1) До ответа сервера должен быть виден loader «Загрузка…»
  expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();

  // 2) Дожидаемся, пока MSW не вернёт данные, и <Table> их отрендерит
  await waitFor(() => {
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
  });
});

