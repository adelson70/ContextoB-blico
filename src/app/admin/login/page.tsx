"use client";

import React, { useState } from "react";
import { login } from "@/src/services/auth";
import { toast } from "react-toastify";


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, senha)
      .catch(error => {
        console.log('aqui')
        toast.error(error.message)
      })
  };

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#16203a] via-[#0F172A] to-[#1a1a1a] overflow-hidden">
      {/* Efeitos de luz no background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(250,204,21,0.08) 0%, transparent 100%)," +
            "radial-gradient(ellipse 40% 20% at 20% 80%, rgba(56,189,248,0.10) 0%, transparent 100%)",
        }}
      />

      {/* Card de login */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm px-6 py-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h1>

        <label className="block mb-4">
          <span className="text-gray-200">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 bg-white/10 border border-white/20 text-white rounded-md focus:ring focus:ring-blue-400 focus:outline-none"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-200">Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 block w-full p-2 bg-white/10 border border-white/20 text-white rounded-md focus:ring focus:ring-blue-400 focus:outline-none"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
