"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw, Lock } from "lucide-react";

export default function NewProfile() {
  const { apiFetch } = useAuth();
  const router = useRouter();

  // Generates a short random alphanumeric suffix (6 chars)
  const generateSuffix = () =>
    Math.random().toString(36).substring(2, 8);

  // Slugify a string and append a unique suffix
  const buildSlug = (title: string, suffix: string) => {
    const base = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // remove accents
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 30);
    return base ? `${base}-${suffix}` : suffix;
  };

  const [suffix, setSuffix] = useState(() => generateSuffix());

  const [form, setForm] = useState({
    title: "",
    slug: "",
    bio: "",
    contact_email: "",
    contact_phone: "",
    contact_location: "",
    social_github: "",
    social_linkedin: "",
    social_behance: "",
    social_twitter: "",
    social_website: "",
    template: "classic",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-update slug whenever title changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      slug: buildSlug(prev.title, suffix),
    }));
  }, [form.title, suffix]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Regenerate slug with a fresh random suffix
  const handleRegenerateSlug = () => {
    const newSuffix = generateSuffix();
    setSuffix(newSuffix);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiFetch("/profiles", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || JSON.stringify(data.errors));
      router.push(`/dashboard/profiles/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-all text-sm";

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/profiles" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Nouveau profil</h1>
          <p className="text-slate-500 text-sm mt-0.5">Renseignez les informations de base de votre nouveau profil.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Identité du profil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Titre du profil *</label>
              <input name="title" required value={form.title} onChange={handleChange} placeholder="Ex: Développeur Full Stack, Designer Freelance..." className={inputCls} />
            </div>

            {/* Auto-generated slug display */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                URL du profil
                <span className="ml-2 text-[10px] font-normal text-slate-400 normal-case tracking-normal">
                  ✦ Générée automatiquement
                </span>
              </label>
              <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-300 transition-all">
                <span className="px-4 py-3 bg-slate-100 border-r border-slate-200 text-sm text-slate-400 font-medium shrink-0 flex items-center">
                  profolio.app/u/
                </span>
                <div className="flex-1 px-4 py-3 text-sm font-mono text-slate-700 flex items-center gap-2 min-w-0">
                  <Lock className="w-3 h-3 text-slate-300 shrink-0" />
                  <span className="truncate">{form.slug || <span className="text-slate-300 italic">généré depuis le titre</span>}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  title="Regénérer un nouvel identifiant unique"
                  className="px-4 py-3 bg-slate-100 border-l border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Regénérer</span>
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400">
                L'URL est construite à partir de votre titre + un identifiant unique. Cliquez sur <strong>Regénérer</strong> pour obtenir un nouvel identifiant.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Résumé professionnel</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Décrivez votre profil en quelques phrases..." className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Gabarit visuel du profil (Template)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { 
                id: "classic", 
                name: "Classic", 
                desc: "Mise en page classique divisée en colonnes, frise chronologique sombre et présentation épurée.",
              },
              { 
                id: "minimalist", 
                name: "Minimalist", 
                desc: "Design minimaliste à colonne unique centré, typographie aérée et focus absolu sur le contenu.",
              },
              { 
                id: "developer", 
                name: "Developer / Monospace", 
                desc: "Thème typé console / IDE avec police monospace, blocs de code, et accents vert fluo/cyan.",
              },
              { 
                id: "creative", 
                name: "Creative / Bold", 
                desc: "Mise en page dynamique et asymétrique, dégradés vibrants et conteneurs en verre flouté.",
              },
              { 
                id: "neumorphism", 
                name: "Neumorphism / Soft UI", 
                desc: "Design tactile avec ombres douces et effets 3D d'embossage.",
              },
              { 
                id: "bento", 
                name: "Bento / Grid UI", 
                desc: "Mise en page ludique en grille asymétrique façon écosystème Apple.",
              },
              { 
                id: "luxury", 
                name: "Luxury / Dark Elegance", 
                desc: "Thème sombre haut de gamme, typographie serif et accents dorés.",
              },
              { 
                id: "saas", 
                name: "SaaS / Modern Startup", 
                desc: "Style épuré de startup tech, halos vibrants et cartes nettes.",
              }
            ].map((t) => (
              <label 
                key={t.id} 
                className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                  form.template === t.id 
                    ? "border-indigo-600 bg-indigo-50/20 shadow-md shadow-indigo-600/5" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input 
                  type="radio" 
                  name="template" 
                  value={t.id} 
                  checked={form.template === t.id} 
                  onChange={handleChange} 
                  className="absolute right-4 top-4 w-4 h-4 text-indigo-600" 
                />
                <div className="space-y-1.5 pr-8">
                  <span className="font-extrabold text-sm text-slate-800 block">{t.name}</span>
                  <span className="text-xs text-slate-400 font-semibold block leading-relaxed">{t.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Informations de contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email de contact</label>
              <input name="contact_email" type="email" value={form.contact_email} onChange={handleChange} placeholder="email@exemple.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Téléphone</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="+33 6 12 34 56 78" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Localisation</label>
              <input name="contact_location" value={form.contact_location} onChange={handleChange} placeholder="Paris, France" className={inputCls} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Réseaux sociaux</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "social_github", label: "GitHub", placeholder: "https://github.com/username" },
              { name: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
              { name: "social_behance", label: "Behance", placeholder: "https://behance.net/username" },
              { name: "social_twitter", label: "Twitter / X", placeholder: "https://twitter.com/username" },
              { name: "social_website", label: "Site personnel", placeholder: "https://votre-site.com" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
                <input name={f.name} type="url" value={(form as any)[f.name]} onChange={handleChange} placeholder={f.placeholder} className={inputCls} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/profiles" className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            Annuler
          </Link>
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Créer le profil
          </button>
        </div>
      </form>
    </div>
  );
}
