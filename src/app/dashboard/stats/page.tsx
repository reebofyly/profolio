"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Eye, Download, FolderKanban, TrendingUp, Loader2 } from "lucide-react";

interface Stats {
  metrics: { total_views: number; total_cv_downloads: number; total_project_clicks: number; average_duration_seconds: number; };
  chart_data: { date: string; views: number; downloads: number; clicks: number; }[];
  top_projects: { project_id: number; title: string; clicks: number; }[];
}

export default function StatsPage() {
  const { apiFetch } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    apiFetch("/profiles").then(r => r.json()).then((data) => {
      setProfiles(data);
      setLoading(false);
      if (data.length > 0) {
        setSelectedId(data[0].id);
        loadStats(data[0].id);
      }
    });
  }, []);

  const loadStats = (profileId: number) => {
    setLoadingStats(true);
    apiFetch(`/profiles/${profileId}/stats`).then(r => r.json()).then((s) => {
      setStats(s); setLoadingStats(false);
    });
  };

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };

  const maxViews = stats ? Math.max(...stats.chart_data.map(d => d.views), 1) : 1;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Statistiques</h1>
          <p className="text-slate-500 mt-1 text-sm">Analysez l'attractivité de vos profils en temps réel.</p>
        </div>
        {profiles.length > 1 && (
          <select value={selectedId || ""} onChange={e => { const id = Number(e.target.value); setSelectedId(id); loadStats(id); }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-400">
            {profiles.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        )}
      </div>

      {loading || loadingStats ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : !stats ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm">Aucune donnée disponible.</div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Visiteurs totaux", value: stats.metrics.total_views, icon: Eye, color: "indigo", sub: "profil ouvert" },
              { label: "CV téléchargés", value: stats.metrics.total_cv_downloads, icon: Download, color: "violet", sub: "fois" },
              { label: "Clics projets", value: stats.metrics.total_project_clicks, icon: FolderKanban, color: "pink", sub: "interactions" },
              { label: "Durée moyenne", value: formatDuration(stats.metrics.average_duration_seconds), icon: TrendingUp, color: "emerald", sub: "par visite" },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${m.color}-50 text-${m.color}-600`}>
                  <m.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{m.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{m.label}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-900">Activité — 7 derniers jours</h2>
                <p className="text-xs text-slate-400 mt-0.5">Vues · Téléchargements CV · Clics projets</p>
              </div>
              <BarChart3 className="w-5 h-5 text-slate-200" />
            </div>
            <div className="flex items-end gap-3 h-48">
              {stats.chart_data.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex flex-col items-center gap-0.5">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {day.views} vues · {day.downloads} DL
                    </div>
                    <div className="w-full bg-indigo-500 rounded-t-lg transition-all duration-700" style={{ height: `${Math.round((day.views / maxViews) * 160)}px`, minHeight: day.views > 0 ? "6px" : "0px" }}></div>
                    <div className="w-full bg-violet-400" style={{ height: `${Math.round((day.downloads / maxViews) * 80)}px`, minHeight: day.downloads > 0 ? "3px" : "0px" }}></div>
                    <div className="w-full bg-pink-300 rounded-b-lg" style={{ height: `${Math.round((day.clicks / maxViews) * 50)}px`, minHeight: day.clicks > 0 ? "3px" : "0px" }}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium">{day.date}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-5 mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div><span className="text-xs text-slate-400">Vues</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-violet-400 rounded-sm"></div><span className="text-xs text-slate-400">Téléchargements CV</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-pink-300 rounded-sm"></div><span className="text-xs text-slate-400">Clics projets</span></div>
            </div>
          </div>

          {/* Top Projects */}
          {stats.top_projects.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                Projets les plus consultés
              </h2>
              <div className="space-y-3">
                {stats.top_projects.map((proj, i) => {
                  const maxClicks = stats.top_projects[0]?.clicks || 1;
                  return (
                    <div key={proj.project_id} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-300 w-5 text-right shrink-0">#{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-800 truncate">{proj.title}</span>
                          <span className="text-xs font-bold text-slate-400 ml-2 shrink-0">{proj.clicks} clics</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${(proj.clicks / maxClicks) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
