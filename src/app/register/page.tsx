"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Register() {
  const { register, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password, passwordConfirmation);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden text-slate-100 min-h-screen">
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">P</div>
            <span className="font-extrabold text-3xl tracking-tight bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">Profolio</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
          <p className="text-sm text-slate-400 mt-2 text-center">Commencez à construire votre identité professionnelle dès maintenant.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nom complet</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><User className="w-5 h-5" /></span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Mail className="w-5 h-5" /></span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@exemple.com" className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Lock className="w-5 h-5" /></span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Lock className="w-5 h-5" /></span>
                <input type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Créer mon profil <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></>)}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
