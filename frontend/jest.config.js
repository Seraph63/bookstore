import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Percorso dell'app Next.js per caricare next.config.js e i file .env
  dir: './',
})

// Configurazioni personalizzate di Jest
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    // Gestisce gli alias dei percorsi (se usi @/ nel progetto)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
