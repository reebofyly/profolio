"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Plus, ExternalLink, ArrowRight, Loader2, Trash2, Eye, EyeOff, PenLine } from "lucide-react";

interface Profile { id: number; slug: string; title: string; is_active: boolean; theme: string; template?: string; }

export default function ProfilesPage() {
  const { apiFetch } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    apiFetch("/profiles")
      .then((r) => r.json())
      .then((data) => {
        setProfiles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profiles:", err);
        setProfiles([]);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce profil définitivement ?")) return;
    setDeleting(id);
    await apiFetch(`/profiles/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const toggleActive = async (profile: Profile) => {
    await apiFetch(`/profiles/${profile.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...profile, is_active: !profile.is_active }),
    });
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mes profils</h1>
          <p className="text-slate-500 mt-1 text-sm">Gérez vos identités professionnelles.</p>
        </div>
        <Link href="/dashboard/profiles/new"
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" /> Nouveau profil
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 mb-4">Aucun profil pour l'instant.</p>
          <Link href="/dashboard/profiles/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-500 transition-all">
            <Plus className="w-4 h-4" /> Créer votre premier profil
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {p.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                    <p className="text-xs text-slate-400">/u/{p.slug}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {p.is_active ? "Actif" : "Inactif"}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/dashboard/profiles/${p.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                  <PenLine className="w-3.5 h-3.5" /> Modifier
                </Link>
                <a href={`/u/${p.slug}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => toggleActive(p)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                  title={p.is_active ? "Désactiver" : "Activer"}>
                  {p.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                  {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
