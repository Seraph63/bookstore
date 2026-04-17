import { config } from './middleware';

// NextRequest richiede la Web API Request non disponibile in jsdom.
// Testiamo la logica del middleware mockando completamente next/server.

const mockRedirect = jest.fn((url: URL) => ({ type: 'redirect', url: url.toString() }));
const mockNext = jest.fn(() => ({ type: 'next' }));

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (...args: any[]) => mockRedirect(...args),
    next: (...args: any[]) => mockNext(...args),
  },
}));

function createMockRequest(pathname: string, hasCookie: boolean) {
  return {
    cookies: {
      get: (name: string) => hasCookie && name === 'auth_session' ? { value: 'true' } : undefined,
    },
    nextUrl: {
      pathname,
    },
    url: `http://localhost:3000${pathname}`,
  };
}

// Importiamo il middleware DOPO il mock di next/server
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { middleware } = require('./middleware');

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirect a /login se utente non autenticato su /', () => {
    const req = createMockRequest('/', false);
    middleware(req);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectUrl = mockRedirect.mock.calls[0][0].toString();
    expect(redirectUrl).toContain('/login');
  });

  test('redirect a /login se utente non autenticato su /profile', () => {
    const req = createMockRequest('/profile', false);
    middleware(req);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectUrl = mockRedirect.mock.calls[0][0].toString();
    expect(redirectUrl).toContain('/login');
  });

  test('prosegue normalmente se utente non autenticato è già su /login', () => {
    const req = createMockRequest('/login', false);
    middleware(req);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test('redirect a / se utente autenticato va su /login', () => {
    const req = createMockRequest('/login', true);
    middleware(req);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectUrl = mockRedirect.mock.calls[0][0].toString();
    expect(redirectUrl).not.toContain('/login');
  });

  test('prosegue normalmente se utente autenticato su /', () => {
    const req = createMockRequest('/', true);
    middleware(req);

    expect(mockNext).toHaveBeenCalled();
  });

  test('il matcher include le rotte corrette', () => {
    expect(config.matcher).toContain('/');
    expect(config.matcher).toContain('/login');
    expect(config.matcher).toContain('/profile/:path*');
  });
});
