"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar"; // Verifica se 'n' è maiuscola o minuscola
import EditProfileForm from "@/components/profile/EditProfileForm";

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Recupera l'utente dal localStorage (come fa probabilmente la tua pagina /profile)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {user ? (
            <EditProfileForm initialData={user} />
          ) : (
            <div className="text-center p-10 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
              <p className="text-gray-500">Recupero sessione utente...</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}