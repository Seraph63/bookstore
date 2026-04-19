"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface EditProfileFormProps {
  initialData?: {
    id: number;
    nome: string;
    cognome: string;
    email: string;
  };
}

export default function EditProfileForm({ initialData }: EditProfileFormProps) {
  const router = useRouter();
  
  // Inizializziamo lo stato del form
  const [formData, setFormData] = useState(initialData || {
    id: 0,
    nome: "",
    cognome: "",
    email: ""
  });

  // Aggiorniamo il form se i dati iniziali cambiano
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!formData) {
    return <div className="p-8 text-center">Caricamento dati...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = formData.id;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Aggiorna la sessione locale
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Redirigiamo l'utente alla pagina profilo
        router.push('/profile?updated=true');
      } else {
        // UTILIZZO DI SONNER: Mostriamo l'errore se il server risponde male
        toast.error("Errore durante il salvataggio. Riprova.");
      }
    } catch (error) {
      console.error("Errore:", error);
      // UTILIZZO DI SONNER: Errore di connessione
      toast.error("Impossibile raggiungere il server.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-6">Modifica Profilo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome</label>
          <input
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="cognome" className="block text-sm font-medium mb-1">Cognome</label>
          <input
            id="cognome"
            type="text"
            value={formData.cognome}
            onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 mt-4"
        >
          Salva Modifiche
        </button>
      </form>
    </div>
  );
}