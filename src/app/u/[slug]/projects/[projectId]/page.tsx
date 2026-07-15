"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, ExternalLink, GitBranch, Share2, FolderKanban, 
  MapPin, Globe, Sparkles, Check, Play, User, Quote, Send,
  Star, Loader2, BadgeCheck
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

interface ProjectReview {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  demo_url: string;
  github_url: string;
  behance_url: string;
  tags: string;
  details: string;
  client_name: string;
  client_role: string;
  client_feedback: string;
  client_avatar_url: string;
  gallery: string[];
  created_at: string;
  reviews?: ProjectReview[];
}

interface Profile {
  id: number;
  user_id: number;
  slug: string;
  title: string;
  bio: string;
  photo_url: string;
  cover_url: string;
  contact_location: string;
  social_github: string;
  social_linkedin: string;
  social_website: string;
  user: { name: string };
  projects: Project[];
  template?: string;
  accent_color?: string;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ slug: string; projectId: string }> }) {
  const { slug, projectId } = use(params);
  const { user, token, apiFetch } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review form state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles/${slug}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setProfile(data);

        // Find specific project
        const proj = data.projects?.find((p: any) => String(p.id) === String(projectId));
        if (proj) {
          setProject(proj);
          setActiveImage(proj.image_url || "");
          
          // Pre-populate rating/comment if the logged-in user already left a review
          const existingReview = proj.reviews?.find((r: any) => r.user.id === user?.id);
          if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || "");
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug, projectId, user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await apiFetch(`/projects/${projectId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'enregistrement de votre avis.");
      }

      setSubmitSuccess(true);
      
      // Update local state with the new/updated review to avoid reloading the whole page
      if (project) {
        const updatedReviews = [...(project.reviews || [])];
        const existingIdx = updatedReviews.findIndex((r) => r.user.id === user?.id);
        
        if (existingIdx > -1) {
          // Update existing review
          updatedReviews[existingIdx] = {
            ...updatedReviews[existingIdx],
            rating,
            comment,
            created_at: new Date().toISOString()
          };
        } else if (user) {
          // Add new review
          updatedReviews.unshift({
            id: data.review?.id || Date.now(),
            rating,
            comment,
            created_at: new Date().toISOString(),
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
        
        setProject({
          ...project,
          reviews: updatedReviews
        });
      }
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to split text by line breaks to render paragraphs
  const renderDetails = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((para, index) => {
      if (para.trim().startsWith("-") || para.trim().startsWith("*")) {
        return (
          <li key={index} className="text-slate-600 dark:text-slate-300 text-sm ml-4 list-disc mb-1.5 font-sans leading-relaxed">
            {para.replace(/^[-*]\s*/, "")}
          </li>
        );
      }
      return para.trim() ? (
        <p key={index} className="text-slate-600 dark:text-slate-300 text-sm mb-4 font-sans leading-relaxed">
          {para}
        </p>
      ) : (
        <div key={index} className="h-2"></div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center font-sans">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white mx-auto mb-4 animate-spin">P</div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project || !profile) {
    return (
      <div className="min-h-screen bg-[#fafaf7] dark:bg-slate-950 flex items-center justify-center flex-col gap-4 font-sans text-center px-4">
        <FolderKanban className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Projet ou Profil introuvable</h2>
        <p className="text-slate-500 text-xs max-w-xs">Ce projet a peut-être été supprimé ou l'adresse URL est incorrecte.</p>
        <Link href="/" className="btn btn-primary text-xs font-bold px-4 py-2 mt-2">
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  const reviews = project?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const activeTemplate = profile?.template || "classic";
  const isMinimalist = activeTemplate === "minimalist";
  const isDeveloper = activeTemplate === "developer";
  const isCreative = activeTemplate === "creative";
  const isNeumorphism = activeTemplate === "neumorphism";
  const isBento = activeTemplate === "bento";
  const isLuxury = activeTemplate === "luxury";
  const isSaaS = activeTemplate === "saas";
  const isClassic = activeTemplate === "classic" || !["minimalist", "developer", "creative", "neumorphism", "bento", "luxury", "saas"].includes(activeTemplate);

  const fontClass = isDeveloper ? "font-mono" : "font-sans";

  let pageBg = "bg-[#fafaf7] dark:bg-slate-950 text-slate-900 dark:text-slate-100";
  let cardClass = "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/85 rounded-2xl shadow-sm p-4 sm:p-6";
  let cardPadding = "p-6 sm:p-8";
  let secondaryCardClass = "bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100";
  let primaryBtnClass = "bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer";
  let secondaryBtnClass = "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all";
  let tagClass = "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60";
  let accentText = "text-indigo-600 dark:text-indigo-400";
  let pageHeaderClass = "bg-[#fafaf7]/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80";

  if (isMinimalist) {
    cardClass = "bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 rounded-none shadow-none";
    cardPadding = "p-6 sm:p-8";
    secondaryCardClass = "bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-none border border-slate-100 dark:border-slate-900 text-slate-800 dark:text-slate-200";
    primaryBtnClass = "px-6 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer";
    secondaryBtnClass = "px-6 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer";
    tagClass = "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-900";
    accentText = "text-slate-950 dark:text-white";
    pageHeaderClass = "bg-[#fafaf7]/90 dark:bg-slate-950/90 border-b border-slate-100 dark:border-slate-900";
  } else if (isDeveloper) {
    pageBg = "bg-slate-950 text-slate-300";
    cardClass = "bg-slate-950/80 border border-slate-800 rounded-xl shadow-2xl";
    cardPadding = "";
    secondaryCardClass = "bg-black/35 border border-slate-800 p-4 rounded-lg text-slate-300";
    primaryBtnClass = "flex items-center justify-center gap-2 py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg cursor-pointer";
    secondaryBtnClass = "flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer";
    tagClass = "bg-slate-900 border border-slate-800 text-slate-400";
    accentText = "text-emerald-400";
    pageHeaderClass = "bg-slate-950 border-b border-slate-800";
  } else if (isCreative) {
    cardClass = "backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/30 rounded-3xl shadow-xl";
    cardPadding = "p-6 sm:p-8";
    secondaryCardClass = "backdrop-blur-md bg-white/20 dark:bg-black/10 border border-white/10 p-4 rounded-2xl text-slate-800 dark:text-slate-200";
    primaryBtnClass = "bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer";
    secondaryBtnClass = "bg-white/60 dark:bg-slate-800/60 border border-white/45 dark:border-slate-800/40 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all hover:scale-[1.02] cursor-pointer";
    tagClass = "bg-pink-500/10 text-pink-500 border border-pink-500/20";
    accentText = "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent";
    pageHeaderClass = "bg-[#fafaf7]/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-white/10 dark:border-slate-800/20";
  } else if (isNeumorphism) {
    pageBg = "bg-[#e0e5ec] dark:bg-[#1e2329] text-slate-700 dark:text-slate-300";
    cardClass = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)] rounded-3xl";
    cardPadding = "p-6 sm:p-8";
    secondaryCardClass = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] p-4 rounded-2xl text-slate-800 dark:text-slate-200";
    primaryBtnClass = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[5px_5px_10px_rgb(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-2xl cursor-pointer transition-all";
    secondaryBtnClass = "bg-[#e0e5ec] dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-2xl cursor-pointer";
    tagClass = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] text-indigo-500 font-bold border-transparent rounded-lg px-2 py-1";
    accentText = "text-indigo-500";
    pageHeaderClass = "bg-[#e0e5ec]/90 dark:bg-[#1e2329]/90 backdrop-blur-sm border-b border-[#e0e5ec] shadow-[0_4px_6px_rgba(163,177,198,0.3)] dark:shadow-[0_4px_6px_rgba(0,0,0,0.4)]";
  } else if (isBento) {
    pageBg = "bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200";
    cardClass = "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] shadow-sm";
    cardPadding = "p-6 sm:p-8";
    secondaryCardClass = "bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50";
    primaryBtnClass = "bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl cursor-pointer transition-colors shadow-md";
    secondaryBtnClass = "bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-bold px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors";
    tagClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/50 dark:border-slate-700/50";
    accentText = "text-indigo-500";
    pageHeaderClass = "bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60";
  } else if (isLuxury) {
    pageBg = "bg-[#0a0a0a] text-slate-300 font-playfair";
    cardClass = "bg-[#111] border border-[#222] rounded-none";
    cardPadding = "p-6 sm:p-10";
    secondaryCardClass = "bg-black p-6 border border-[#222] text-[#ccc]";
    primaryBtnClass = "bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-inter text-xs tracking-widest uppercase px-6 py-3 cursor-pointer transition-colors";
    secondaryBtnClass = "bg-[#111] border border-[#333] text-[#888] hover:text-amber-500 font-inter text-xs tracking-widest uppercase px-6 py-3 cursor-pointer transition-colors";
    tagClass = "bg-transparent border-b border-amber-500/50 text-amber-500 rounded-none uppercase font-inter text-[10px] tracking-widest";
    accentText = "text-amber-500";
    pageHeaderClass = "bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#222]";
  } else if (isSaaS) {
    pageBg = "bg-[#fafafa] dark:bg-[#0a0a10] text-slate-800 dark:text-slate-200";
    cardClass = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)]";
    cardPadding = "p-6 sm:p-8";
    secondaryCardClass = "bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300";
    primaryBtnClass = "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm px-6 py-3 shadow-sm transition-colors cursor-pointer";
    secondaryBtnClass = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer";
    tagClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700";
    accentText = "text-blue-600 dark:text-blue-400";
    pageHeaderClass = "bg-[#fafafa]/80 dark:bg-[#0a0a10]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800";
  }

  const renderSectionHeader = (title: string, icon: React.ReactNode) => {
    if (isDeveloper) {
      return (
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 mb-4">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">{icon} {title}</span>
          <span></span>
        </div>
      );
    }
    
    if (isCreative) {
      return (
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <span className="w-2.5 h-6 bg-gradient-to-b from-pink-500 to-indigo-500 rounded-full"></span>
          {title}
        </h2>
      );
    }

    if (isMinimalist) {
      return (
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-900 pb-2 mb-4 flex items-center gap-2">
          {title}
        </h2>
      );
    }

    return (
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
        {icon}
        {title}
      </h2>
    );
  };

  return (
    <div 
      className={`${fontClass} ${pageBg} min-h-screen transition-colors duration-300`}
      style={{ '--theme-accent': profile.accent_color || '#4f46e5' } as React.CSSProperties}
    >
      
      {/* Decorative top pattern */}
      {isClassic && <div className="h-2 bg-indigo-600 w-full"></div>}
      {isCreative && <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-full"></div>}
      {isDeveloper && <div className="h-2 bg-slate-800 w-full"></div>}
      {isLuxury && <div className="h-1 bg-amber-500 w-full"></div>}
      {isSaaS && <div className="h-1 bg-blue-600 w-full"></div>}

      {/* Navigation Header */}
      <header className={`sticky top-0 z-40 ${pageHeaderClass}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href={`/u/${slug}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-905 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-xs font-bold uppercase tracking-wider">
            <ArrowLeft className={`w-4 h-4 ${isClassic ? "text-indigo-600" : isCreative ? "text-pink-500" : isDeveloper ? "text-emerald-400" : ""}`} />
            <span>Retour au profil</span>
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className={`${secondaryBtnClass} text-xs flex gap-3 font-bold px-3.5 py-2 cursor-pointer`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié !" : "Partager"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Project Header block */}
        <div className="mb-8">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 font-mono ${accentText}`}>
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projet Réalisé par {profile.user?.name}</span>
          </div>
          
          <h1 className={`text-3xl sm:text-4xl font-black tracking-tight font-display mb-4 ${isCreative ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent w-fit" : ""}`}>
            {project.title}
          </h1>

          {/* Tags & Rating row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {averageRating && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black font-mono ${
                isDeveloper 
                  ? "bg-slate-900 border border-slate-800 text-emerald-405" 
                  : isCreative 
                    ? "bg-pink-500/10 text-pink-500 border border-pink-500/20"
                    : isMinimalist
                      ? "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                      : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-200 dark:border-amber-900/60"
              }`}>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span>{averageRating} / 5</span>
                <span className="text-[10px] text-amber-500 font-normal">({reviews.length} {reviews.length > 1 ? "avis" : "avis"})</span>
              </div>
            )}

            {project.tags && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.split(",").map((tag, i) => (
                  <span 
                    key={i} 
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-mono ${tagClass}`}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Media & Description (2/3 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Media Showcase */}
            <div className={`${cardClass} overflow-hidden pt-2`}>
              {renderSectionHeader("Galerie Média", <FolderKanban className="w-4 h-4 ml-5" />)}
              
              <div className={isDeveloper ? "p-6 space-y-4" : ""}>
                {/* Image display */}
                {activeImage && (
                  <div className="relative border-b border-slate-100 dark:border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img 
                      src={activeImage} 
                      alt={project.title} 
                      className="w-full h-auto max-h-[440px] object-contain transition-all duration-300"
                    />
                  </div>
                )}

                {/* Gallery thumbnails grid */}
                {((project.gallery && project.gallery.length > 0) || (project.image_url && project.gallery?.length > 0)) && (
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 font-mono">
                      Galerie d'images
                    </h4>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      {project.image_url && (
                        <button 
                          type="button"
                          onClick={() => setActiveImage(project.image_url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            activeImage === project.image_url 
                              ? `border-${isDeveloper ? "emerald-400" : "indigo-600"} ring-2 ring-indigo-100` 
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                          }`}
                        >
                          <img src={project.image_url} alt="Cover" className="w-full h-full object-cover" />
                        </button>
                      )}
                      
                      {Array.isArray(project.gallery) && project.gallery.map((url, idx) => (
                        <button 
                          type="button"
                          key={idx}
                          onClick={() => setActiveImage(url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            activeImage === url 
                              ? `border-${isDeveloper ? "emerald-400" : "indigo-600"} ring-2 ring-indigo-100` 
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                          }`}
                        >
                          <img src={url} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Player */}
                {project.video_url && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 font-mono flex items-center gap-1.5">
                      <Play className={`w-3.5 h-3.5 ${isDeveloper ? "text-emerald-405" : "text-indigo-600"}`} />
                      Vidéo de Démonstration
                    </h3>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black aspect-video">
                      <video 
                        src={project.video_url} 
                        controls 
                        className="w-full h-full object-contain"
                        poster={project.image_url}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description details content */}
            <div className={`${cardClass} overflow-hidden pt-2`}>
              {renderSectionHeader("Présentation du Projet", <Sparkles className="w-4 h-4 ml-5" />)}
              
              <div className={`${cardPadding} ${isDeveloper ? "pt-0 sm:pt-0 p-6" : ""}`}>
                <div className={`font-semibold text-sm leading-relaxed mb-6 ${secondaryCardClass}`}>
                  {project.description}
                </div>

                <div className="prose max-w-none text-left">
                  {project.details ? (
                    renderDetails(project.details)
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500 text-xs italic">
                      Aucune description détaillée n'a été ajoutée pour ce projet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Client Testimonial / Return if present */}
            {(project.client_feedback || project.client_name) && (
              <div className={`${cardClass} overflow-hidden pt-2`}>
                {renderSectionHeader("Témoignage Client", <Quote className="w-4 h-4 ml-5" />)}
                
                <div className={`${cardPadding} ${isDeveloper ? "pt-0 sm:pt-0 p-6" : ""}`}>
                  {project.client_feedback ? (
                    <blockquote className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed mb-6 font-sans relative z-10">
                      "{project.client_feedback}"
                    </blockquote>
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500 text-xs italic mb-6">Témoignage client non rédigé.</p>
                  )}

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-indigo-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {project.client_avatar_url ? (
                        <img src={project.client_avatar_url} alt={project.client_name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {project.client_name || "Client Anonyme"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {project.client_role || "Commanditaire"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: AVIS & EVALUATIONS */}
            <div className={`${cardClass} overflow-hidden pt-2`}>
              {renderSectionHeader(`Avis et Évaluations (${reviews.length})`, <Quote className="w-4 h-4 ml-5" />)}
              
              <div className={`${cardPadding} space-y-6 ${isDeveloper ? "pt-0 sm:pt-0 p-6" : ""}`}>
                {/* Form to leave a review */}
                {user ? (
                  profile.user_id !== user.id && (
                    <div className={`${secondaryCardClass} space-y-4 text-left`}>
                      <h3 className="text-sm font-bold">Laisser une évaluation</h3>
                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-750 text-xs font-semibold rounded-lg">{submitError}</div>
                      )}
                      {submitSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">Votre avis a été enregistré !</div>
                      )}
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Note</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className="text-amber-400 hover:scale-110 transition-transform cursor-pointer p-0.5"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= rating
                                      ? "fill-amber-400 text-amber-500"
                                      : "text-slate-300 dark:text-slate-700"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Votre avis (Optionnel)</label>
                          <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre retour d'expérience sur ce projet..."
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-all text-slate-800 dark:text-slate-100"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className={primaryBtnClass}
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>Soumettre l'avis</span>
                        </button>
                      </form>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center py-6">
                    <p className="text-slate-550 dark:text-slate-400 text-xs mb-3 font-semibold">
                      Vous devez être connecté(e) pour évaluer ce projet.
                    </p>
                    <div className="flex justify-center gap-2.5">
                      <Link href="/login" className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
                        Se connecter
                      </Link>
                      <Link href="/register" className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold px-4 py-2 rounded-lg">
                        S'inscrire
                      </Link>
                    </div>
                  </div>
                )}

                {/* Reviews list */}
                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800 text-left">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="pt-4 first:pt-0">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{rev.user?.name || "Utilisateur"}</span>
                              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-505">
                                {new Date(rev.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? "fill-amber-400 text-amber-500"
                                      : "text-slate-200 dark:text-slate-800"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {rev.comment && (
                          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {rev.comment}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500 text-xs italic text-center py-4">
                      Aucun avis n'a été publié pour ce projet. Soyez le premier à donner votre avis !
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Actions & Details Sidebar (1/3 col) */}
          <div className="space-y-6">
            
            {/* Actions Panel */}
            <div className={`${cardClass} overflow-hidden pt-2`}>
              {renderSectionHeader("Liens du Projet", <FolderKanban className="w-4 h-4 ml-5" />)}
              
              <div className={`space-y-2.5 p-6 ${isDeveloper ? "pt-0" : ""}`}>
                {project.demo_url ? (
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider shadow-sm ${primaryBtnClass}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visiter la Démo</span>
                  </a>
                ) : (
                  <div className="w-full border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-center py-2.5 rounded-xl text-xs font-semibold">
                    Pas de démo publique
                  </div>
                )}

                {project.github_url && (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3 ${secondaryBtnClass}`}
                  >
                    <GitBranch className="w-4 h-4 text-indigo-600" />
                    <span>Consulter le Code</span>
                  </a>
                )}

                {project.behance_url && (
                  <a 
                    href={project.behance_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3 ${secondaryBtnClass}`}
                  >
                    <Send className="w-4 h-4 text-indigo-600" />
                    <span>Présentation Behance</span>
                  </a>
                )}
              </div>
            </div>

            {/* Author card summary */}
            <div className={`${cardClass} overflow-hidden pt-2`}>
              {renderSectionHeader("Concepteur", <User className="w-4 h-4 ml-5" />)}
              
              <div className={`p-6 text-left ${isDeveloper ? "pt-0" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-100 shrink-0 border border-slate-200 dark:border-slate-800">
                    {profile.photo_url ? (
                      <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-700 font-bold bg-indigo-100">
                        {profile.user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {profile.user?.name}
                    </h4>
                    <p className={`text-xs font-semibold ${accentText}`}>
                      {profile.title}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  {profile.contact_location && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
                      <MapPin className={`w-3.5 h-3.5 ${isDeveloper ? "text-emerald-400" : "text-indigo-600"}`} />
                      <span>{profile.contact_location}</span>
                    </div>
                  )}
                  {profile.social_website && (
                    <a href={profile.social_website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                      <Globe className={`w-3.5 h-3.5 ${isDeveloper ? "text-emerald-400" : "text-indigo-600"}`} />
                      <span>Site internet</span>
                    </a>
                  )}
                </div>

                <div className="mt-5">
                  <Link 
                    href={`/u/${slug}`} 
                    className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-xl transition-colors cursor-pointer ${
                      isDeveloper 
                        ? "bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-900" 
                        : isCreative 
                          ? "border border-pink-500/20 text-pink-500 hover:bg-pink-500/5 bg-transparent"
                          : "text-indigo-750 dark:text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 bg-transparent"
                    }`}
                  >
                    Voir le profil complet
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className={`border-t py-8 text-center mt-24 ${isDeveloper ? "border-slate-800 bg-slate-950/50" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50"}`}>
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-xs">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-[10px]">P</div>
          Conçu avec Profolio
        </Link>
      </footer>

    </div>
  );
}
