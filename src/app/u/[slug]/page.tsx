"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Download, Share2, Moon, Sun, Play, Pause, X, ChevronLeft, ChevronRight,
  Mail, Phone, Briefcase, Layers, FolderKanban, Quote, Sparkles, Check, FileDown
} from "lucide-react";

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
  theme?: string;
  mode?: string;
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
  const [copied, setCopied] = useState(false);

  // Story presentation player states
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerSlide, setPlayerSlide] = useState(0);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Dynamically compile slides based on loaded profile data
  const getSlides = () => {
    if (!profile) return [];
    const arr: any[] = [];
    
    // 1. Intro Slide
    arr.push({
      type: "intro",
      title: profile.user?.name || "Profil",
      subtitle: profile.title,
      content: profile.bio || "Découvrez mon parcours en présentation dynamique.",
      bg: "from-indigo-950 via-slate-900 to-slate-950",
      bgLight: "from-indigo-50 via-slate-50 to-slate-100"
    });

    // 2. Experience Slide
    if (profile.experiences && profile.experiences.length > 0) {
      arr.push({
        type: "experiences",
        title: "Mon Parcours",
        subtitle: "Expériences Professionnelles",
        items: profile.experiences.slice(0, 3), // Show 3 latest
        bg: "from-slate-950 via-slate-900 to-indigo-950",
        bgLight: "from-slate-100 via-indigo-50 to-slate-100"
      });
    }

    // 3. Skills Slide
    if (profile.skills && profile.skills.length > 0) {
      arr.push({
        type: "skills",
        title: "Mes Compétences",
        subtitle: "Expertise Technique",
        items: profile.skills.slice(0, 12), // Show up to 12 key skills
        bg: "from-indigo-950 via-slate-950 to-slate-950",
        bgLight: "from-indigo-50 via-slate-100 to-slate-100"
      });
    }

    // 4. Detailed Project Slides (one slide per project for the 3 latest projects)
    if (profile.projects && profile.projects.length > 0) {
      const recentProjects = profile.projects.slice(0, 3);
      recentProjects.forEach((proj, idx) => {
        arr.push({
          type: "single-project",
          title: proj.title,
          subtitle: `Projet Majeur ${idx + 1}/${recentProjects.length}`,
          project: proj,
          bg: idx % 2 === 0 
            ? "from-slate-950 via-indigo-950 to-slate-950" 
            : "from-indigo-950 via-slate-900 to-slate-950",
          bgLight: idx % 2 === 0
            ? "from-slate-100 via-indigo-50 to-slate-100"
            : "from-indigo-50 via-slate-100 to-slate-100"
        });
      });
    }

    // 5. Recommendations Slide
    if (profile.recommendations && profile.recommendations.length > 0) {
      const featured = profile.recommendations[0];
      arr.push({
        type: "recommendation",
        title: "Témoignage",
        subtitle: "Recommandation Reçue",
        item: featured,
        bg: "from-indigo-900 via-indigo-950 to-slate-950",
        bgLight: "from-indigo-100/40 via-indigo-50 to-slate-100"
      });
    }

    // 6. Contact Slide
    arr.push({
      type: "contact",
      title: "Collaborons !",
      subtitle: "Me Contacter",
      email: profile.contact_email,
      phone: profile.contact_phone,
      location: profile.contact_location,
      bg: "from-slate-950 via-indigo-900 to-slate-950",
      bgLight: "from-slate-100 via-indigo-50/40 to-slate-100"
    });

    return arr;
  };

  const slides = getSlides();

  // Slide Auto-Progression Timer (Ticking progress bar)
  useEffect(() => {
    if (!showPlayer || !playerIsPlaying || slides.length === 0) return;

    const duration = 6000; // 6 seconds per slide
    const intervalTime = 50; // Update progress bar every 50ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [showPlayer, playerIsPlaying, playerSlide, slides.length]);

  // Slide Auto-Progression Handler (Triggered when progress hits 100%)
  useEffect(() => {
    if (progress >= 100) {
      setProgress(0);
      setPlayerSlide((curr) => {
        if (curr >= slides.length - 1) {
          setPlayerIsPlaying(false);
          return curr;
        }
        return curr + 1;
      });
    }
  }, [progress, slides.length]);

  const nextSlide = () => {
    setProgress(0);
    setPlayerSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setProgress(0);
    setPlayerSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles/${slug}`);
        if (!res.ok) { setError(true); return; }
        const data = await res.json();
        setProfile(data);
        
        // Initialize theme based on profile preferences if set
        if (data.mode === "dark") {
          setDarkMode(true);
        } else {
          setDarkMode(false);
        }

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

  const isDark = darkMode;
  const textTitle = isDark ? "text-white" : "text-slate-900";
  const textSubtitle = isDark ? "text-emerald-400" : "text-emerald-600";
  const textBody = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-white/5 border border-white/10 text-white" : "bg-white border border-slate-200 text-slate-800 shadow-sm";
  const borderCol = isDark ? "border-white/10" : "border-slate-200";
  const buttonSecondary = isDark ? "bg-white/5 border border-white/10 hover:bg-white/10 text-white" : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700";

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

  let pageBgClass = "bg-[#fafaf7] dark:bg-slate-950";
  let headerBgClass = "bg-[#fafaf7]/90 dark:bg-slate-950/90";
  
  if (activeTemplate === "developer") {
    pageBgClass = "bg-slate-950";
    headerBgClass = "bg-slate-950/90";
  } else if (activeTemplate === "luxury") {
    pageBgClass = "bg-transparent";
    headerBgClass = "bg-[#0a0a0a]/80";
  } else if (activeTemplate === "neumorphism") {
    pageBgClass = "bg-[#e0e5ec] dark:bg-[#1e2329]";
    headerBgClass = "bg-[#e0e5ec]/90 dark:bg-[#1e2329]/90";
  } else if (activeTemplate === "saas") {
    pageBgClass = "bg-[#fafafa] dark:bg-[#0a0a10]";
    headerBgClass = "bg-[#fafafa]/80 dark:bg-[#0a0a10]/80";
  } else if (activeTemplate === "creative") {
    pageBgClass = "bg-transparent";
    headerBgClass = "bg-white/50 dark:bg-black/50";
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div 
        className={`min-h-screen ${pageBgClass} text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative`}
        style={{ '--theme-accent': profile.accent_color || '#4f46e5' } as React.CSSProperties}
      >
        {/* Grain overlay for paper aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#0a0a0b_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] z-10"></div>

        {/* Sticky Navigation */}
        <header className={`sticky top-0 z-40 ${headerBgClass} backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-sm`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                <span className="text-[var(--lime)]">P</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">Profolio</span>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Changer le mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Share */}
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copier le lien"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                {copied && <span className="text-xs text-emerald-500 font-semibold hidden sm:inline">Copié !</span>}
              </button>

              {/* Presentation Play Button */}
              <button 
                onClick={() => {
                  setShowPlayer(true);
                  setPlayerSlide(0);
                  setPlayerIsPlaying(true);
                  setProgress(0);
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                <span>Présentation</span>
              </button>

              {/* CV Download */}
              <button
                onClick={handleCVDownload}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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

        {/* Fullscreen Presentation Player Modal */}
        {showPlayer && (
          <div className={`fixed inset-0 z-50 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 font-sans select-none overflow-hidden transition-all duration-500 bg-gradient-to-br ${isDark ? slides[playerSlide]?.bg : slides[playerSlide]?.bgLight}`}>
            <style>{`
              @keyframes storyFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes storySlideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes storySlideInRight {
                from { opacity: 0; transform: translateX(50px); }
                to { opacity: 1; transform: translateX(0); }
              }
              @keyframes storyScaleIn {
                from { opacity: 0; transform: scale(0.92); }
                to { opacity: 1; transform: scale(1); }
              }
              .story-fade-in {
                opacity: 0;
                animation: storyFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .story-slide-up {
                opacity: 0;
                animation: storySlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .story-slide-in-right {
                opacity: 0;
                animation: storySlideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .story-scale-in {
                opacity: 0;
                animation: storyScaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .delay-100 { animation-delay: 100ms; }
              .delay-200 { animation-delay: 200ms; }
              .delay-300 { animation-delay: 300ms; }
              .delay-400 { animation-delay: 400ms; }
              .delay-500 { animation-delay: 500ms; }
              .delay-600 { animation-delay: 600ms; }
              .delay-700 { animation-delay: 700ms; }
              .delay-800 { animation-delay: 800ms; }
            `}</style>

            {/* Top Bar with Progress Indicators */}
            <div className="w-full max-w-3xl mx-auto space-y-4">
              <div className="flex gap-1.5 h-1.5 w-full">
                {slides.map((_, idx) => (
                  <div key={idx} className={`h-full rounded-full flex-1 overflow-hidden ${isDark ? "bg-white/20" : "bg-slate-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-75 ease-linear ${isDark ? "bg-emerald-400" : "bg-emerald-500"}`}
                      style={{
                        width:
                          idx < playerSlide
                            ? "100%"
                            : idx === playerSlide
                            ? `${progress}%`
                            : "0%"
                      }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Player Top Controls */}
              <div className={`flex justify-between items-center ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                    Slide {playerSlide + 1} / {slides.length} : {slides[playerSlide]?.subtitle}
                  </span>
                </div>
                <button
                  onClick={() => setShowPlayer(false)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-slate-200 text-slate-800"}`}
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide Body / Content Showcase */}
            <div className="flex-1 w-full max-w-3xl mx-auto flex items-center justify-center py-6 px-4">
              {/* key={playerSlide} triggers unmount/remount to replay CSS animations on slide change */}
              <div key={playerSlide} className="w-full text-center space-y-6">
                
                {/* 1. Intro Slide */}
                {slides[playerSlide]?.type === "intro" && (
                  <div className="space-y-6">
                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-4 shadow-xl story-scale-in ${isDark ? "border-emerald-400 shadow-emerald-500/10" : "border-emerald-500 shadow-emerald-600/10"}`}>
                      {profile.photo_url ? (
                        <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-4xl font-black text-white">
                          {profile.user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 story-slide-up delay-200">
                      <h2 className={`text-2xl sm:text-4xl font-black tracking-tight leading-none ${textTitle}`}>{slides[playerSlide]?.title}</h2>
                      <p className={`text-xs sm:text-sm font-bold uppercase tracking-widest font-mono ${textSubtitle}`}>{slides[playerSlide]?.subtitle}</p>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed max-w-lg mx-auto italic font-medium px-4 story-fade-in delay-400 ${textBody}`}>
                      "{slides[playerSlide]?.content}"
                    </p>
                  </div>
                )}

                {/* 2. Experiences Slide */}
                {slides[playerSlide]?.type === "experiences" && (
                  <div className="space-y-5 text-left w-full">
                    <h3 className={`text-lg font-black border-b pb-2 flex items-center gap-2 story-fade-in ${textTitle} ${isDark ? "border-white/10" : "border-slate-200"}`}>
                      <Briefcase className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                      Parcours Professionnel
                    </h3>
                    <div className="space-y-4 story-slide-up delay-200">
                      {slides[playerSlide]?.items?.map((exp: any, i: number) => (
                        <div key={i} className={`flex gap-4 items-start relative pl-6 border-l-2 last:border-transparent ${isDark ? "border-emerald-400/30" : "border-emerald-500/30"}`}>
                          <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${isDark ? "bg-emerald-400" : "bg-emerald-500"}`}></div>
                          <div className="space-y-0.5">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                              {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Présent"}
                            </span>
                            <h4 className={`text-sm font-bold ${textTitle}`}>{exp.title}</h4>
                            <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>{exp.company} {exp.location && `· ${exp.location}`}</p>
                            <p className={`text-[11px] font-medium line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Skills Slide */}
                {slides[playerSlide]?.type === "skills" && (
                  <div className="space-y-5 text-left w-full">
                    <h3 className={`text-lg font-black border-b pb-2 flex items-center gap-2 story-fade-in ${textTitle} ${isDark ? "border-white/10" : "border-slate-200"}`}>
                      <Layers className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                      Compétences & Technologies
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 story-slide-up delay-200">
                      {slides[playerSlide]?.items?.map((sk: any, i: number) => (
                        <div key={i} className={`p-3 rounded-xl flex items-center justify-between gap-3 backdrop-blur-sm ${cardBg}`}>
                          <div>
                            <p className={`text-xs font-bold leading-none ${textTitle}`}>{sk.name}</p>
                            <p className={`text-[9px] font-mono mt-1 uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{sk.category}</p>
                          </div>
                          {sk.level && (
                            <span className={`text-[9px] font-mono font-black ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{sk.level}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Single-Project Slide */}
                {slides[playerSlide]?.type === "single-project" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left w-full">
                    {/* Left Column: Visual/Media Card */}
                    <div className="space-y-4 story-slide-in-right">
                      {slides[playerSlide]?.project?.image_url ? (
                        <div className={`relative aspect-video w-full rounded-xl overflow-hidden border shadow-2xl bg-black/40 group ${isDark ? "border-white/10" : "border-slate-200"}`}>
                          <img 
                            src={slides[playerSlide]?.project?.image_url} 
                            alt={slides[playerSlide]?.project?.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                        </div>
                      ) : (
                        <div className={`aspect-video w-full rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 ${isDark ? "border-white/20 bg-white/5" : "border-slate-300 bg-slate-50"}`}>
                          <FolderKanban className="w-8 h-8 text-slate-500" />
                          <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Aucun visuel disponible</span>
                        </div>
                      )}
                      
                      {slides[playerSlide]?.project?.demo_url && (
                        <a 
                          href={slides[playerSlide]?.project?.demo_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer ${isDark ? "text-slate-950" : "text-white"}`}
                        >
                          <Play className="w-4 h-4 text-white fill-white" />
                          <span>Visiter la Démo en Direct</span>
                        </a>
                      )}
                    </div>

                    {/* Right Column: Detailed Specs */}
                    <div className="space-y-4 story-slide-up delay-200">
                      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${textSubtitle}`}>
                        {slides[playerSlide]?.subtitle}
                      </span>
                      
                      <h3 className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${textTitle}`}>
                        {slides[playerSlide]?.project?.title}
                      </h3>

                      {/* Tech stack badges */}
                      {slides[playerSlide]?.project?.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {(slides[playerSlide]?.project?.tags || "").split(",").map((tag: string, i: number) => (
                            <span 
                              key={i} 
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${isDark ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-300" : "bg-emerald-50 border border-emerald-200 text-emerald-600"}`}
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* High-contrast legible description */}
                      <p className={`text-xs sm:text-sm leading-relaxed font-sans font-medium p-4 rounded-xl ${isDark ? "text-slate-200 bg-white/5 border border-white/5" : "text-slate-700 bg-white border border-slate-200"}`}>
                        {slides[playerSlide]?.project?.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. Recommendation Slide */}
                {slides[playerSlide]?.type === "recommendation" && (
                  <div className="space-y-6 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-lg story-scale-in ${isDark ? "bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 shadow-emerald-400/5" : "bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-emerald-600/5"}`}>
                      <Quote className="w-5 h-5" />
                    </div>
                    <blockquote className={`text-xs sm:text-base italic max-w-lg mx-auto leading-relaxed px-4 story-fade-in delay-200 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      "{slides[playerSlide]?.item?.content}"
                    </blockquote>
                    <div className="story-slide-up delay-400">
                      <h4 className={`text-sm font-bold ${textTitle}`}>{slides[playerSlide]?.item?.recommender_name}</h4>
                      <p className={`text-[10px] sm:text-xs font-mono uppercase tracking-widest mt-1 ${textSubtitle}`}>
                        {slides[playerSlide]?.item?.recommender_role} @ {slides[playerSlide]?.item?.recommender_company}
                      </p>
                    </div>
                  </div>
                )}

                {/* 6. Contact Slide */}
                {slides[playerSlide]?.type === "contact" && (
                  <div className="space-y-6">
                    <div className="space-y-1.5 story-fade-in">
                      <h3 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${textTitle}`}>{slides[playerSlide]?.title}</h3>
                      <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Créons ensemble votre prochain produit.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left story-slide-up delay-200">
                      {slides[playerSlide]?.email && (
                        <div className={`p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm ${cardBg}`}>
                          <Mail className={`w-4 h-4 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                          <div className="min-w-0">
                            <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>E-mail</p>
                            <p className={`text-xs truncate font-medium ${textTitle}`}>{slides[playerSlide]?.email}</p>
                          </div>
                        </div>
                      )}
                      {slides[playerSlide]?.phone && (
                        <div className={`p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm ${cardBg}`}>
                          <Phone className={`w-4 h-4 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                          <div className="min-w-0">
                            <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Téléphone</p>
                            <p className={`text-xs truncate font-medium ${textTitle}`}>{slides[playerSlide]?.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex justify-center gap-3 story-scale-in delay-400">
                      <button
                        onClick={handleCVDownload}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger le CV complet</span>
                      </button>
                      <button
                        onClick={() => setShowPlayer(false)}
                        className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer ${isDark ? "bg-white/10 hover:bg-white/15 border border-white/10 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                      >
                        Retour au profil
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Playback Controls */}
            <div className={`w-full max-w-xs mx-auto flex items-center justify-between pb-4 sm:pb-6 ${isDark ? "text-white" : "text-slate-800"}`}>
              <button
                onClick={prevSlide}
                disabled={playerSlide === 0}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                title="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setPlayerIsPlaying(!playerIsPlaying)}
                className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-transform active:scale-95"
                title={playerIsPlaying ? "Pause" : "Lecture"}
              >
                {playerIsPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                onClick={nextSlide}
                disabled={playerSlide === slides.length - 1}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                title="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
