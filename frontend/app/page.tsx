import React from 'react';

async function getBooks() {
  try {
    // IMPORTANTE: 'api' è il nome del servizio nel docker-compose.yml
    const res = await fetch('http://api:8080/api/books', {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if(!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Errore fetch libri:", error);
    return [];
  }
}

export default async function HomePage() {
  const books = await getBooks();

  return (

    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Bookstore - vendita libri online</h2>

      {books.length === 0 ? (
        <p className="text-red-500">Nessun libro trovato o errore di connessione al backend.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book: any) => (
            <div key={book.id} className="border p-4 rounded shadow">
              <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover mb-2" />
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.authors}</p>
              <p className="text-blue-600 font-bold mt-2">€{book.price}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}