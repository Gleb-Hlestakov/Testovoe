// jest.config.js
export default {
  // Указываем Jest искать тесты в файлах с расширением .test.tsx и .test.ts
  roots: ['<rootDir>/src'],

  // Прописать, каким образом обрабатывать .ts и .tsx файлы
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Расширения, которые Jest будет распознавать
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Автоматически подключать jest-dom (импорт из '@testing-library/jest-dom/extend-expect')
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Если в проекте используются абсолютные пути или алиасы Webpack/Vite,
  // их тоже нужно прописать здесь (в секции moduleNameMapper). 
  // Но в нашем случае у нас обычные относительные импорты.
};
