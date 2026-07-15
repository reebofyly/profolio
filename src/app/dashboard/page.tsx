"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3, Eye, Download, FolderKanban, TrendingUp, Plus, ArrowRight, ExternalLink
} from "lucide-react";

interface Profile { id: number; slug: string; title: string; is_active: boolean; }
interface Stats {
  metrics: { total_views: number; total_cv_downloads: number; total_project_clicks: number; average_duration_seconds: number; };
  chart_data: { date: string; views: number; downloads: number; clicks: number; }[];
}

export default function Dashboard() {
  const { user, apiFetch } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    apiFetch("/profiles")
      .then((r) => r.json())
      .then((data) => {
        const profilesList = Array.isArray(data) ? data : [];
        setProfiles(profilesList);
        setLoadingProfiles(false);
        if (profilesList.length > 0) {
          setLoadingStats(true);
          apiFetch(`/profiles/${profilesList[0].id}/stats`)
            .then((r) => r.json())
            .then((s) => {
              setStats(s);
              setLoadingStats(false);
            })
            .catch((err) => {
              console.error("Failed to load stats:", err);
              setLoadingStats(false);
            });
        }
      })
      .catch((err) => {
        console.error("Failed to load profiles:", err);
        setProfiles([]);
        setLoadingProfiles(false);
      });
  }, []);

  const maxViews = stats ? Math.max(...stats.chart_data.map((d) => d.views), 1) : 1;

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Bonjour, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-slate-500 mt-1 text-sm">Voici un aperçu de l'activité de votre profil.</p>
      </div>

      {/* Metric cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Visiteurs", value: stats.metrics.total_views, icon: Eye, color: "indigo" },
            { label: "CV téléchargés", value: stats.metrics.total_cv_downloads, icon: Download, color: "violet" },
            { label: "Clics projets", value: stats.metrics.total_project_clicks, icon: FolderKanban, color: "pink" },
            { label: "Durée moy.", value: formatDuration(stats.metrics.average_duration_seconds), icon: TrendingUp, color: "emerald" },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-${m.color}-50 text-${m.color}-600`}>
                <m.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{m.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {stats && stats.chart_data.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Activité des 7 derniers jours</h2>
              <p className="text-xs text-slate-400 mt-0.5">Vues · Téléchargements CV · Clics projets</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-300" />
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-40">
            {stats.chart_data.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div
                    className="w-full bg-indigo-500 rounded-t-md transition-all duration-700"
                    style={{ height: `${Math.round((day.views / maxViews) * 120)}px`, minHeight: day.views > 0 ? "4px" : "0px" }}
                    title={`Vues: ${day.views}`}
                  ></div>
                  <div
                    className="w-full bg-violet-400 rounded-none"
                    style={{ height: `${Math.round((day.downloads / maxViews) * 60)}px`, minHeight: day.downloads > 0 ? "2px" : "0px" }}
                    title={`DL: ${day.downloads}`}
                  ></div>
                  <div
                    className="w-full bg-pink-300 rounded-b-md"
                    style={{ height: `${Math.round((day.clicks / maxViews) * 40)}px`, minHeight: day.clicks > 0 ? "2px" : "0px" }}
                    title={`Clics: ${day.clicks}`}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div><span className="text-xs text-slate-400">Vues</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-violet-400 rounded-sm"></div><span className="text-xs text-slate-400">Téléchargements</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-pink-300 rounded-sm"></div><span className="text-xs text-slate-400">Clics projets</span></div>
          </div>
        </div>
      )}

      {/* My Profiles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-900 text-base">Mes profils</h2>
          <Link href="/dashboard/profiles/new"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all hover:scale-[1.02] shadow-sm shadow-indigo-200">
            <Plus className="w-3.5 h-3.5" /> Nouveau profil
          </Link>
        </div>

        {loadingProfiles ? (
          <div className="text-center py-8 text-slate-400 text-sm">Chargement...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm mb-3">Vous n'avez aucun profil pour l'instant.</p>
            <Link href="/dashboard/profiles/new"
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:bg-indigo-500">
              <Plus className="w-4 h-4" /> Créer votre premier profil
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {p.title.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{p.title}</p>
                    <p className="text-xs text-slate-400">profolio.app/u/{p.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500"}`}>
                    {p.is_active ? "Actif" : "Inactif"}
                  </span>
                  <a href={`/u/${p.slug}`} target="_blank" rel="noreferrer"
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-indigo-50">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link href={`/dashboard/profiles/${p.id}`}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
