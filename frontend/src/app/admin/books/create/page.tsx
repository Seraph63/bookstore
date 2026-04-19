"use client";
import BookForm from '@/components/admin/BookForm';

export default function CreateBookPage() {
  // L'autenticazione admin è gestita dal layout admin

  return (
    <div className="py-8">
      <BookForm mode="create" />
    </div>
  );
}