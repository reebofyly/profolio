"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Download, Share2, Moon, Sun } from "lucide-react";

// Templates
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import DeveloperTemplate from "./templates/DeveloperTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import NeumorphismTemplate from "./templates/NeumorphismTemplate";
import BentoTemplate from "./templates/BentoTemplate";
import LuxuryTemplate from "./templates/LuxuryTemplate";
import SaaSTemplate from "./templates/SaaSTemplate";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

interface Profile {
  id: number;
  slug: string;
  title: string;
  bio: string;
  photo_url: string;
  cover_url: string;
  resume_url: string;
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  social_github: string;
  social_linkedin: string;
  social_behance: string;
  social_twitter: string;
  social_website: string;
  template: string;
  accent_color?: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  recommendations: Recommendation[];
  languages: Language[];
  user: { name: string };
}

interface Experience { id: number; title: string; company: string; location: string; start_date: string; end_date: string | null; is_current: boolean; description: string; skills_used: string; }
interface Education { id: number; degree: string; institution: string; field_of_study: string; start_date: string; end_date: string | null; is_current: boolean; description: string; }
interface Skill { id: number; name: string; level: number; category: string; }
interface Project { id: number; title: string; description: string; image_url: string; demo_url: string; github_url: string; tags: string; }
interface Certification { id: number; name: string; issuer: string; issue_date: string; expiration_date: string | null; credential_url: string; is_verified: boolean; }
interface Recommendation { id: number; recommender_name: string; recommender_role: string; recommender_company: string; recommender_avatar: string; content: string; relationship: string; is_verified: boolean; }
interface Language { id: number; name: string; level: string; }

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, item) => {
    const k = String(item[key]);
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {});
}

export default function PublicProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statId, setStatId] = useState<number | null>(null);
  const [showRecModal, setShowRecModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles/${slug}`);
        if (!res.ok) { setError(true); return; }
        const data = await res.json();
        setProfile(data);

        // Log a visit stat
        const statRes = await fetch(`${API_BASE}/stats/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (statRes.ok) {
          const statData = await statRes.json();
          setStatId(statData.id);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  const handleCVDownload = async () => {
    if (statId) {
      await fetch(`${API_BASE}/stats/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ stat_id: statId, cv_downloaded: true }),
      });
    }
    window.open(`/u/${slug}/cv`, "_blank");
  };

  const handleProjectClick = async (projectId: number) => {
    if (statId) {
      await fetch(`${API_BASE}/stats/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ stat_id: statId, project_clicked_id: projectId }),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-xl text-white mx-auto mb-4 animate-pulse">P</div>
          <p className="text-slate-500 text-sm">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-600 text-lg font-semibold">Profil introuvable</p>
        <Link href="/" className="text-indigo-600 text-sm hover:underline">← Retour à l'accueil</Link>
      </div>
    );
  }

  const skillGroups = groupBy(profile.skills || [], "category");

  // Template props shared across all templates
  const templateProps = {
    profile,
    formatDate,
    skillGroups,
    handleProjectClick,
    setShowRecModal,
  };

  // Determine active template (fallback to classic)
  const activeTemplate = profile.template || "classic";

  const renderTemplate = () => {
    switch (activeTemplate) {
      case "minimalist":
        return <MinimalistTemplate {...templateProps} />;
      case "developer":
        return <DeveloperTemplate {...templateProps} />;
      case "creative":
        return <CreativeTemplate {...templateProps} />;
      case "neumorphism":
        return <NeumorphismTemplate {...templateProps} />;
      case "bento":
        return <BentoTemplate {...templateProps} />;
      case "luxury":
        return <LuxuryTemplate {...templateProps} />;
      case "saas":
        return <SaaSTemplate {...templateProps} />;
      case "classic":
      default:
        return <ClassicTemplate {...templateProps} />;
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Sticky Navigation */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-sm text-white">P</div>
              <span className="font-bold text-slate-800 dark:text-slate-100 hidden sm:block">Profolio</span>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Changer le mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Share */}
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Copier le lien"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* CV Download */}
              <button
                onClick={handleCVDownload}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CV</span>
              </button>
            </div>
          </div>
        </header>

        {/* Template Content */}
        <main>
          {renderTemplate()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors text-xs">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-[10px]">P</div>
            Créez votre propre Profolio
          </Link>
        </footer>
      </div>
    </div>
  );
}
