"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
    Sparkles,
    Layers,
    Eye,
    ArrowRight,
    CheckCircle2,
    FileText,
    BarChart3,
    FileCheck2,
    Terminal,
    Palette,
    Quote,
    Copy,
    Check,
    Download,
    Shield,
    FileDown,
    ExternalLink,
    ChevronRight,
    RefreshCw,
    Sparkle,
    Target,
    Sun,
    Moon,
    Menu,
    X
} from "lucide-react";

// Presets for the AI playground
const PLAYGROUND_PRESETS = [
    {
        label: "Correction de bugs",
        raw: "J'ai réparé des bugs sur le site.",
        refined: "Analyse approfondie de la base de code et résolution de plus de 50 anomalies critiques, élevant la stabilité de la plateforme de 15% et améliorant la rétention des utilisateurs.",
        metric: "+15% stabilité · 50+ correctifs"
    },
    {
        label: "Gestion de projet",
        raw: "J'ai géré le projet de refonte.",
        refined: "Pilotage transverse de la refonte de l'écosystème web, management d'une équipe agile de 5 développeurs et livraison réussie avec 2 semaines d'avance sur le calendrier initial.",
        metric: "-2 semaines · 5 collaborateurs"
    },
    {
        label: "Base de données",
        raw: "J'ai installé Postgres pour l'équipe.",
        refined: "Conception, migration et déploiement d'une base de données PostgreSQL redondante et hautement disponible, divisant par 4 les temps de latence des requêtes complexes en production.",
        metric: "Latence divisée par 4 · 0 interruption"
    }
];

export default function Home() {
    const { user } = useAuth();
    // Global theme state (defaults to light mode)
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Navigation scroll state
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Hero Tab Switcher State
    const [activeHeroTab, setActiveHeroTab] = useState<"editor" | "profile" | "stats">("editor");

    // Hero typing simulator state
    const [heroTypingText, setHeroTypingText] = useState("");
    const [heroAiText, setHeroAiText] = useState("");
    const [heroState, setHeroState] = useState<"idle" | "typing-user" | "loading" | "typing-ai">("idle");
    const heroAutoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Interactive AI Sandbox Playground States
    const [sandboxInput, setSandboxInput] = useState("");
    const [sandboxResult, setSandboxResult] = useState("");
    const [sandboxMetric, setSandboxMetric] = useState("");
    const [isSandboxOptimizing, setIsSandboxOptimizing] = useState(false);
    const [sandboxStep, setSandboxStep] = useState("");
    const [sandboxCopied, setSandboxCopied] = useState(false);
    const [typedSandboxResult, setTypedSandboxResult] = useState("");

    // Bento Box: Multi-profile simulator
    const [bentoProfileType, setBentoProfileType] = useState<"react" | "php" | "lead">("react");

    // Bento Box: PDF Exporter Simulator
    const [bentoPdfProgress, setBentoPdfProgress] = useState(0);
    const [bentoPdfState, setBentoPdfState] = useState<"idle" | "generating" | "ready">("idle");

    // Bento Box: URL Copy Simulator
    const [bentoUrlCopied, setBentoUrlCopied] = useState(false);

    // Interactive Stats Tab State
    const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

    // Profile Mockup theme state
    const [profileMockupTheme, setProfileMockupTheme] = useState<"light" | "dark">("light");

    // Cursor glow element ref
    const glowRef = useRef<HTMLDivElement>(null);

    // Initialize and read theme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem("profolio-theme");
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
            setProfileMockupTheme(savedTheme);
        }
    }, []);

    // Synchronize mockup theme with global theme changes
    useEffect(() => {
        setProfileMockupTheme(theme);
    }, [theme]);

    // Toggle Theme
    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        localStorage.setItem("profolio-theme", nextTheme);
    };

    // Cursor glow movement listener
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (glowRef.current) {
                glowRef.current.style.left = `${e.clientX}px`;
                glowRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Scroll reveal animations listener
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Sticky header listener
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Run Hero Simulation typing loop
    useEffect(() => {
        runHeroSimulation();
        return () => {
            if (heroAutoPlayRef.current) clearInterval(heroAutoPlayRef.current);
        };
    }, []);

    const runHeroSimulation = () => {
        if (heroAutoPlayRef.current) clearInterval(heroAutoPlayRef.current);

        setHeroState("typing-user");
        setHeroTypingText("");
        setHeroAiText("");

        const userPhrase = "J'ai code l'API Node";
        const aiPhrase = "Architecturé et déployé une API REST sous Node.js/Express, traitant plus de 500k requêtes par jour avec un temps de réponse moyen < 50ms.";

        let userIndex = 0;
        const userInterval = setInterval(() => {
            if (userIndex < userPhrase.length) {
                setHeroTypingText((prev) => prev + userPhrase.charAt(userIndex));
                userIndex++;
            } else {
                clearInterval(userInterval);
                setHeroState("loading");

                // Wait 1.2s then start typing AI response
                setTimeout(() => {
                    setHeroState("typing-ai");
                    let aiIndex = 0;
                    const aiInterval = setInterval(() => {
                        if (aiIndex < aiPhrase.length) {
                            setHeroAiText((prev) => prev + aiPhrase.charAt(aiIndex));
                            aiIndex++;
                        } else {
                            clearInterval(aiInterval);
                            setHeroState("idle");

                            // Restart simulation loop after 6 seconds of idling
                            heroAutoPlayRef.current = setTimeout(() => {
                                runHeroSimulation();
                            }, 6000);
                        }
                    }, 15);
                }, 1200);
            }
        }, 45);
    };

    const handleHeroTabChange = (tab: "editor" | "profile" | "stats") => {
        setActiveHeroTab(tab);
        if (tab === "editor") {
            runHeroSimulation();
        } else {
            if (heroAutoPlayRef.current) clearInterval(heroAutoPlayRef.current);
        }
    };

    // Run the AI sandbox playground optimizer
    const handleSandboxOptimize = () => {
        if (!sandboxInput.trim()) return;
        setIsSandboxOptimizing(true);
        setSandboxResult("");
        setTypedSandboxResult("");
        setSandboxCopied(false);

        // Sequence of mock AI steps
        setSandboxStep("Analyse lexicale et syntaxique...");
        setTimeout(() => {
            setSandboxStep("Identification d'indicateurs d'impact...");
            setTimeout(() => {
                setSandboxStep("Formulation de la valeur ajoutée...");
                setTimeout(() => {
                    setIsSandboxOptimizing(false);

                    // Determine rewrite: check presets or generate dynamic
                    const matchedPreset = PLAYGROUND_PRESETS.find(
                        p => p.raw.toLowerCase() === sandboxInput.trim().toLowerCase()
                    );

                    let finalResult = "";
                    let finalMetric = "";

                    if (matchedPreset) {
                        finalResult = matchedPreset.refined;
                        finalMetric = matchedPreset.metric;
                    } else {
                        finalResult = rewriteCustomInput(sandboxInput);
                        finalMetric = "+30% d'impact visuel · Ton professionnel";
                    }

                    setSandboxResult(finalResult);
                    setSandboxMetric(finalMetric);

                    // Typewriter effect for the sandbox result
                    let i = 0;
                    const interval = setInterval(() => {
                        if (i < finalResult.length) {
                            setTypedSandboxResult((prev) => prev + finalResult.charAt(i));
                            i++;
                        } else {
                            clearInterval(interval);
                        }
                    }, 12);
                }, 500);
            }, 500);
        }, 500);
    };

    // Local rule-based rewriter for custom input
    const rewriteCustomInput = (input: string) => {
        const cleanInput = input.trim();
        if (cleanInput.length < 5) return "Veuillez entrer une description d'expérience plus complète.";

        const words = cleanInput.toLowerCase().split(/\s+/);
        let verb = "Optimisation et déploiement";
        let detail = "";

        if (words.some(w => ["site", "interface", "front", "react", "css", "html", "web", "vue"].includes(w))) {
            verb = "Conception de composants d'interface réutilisables et modernisation de l'expérience utilisateur (UI/UX)";
            detail = "sous React/Next.js, élevant les performances Core Web Vitals à 98% et éliminant les lenteurs de navigation";
        } else if (words.some(w => ["api", "node", "php", "laravel", "python", "backend", "serveur", "base", "sql"].includes(w))) {
            verb = "Refactoring de l'infrastructure de données et optimisation des points d'accès API";
            detail = "permettant une réduction des temps de latence de 40% et garantissant la scalabilité lors des pics de charge";
        } else if (words.some(w => ["bug", "corrige", "resolu", "fix", "erreur"].includes(w))) {
            verb = "Audit de sécurité et résolution d'anomalies bloquantes au sein du code legacy";
            detail = "sécurisant la plateforme web et réduisant le taux d'abandon du panier de 12%";
        } else {
            verb = `Mise en œuvre technique et pilotage de la solution : "${cleanInput}"`;
            detail = "en respectant les standards de l'industrie (Clean Code), optimisant ainsi la maintenance du projet de 25%";
        }

        return `${verb} ${detail}.`;
    };

    // Run the PDF export animation
    const handlePdfExportSimulation = () => {
        if (bentoPdfState !== "idle") return;
        setBentoPdfState("generating");
        setBentoPdfProgress(0);

        const interval = setInterval(() => {
            setBentoPdfProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setBentoPdfState("ready");
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    // Copy unique URL simulation
    const handleCopyUrlSimulation = () => {
        setBentoUrlCopied(true);
        navigator.clipboard.writeText("profolio.app/u/sarah-ngoma");
        setTimeout(() => setBentoUrlCopied(false), 2000);
    };

    // Copy sandbox result
    const handleCopySandboxResult = () => {
        setSandboxCopied(true);
        navigator.clipboard.writeText(sandboxResult);
        setTimeout(() => setSandboxCopied(false), 2000);
    };

    const chartDays = [
        { label: "Lun", count: 48 },
        { label: "Mar", count: 72 },
        { label: "Mer", count: 95 },
        { label: "Jeu", count: 124 },
        { label: "Ven", count: 88 },
        { label: "Sam", count: 32 },
        { label: "Dim", count: 41 }
    ];

    return (
        <div className={theme === "dark" ? "dark" : ""}>

            {/* Interactive Cursor Glow */}
            <div className="cursor-glow" id="cursorGlow" ref={glowRef}></div>

            {/* HEADER / NAVIGATION */}
            <nav className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">
                <div className="nav-inner">
                    <Link href="#" className="logo">
                        <div className="logo-mark">P</div>
                        <span>Profolio</span>
                    </Link>

                    <ul className="nav-links">
                        <li><a href="#problem">Le problème</a></li>
                        <li><a href="#solution">La solution</a></li>
                        <li><a href="#features">Fonctionnalités</a></li>
                        <li><a href="#process">Comment ça marche</a></li>
                        <li><a href="#recruiters">Recruteurs</a></li>
                    </ul>

                    <div className="nav-cta">
                        {/* Theme switcher */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer mr-2 ${theme === "dark"
                                    ? "bg-slate-900 border-slate-800 text-amber-400 hover:border-slate-700"
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                                }`}
                            aria-label="Changer de thème"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {user ? (
                            <Link href="/dashboard" className="btn btn-primary">
                                Mon Dashboard
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-ghost">Connexion</Link>
                                <Link href="/register" className="btn btn-primary">
                                    Commencer
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <button
                            className="mobile-toggle p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 p-6 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 shadow-xl flex flex-col gap-6 animate-fade-in text-left">
                        <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-650">Le problème</a>
                        <a href="#solution" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-650">La solution</a>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-650">Fonctionnalités</a>
                        <a href="#process" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-650">Comment ça marche</a>
                        <a href="#recruiters" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-650">Recruteurs</a>
                        <div className="flex gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
                            {user ? (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-accent flex-1 justify-center">
                                    Mon Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline flex-1 justify-center">Se connecter</Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-accent flex-1 justify-center">Commencer</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-glow"></div>
                <div className="hero-grid"></div>
                <div className="container">
                    <div className="hero-content px-10">

                        {/* Left Column Text */}
                        <div className="hero-text text-left">

                            <h1 className="hero-title">
                                <span className="line">Votre identité</span>
                                <span className="line"><span className="italic">professionnelle,</span></span>
                                <span className="line">enfin <span className="accent">unifiée.</span></span>
                            </h1>

                            <p className="hero-desc">
                                Remplacez le CV traditionnel par une expérience numérique moderne, interactive et toujours à jour. Un lien unique pour toute votre carrière.
                            </p>

                            <div className="hero-actions">
                                {user ? (
                                    <Link href="/dashboard" className="btn btn-primary btn-lg">
                                        Accéder à mon Dashboard
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                ) : (
                                    <Link href="/register" className="btn btn-primary btn-lg">
                                        Créer mon Profolio
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                )}
                                <a href="#playground-section" className="btn btn-outline btn-lg">
                                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                                    Tester l'assistant IA
                                </a>
                            </div>

                            <div className="hero-meta">
                                <div className="hero-meta-item">
                                    <div className="hero-meta-value font-display">50K+</div>
                                    <div className="hero-meta-label">Profils créés</div>
                                </div>
                                <div className="hero-meta-item">
                                    <div className="hero-meta-value font-display">2.4M</div>
                                    <div className="hero-meta-label">Vues de profil</div>
                                </div>
                                <div className="hero-meta-item">
                                    <div className="hero-meta-value font-display">98%</div>
                                    <div className="hero-meta-label">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Profile Mockup + Float cards */}
                        <div className="hero-visual">

                            {/* Interactive browser tabs */}
                            <div className="absolute -top-12 inset-x-0 flex justify-end z-20 pr-4">
                                <div className="flex bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm gap-1">
                                    {[
                                        { id: "profile", label: "Profil", icon: Eye },
                                        { id: "editor", label: "Studio IA", icon: Terminal },
                                        { id: "stats", label: "Analytics", icon: BarChart3 }
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleHeroTabChange(t.id as any)}
                                            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${activeHeroTab === t.id
                                                    ? "bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                                }`}
                                        >
                                            <t.icon className="w-3 h-3" />
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sarah Ngoma's profile mockup card */}
                            <div className="profile-mockup">

                                {/* Simulated address bar */}
                                <div className="mockup-browser">
                                    <div className="mockup-dots">
                                        <div className="mockup-dot"></div>
                                        <div className="mockup-dot"></div>
                                        <div className="mockup-dot"></div>
                                    </div>
                                    <div className="mockup-url">
                                        <span className="mockup-url-lock">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        </span>
                                        {activeHeroTab === "stats" ? "profolio.app/sarah-ngoma/stats" : "profolio.app/sarah-ngoma"}
                                    </div>
                                </div>

                                {/* Display pane based on tab */}
                                <div className="mockup-body min-h-[340px]">

                                    {/* Option 1: Profile View */}
                                    {activeHeroTab === "profile" && (
                                        <div className="animate-fade-in space-y-4">
                                            <div className="mockup-cover relative">
                                                <div className="mockup-avatar">
                                                    SN
                                                    <div className="mockup-verified">
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mockup-name-row mt-6">
                                                <div className="mockup-name font-display">Sarah Ngoma</div>
                                                <div className="mockup-badge">✓ Vérifié</div>
                                            </div>
                                            <div className="mockup-role">Senior Product Designer • Paris, France</div>
                                            <div className="mockup-bio">
                                                Passionnée par le design centré utilisateur avec 5 ans d'expérience dans la création d'interfaces innovantes.
                                            </div>
                                            <div className="mockup-skills">
                                                <span className="mockup-skill">Figma</span>
                                                <span className="mockup-skill">Design Systems</span>
                                                <span className="mockup-skill">UX Research</span>
                                                <span className="mockup-skill">Next.js</span>
                                            </div>
                                            <div className="mockup-stats">
                                                <div className="mockup-stat">
                                                    <div className="mockup-stat-value font-display">5+</div>
                                                    <div className="mockup-stat-label">Années</div>
                                                </div>
                                                <div className="mockup-stat">
                                                    <div className="mockup-stat-value font-display">47</div>
                                                    <div className="mockup-stat-label">Projets</div>
                                                </div>
                                                <div className="mockup-stat">
                                                    <div className="mockup-stat-value font-display">12</div>
                                                    <div className="mockup-stat-label">Certifs</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Option 2: Studio IA Simulator */}
                                    {activeHeroTab === "editor" && (
                                        <div className="animate-fade-in space-y-4 font-mono text-xs">
                                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                                                <span>STUDIO IA ASSISTANT</span>
                                                <span>STATUS: {heroState.toUpperCase()}</span>
                                            </div>

                                            {/* Before Box */}
                                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
                                                <div className="text-[9px] text-slate-400 font-sans font-bold uppercase mb-1">Phrase d'origine :</div>
                                                <div className="text-slate-700 dark:text-slate-300 min-h-[16px] flex items-center">
                                                    <span>{heroTypingText}</span>
                                                    {heroState === "typing-user" && <span className="w-1.5 h-3.5 bg-indigo-500 ml-0.5 animate-pulse"></span>}
                                                </div>
                                            </div>

                                            {/* Flow Indicator */}
                                            <div className="flex justify-center text-indigo-500">
                                                <ChevronRight className="w-5 h-5 rotate-90" />
                                            </div>

                                            {/* After Box */}
                                            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 p-3 rounded-lg relative overflow-hidden">
                                                <div className="text-[9px] text-indigo-600 font-sans font-bold uppercase mb-1 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" /> Formulation optimisée Profolio AI :
                                                </div>
                                                {heroState === "loading" ? (
                                                    <div className="flex items-center gap-1.5 text-slate-400 py-1">
                                                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                                                        <span className="text-[11px]">Calcul d'impact...</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs">
                                                        {heroAiText}
                                                        {heroState === "typing-ai" && <span className="w-1.5 h-3.5 bg-indigo-550 ml-0.5 animate-pulse inline-block"></span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Option 3: Analytics mockup */}
                                    {activeHeroTab === "stats" && (
                                        <div className="animate-fade-in space-y-4">
                                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                                <span>TRAFFIC ANALYTICS</span>
                                                {hoveredBarIndex !== null && (
                                                    <span className="text-indigo-650 font-bold">
                                                        {chartDays[hoveredBarIndex].label} : {chartDays[hoveredBarIndex].count} visiteurs
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { label: "Visites", val: 2847 },
                                                    { label: "Téléchargements", val: 512 },
                                                    { label: "Clics Liens", val: 1042 }
                                                ].map((s, i) => (
                                                    <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-2 rounded-lg text-center">
                                                        <div className="text-base font-bold text-indigo-650 font-display">{s.val}</div>
                                                        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Daily bar graph */}
                                            <div className="border border-slate-150 dark:border-slate-800/80 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/30">
                                                <div className="flex items-end justify-between gap-1.5 h-24 pt-2">
                                                    {chartDays.map((day, idx) => {
                                                        const barHeight = (day.count / 124) * 100;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                                                                onMouseEnter={() => setHoveredBarIndex(idx)}
                                                                onMouseLeave={() => setHoveredBarIndex(null)}
                                                            >
                                                                <div className="w-full relative">
                                                                    <div
                                                                        className={`w-full rounded-t transition-all duration-300 ${hoveredBarIndex === idx
                                                                                ? "bg-indigo-600 shadow-sm"
                                                                                : "bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-350"
                                                                            }`}
                                                                        style={{ height: `${barHeight}%`, minHeight: "4px" }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-[9px] text-slate-400 font-mono">{day.label}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Floating cards */}
                            <div className="float-card float-card-1">
                                <div className="float-icon float-icon-accent">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <div>
                                    <div className="float-title">Profil vérifié</div>
                                    <div className="float-sub">Identité confirmée</div>
                                </div>
                            </div>

                            <div className="float-card float-card-2">
                                <div className="float-icon float-icon-violet">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                                <div>
                                    <div className="float-title">+2 847 vues</div>
                                    <div className="float-sub">Ce mois-ci</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* BRAND MARQUEE SECTION */}
            <section className="marquee-section">
                <div className="marquee-label">Ils utilisent déjà Profolio pour se démarquer</div>
                <div className="marquee">
                    <div className="marquee-track">
                        {["Google", "Microsoft", "Apple", "Meta", "Amazon", "Netflix", "Spotify", "Airbnb", "Stripe", "Figma"].map((brand, i) => (
                            <div key={i} className="marquee-item">{brand}</div>
                        ))}
                        {["Google", "Microsoft", "Apple", "Meta", "Amazon", "Netflix", "Spotify", "Airbnb", "Stripe", "Figma"].map((brand, i) => (
                            <div key={`dup-${i}`} className="marquee-item">{brand}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THE PROBLEM SECTION */}
            <section className="section" id="problem">
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow">Le problème</div>
                        <h2 className="section-title">Le recrutement évolue.<br /><span className="italic">Les outils, non.</span></h2>
                        <p className="section-desc">
                            CV PDF statiques, portfolios complexes, informations dispersées. Les candidats manquent de moyens pour se valoriser efficacement.
                        </p>
                    </div>

                    <div className="problem-grid px-10">
                        <div className="problem-card problem-card-1 reveal">
                            <div className="problem-number">01 / FRAGMENTATION</div>
                            <h3 className="problem-title">Vos informations sont éparpillées</h3>
                            <p className="problem-desc font-sans">
                                Un CV PDF, un profil LinkedIn, un portfolio, un dépôt GitHub, un Behance. Les recruteurs doivent naviguer entre plusieurs plateformes pour découvrir votre potentiel.
                            </p>

                            <div className="problem-visual font-mono text-[11px] text-slate-500 space-y-2 text-left">
                                <div className="problem-visual-row">
                                    <div className="problem-visual-icon"></div>
                                    <span>CV.pdf — version obsolète</span>
                                </div>
                                <div className="problem-visual-row">
                                    <div className="problem-visual-icon muted"></div>
                                    <span>linkedin.com/in/... — profil incomplet</span>
                                </div>
                                <div className="problem-visual-row">
                                    <div className="problem-visual-icon muted"></div>
                                    <span>mon-portfolio.com — non mis à jour</span>
                                </div>
                                <div className="problem-visual-row">
                                    <div className="problem-visual-icon muted"></div>
                                    <span>github.com/... — difficile à lire</span>
                                </div>
                            </div>
                        </div>

                        <div className="problem-card problem-card-2 reveal reveal-delay-1">
                            <div className="problem-number">02 / STATIQUE</div>
                            <h3 className="problem-title">Le CV PDF est dépassé</h3>
                            <p className="problem-desc font-sans">
                                À chaque candidature, il faut adapter, reformater, renvoyer. Les informations deviennent obsolètes avant même d'être lues par les recruteurs.
                            </p>
                        </div>

                        <div className="problem-card problem-card-3 reveal reveal-delay-1">
                            <div className="problem-number">03 / TEMPS</div>
                            <h3 className="problem-title">6 secondes</h3>
                            <p className="problem-desc font-sans">
                                C'est le temps moyen qu'un recruteur accorde à un CV traditionnel. Votre profil professionnel doit captiver son intérêt instantanément.
                            </p>
                        </div>

                        <div className="problem-card problem-card-4 reveal reveal-delay-2">
                            <div className="problem-number">04 / COMPLEXITÉ</div>
                            <h3 className="problem-title">Portfolios complexes</h3>
                            <p className="problem-desc font-sans">
                                Créer un portfolio web personnel demande du temps, de l'argent et des compétences en développement.
                            </p>
                        </div>

                        <div className="problem-card problem-card-5 reveal reveal-delay-3">
                            <div className="problem-number">05 / CRÉDIBILITÉ</div>
                            <h3 className="problem-title font-display">Crédibilité à vérifier</h3>
                            <p className="problem-desc font-sans">
                                Diplômes, expériences, certifications : rien n'est vérifiable rapidement par un recruteur sans entamer de longues démarches.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE SOLUTION SECTION */}
            <section className="section" id="solution" style={{ background: "var(--bg-soft)" }}>
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow">La solution</div>
                        <h2 className="section-title">Un lien.<br /><span className="italic">Toute votre carrière.</span></h2>
                        <p className="section-desc">
                            Profolio centralise votre identité professionnelle au sein d'un espace unique, élégant et intelligent.
                        </p>
                    </div>

                    <div className="solution-layout px-10">
                        <div className="reveal text-left">
                            <div className="url-preview">
                                <div className="url-preview-label">Votre URL unique</div>
                                <div className="url-preview-value">
                                    <span className="domain">profolio.app/</span>
                                    <span className="slug">sarah-ngoma</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-sans">
                                Cette page devient la référence professionnelle officielle de son propriétaire, regroupant tout son écosystème de manière dynamique et validée.
                            </p>

                            <div className="feature-list font-sans">
                                {[
                                    "Création rapide en 3 min",
                                    "URL unique personnalisée",
                                    "Plusieurs profils cibles",
                                    "Portfolio de projets",
                                    "CV dynamique synchronisé",
                                    "Optimisation IA d'impact"
                                ].map((f, i) => (
                                    <div key={i} className="feature-list-item">
                                        <span className="feature-list-check">✓</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Profile Mockup Visual */}
                        <div className="reveal reveal-delay-1">
                            <div className="browser-mockup">
                                <div className="browser-top">
                                    <div className="browser-dots">
                                        <div className="browser-dot"></div>
                                        <div className="browser-dot"></div>
                                        <div className="browser-dot"></div>
                                    </div>
                                    <div className="browser-address">profolio.app/sarah-ngoma</div>
                                </div>
                                <div className="browser-content">
                                    <div className="browser-hero">
                                        <div className="browser-avatar"></div>
                                    </div>
                                    <div className="browser-info mt-6">
                                        <div className="browser-name">Sarah Ngoma</div>
                                        <div className="browser-role font-sans">Senior Product Designer • Paris</div>

                                        <div className="browser-section mt-4">
                                            <div className="browser-section-label">A propos</div>
                                            <p className="text-[11px] leading-relaxed text-slate-550 font-sans">
                                                Designer passionnée par la création d'outils collaboratifs simples et d'interfaces fluides.
                                            </p>
                                        </div>

                                        <div className="browser-section">
                                            <div className="browser-section-label">Réalisations récentes</div>
                                            <div className="browser-projects">
                                                <div className="browser-project"></div>
                                                <div className="browser-project"></div>
                                                <div className="browser-project"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO FEATURES SECTION */}
            <section className="section" id="features">
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow">Fonctionnalités</div>
                        <h2 className="section-title">Une identité professionnelle<br /><span className="italic">intelligente.</span></h2>
                        <p className="section-desc">
                            Découvrez la richesse d'outils conçus pour valoriser efficacement votre profil auprès des recruteurs techniques.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="bento px-10">

                        {/* Bento 1: AI Redaction Playground (High priority, 3 cols wide, 2 cols tall) */}
                        <div className="bento-item bento-1 reveal font-sans" id="playground-section">
                            <div className="bento-icon">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="bento-title">Intelligence Artificielle</h3>
                            <p className="bento-desc">
                                Notre IA vous accompagne pour formuler vos expériences professionnelles, biographie, et adapter vos forces aux attentes du marché.
                            </p>

                            {/* AI Playground Sandbox Widget */}
                            <div className="ai-demo text-left mt-6">
                                <div className="mb-4">
                                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                                        {PLAYGROUND_PRESETS.map((preset, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSandboxInput(preset.raw);
                                                    setSandboxResult("");
                                                    setTypedSandboxResult("");
                                                    setSandboxCopied(false);
                                                }}
                                                className={`px-2 py-1.5 text-[9px] font-bold rounded border transition-all cursor-pointer ${sandboxInput === preset.raw
                                                        ? "bg-indigo-600 border-indigo-650 text-white"
                                                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            value={sandboxInput}
                                            onChange={(e) => {
                                                setSandboxInput(e.target.value);
                                                setSandboxResult("");
                                                setTypedSandboxResult("");
                                            }}
                                            placeholder="Ex: J'ai fait l'interface de la boutique."
                                            rows={2}
                                            maxLength={80}
                                            className="w-full text-xs p-2.5 pr-14 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 font-sans resize-none"
                                        />
                                        <button
                                            onClick={handleSandboxOptimize}
                                            disabled={isSandboxOptimizing || !sandboxInput.trim()}
                                            className="absolute right-2 bottom-2 p-1.5 bg-indigo-650 text-white rounded-lg hover:bg-indigo-550 transition-colors disabled:opacity-40"
                                        >
                                            {isSandboxOptimizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Simulated response before/after block */}
                                {(isSandboxOptimizing || sandboxResult) && (
                                    <div className="space-y-2 animate-fade-in">
                                        <div className="ai-demo-row ai-demo-before font-sans">
                                            <span className="ai-demo-label font-mono">Avant</span>
                                            "{sandboxInput}"
                                        </div>
                                        <div className="ai-demo-row ai-demo-after relative font-sans">
                                            <span className="ai-demo-label font-mono">Après (Profolio AI)</span>
                                            <p className="pr-8">{typedSandboxResult || "Analyse en cours..."}</p>

                                            {sandboxResult && !isSandboxOptimizing && (
                                                <button
                                                    onClick={handleCopySandboxResult}
                                                    className="absolute right-2 top-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-500 hover:text-slate-800"
                                                    title="Copier le texte"
                                                >
                                                    {sandboxCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bento 2: Multiple profiles */}
                        <div className="bento-item bento-2 reveal reveal-delay-1 font-sans">
                            <div className="bento-icon bento-icon-violet">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h3 className="bento-title font-display">Plusieurs profils</h3>
                            <p className="bento-desc">
                                Adaptez votre CV à chaque opportunité. Créez des versions adaptées pour votre activité Freelance ou vos candidatures CDI.
                            </p>

                            {/* Switches */}
                            <div className="flex gap-2 mt-5">
                                {[
                                    { id: "react", label: "Dev React" },
                                    { id: "php", label: "Freelance" },
                                    { id: "lead", label: "Tech Lead" }
                                ].map((b) => (
                                    <button
                                        key={b.id}
                                        onClick={() => setBentoProfileType(b.id as any)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${bentoProfileType === b.id
                                                ? "bg-violet-600 border-violet-700 text-white"
                                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {b.label}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[11px] mt-4 font-mono text-slate-400 flex justify-between">
                                <span>URL active :</span>
                                <span className="text-violet-650 font-bold uppercase tracking-wider">
                                    {bentoProfileType === "react" && "React Dev"}
                                    {bentoProfileType === "php" && "Freelance PHP"}
                                    {bentoProfileType === "lead" && "Tech Lead"}
                                </span>
                            </div>
                        </div>

                        {/* Bento 3: Statistics */}
                        <div className="bento-item bento-3 reveal reveal-delay-2 font-sans">
                            <div className="bento-icon bento-icon-orange">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="bento-title">Statistiques</h3>
                            <p className="bento-desc">
                                Suivez votre audience. Nombre de visiteurs, téléchargements du CV et temps passé par les recruteurs.
                            </p>

                            <div className="bento-stats font-sans">
                                <div className="bento-stat">
                                    <div className="bento-stat-value font-display">2.8K</div>
                                    <div className="bento-stat-label">Vues</div>
                                </div>
                                <div className="bento-stat">
                                    <div className="bento-stat-value font-display">512</div>
                                    <div className="bento-stat-label">CV DL</div>
                                </div>
                                <div className="bento-stat">
                                    <div className="bento-stat-value font-display">2m45</div>
                                    <div className="bento-stat-label">Temps</div>
                                </div>
                            </div>
                        </div>

                        {/* Bento 4: PDF Export */}
                        <div className="bento-item bento-4 reveal reveal-delay-1 font-sans">
                            <div className="bento-icon">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="bento-title font-display">CV dynamique</h3>
                            <p className="bento-desc">
                                Le CV papier est généré automatiquement à partir de votre profil et synchronisé en temps réel.
                            </p>

                            <div className="mt-5">
                                <button
                                    onClick={handlePdfExportSimulation}
                                    disabled={bentoPdfState !== "idle"}
                                    className="w-full py-2.5 bg-slate-950 dark:bg-slate-900 text-white border border-slate-900 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:pointer-events-none hover:bg-slate-900"
                                >
                                    {bentoPdfState === "idle" && (
                                        <>
                                            <FileDown className="w-3.5 h-3.5 text-lime" />
                                            <span>Télécharger PDF</span>
                                        </>
                                    )}
                                    {bentoPdfState === "generating" && (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-lime" />
                                            <span>Génération... {bentoPdfProgress}%</span>
                                        </>
                                    )}
                                    {bentoPdfState === "ready" && (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">PDF Téléchargé</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Bento 5: Customized URL */}
                        <div className="bento-item bento-5 reveal reveal-delay-2 font-sans">
                            <div className="bento-icon bento-icon-violet">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                            <h3 className="bento-title font-display">URL unique</h3>
                            <p className="bento-desc">
                                Obtenez profolio.app/votre-nom, le point de départ de vos candidatures et de votre signature de mail.
                            </p>

                            <div
                                onClick={handleCopyUrlSimulation}
                                className="mt-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg flex items-center justify-between text-[10px] font-mono cursor-pointer text-slate-500 hover:text-slate-800"
                            >
                                <span>profolio.app/sarah-ngoma</span>
                                {bentoUrlCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </div>
                        </div>

                        {/* Bento 6: Trust badge */}
                        <div className="bento-item bento-6 reveal reveal-delay-3 font-sans">
                            <div className="bento-icon bento-icon-orange">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="bento-title font-display">Vérification</h3>
                            <p className="bento-desc">
                                Des badges de confiance certifient vos diplômes académiques et vos compétences GitHub.
                            </p>

                            <div className="mt-5 flex items-center space-x-2 border p-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg text-[9px]">
                                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold">✓</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">GitHub connecté & validé</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* PROCESS SECTION */}
            <section className="section" id="process" style={{ background: "var(--bg-soft)" }}>
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow">Le processus</div>
                        <h2 className="section-title">Créez votre profil en<br /><span className="italic">quelques minutes.</span></h2>
                        <p className="section-desc">
                            Une interface intuitive guidée pas à pas. Aucune compétence technique n'est requise.
                        </p>
                    </div>

                    <div className="process-grid px-10">
                        <div className="process-card reveal">
                            <div className="process-number">01</div>
                            <h3 className="process-title">Complétez vos détails</h3>
                            <p className="process-desc">
                                Saisissez vos formations, expériences professionnelles, projets et compétences au sein de notre éditeur structuré.
                            </p>
                        </div>

                        <div className="process-card reveal reveal-delay-1">
                            <div className="process-number">02</div>
                            <h3 className="process-title">L'IA embellit</h3>
                            <p className="process-desc">
                                Notre assistant IA optimise vos biographie et formulations d'expériences pour maximiser votre impact auprès des recruteurs.
                            </p>
                        </div>

                        <div className="process-card reveal reveal-delay-2">
                            <div className="process-number">03</div>
                            <h3 className="process-title">Partagez votre URL</h3>
                            <p className="process-desc">
                                Ajoutez votre lien profolio.app/votre-nom sur votre CV papier, signature de mail, réseaux sociaux ou candidatures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AUDIENCE TARGETS SECTION */}
            <section className="section">
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow font-mono">Public cible</div>
                        <h2 className="section-title">Un espace pour tous<br /><span className="italic">les professionnels.</span></h2>
                        <p className="section-desc">
                            Que vous cherchiez un emploi, des clients freelances ou partagiez vos réalisations, Profolio est conçu pour vous.
                        </p>
                    </div>

                    <div className="audience-grid font-sans px-10">
                        {[
                            { label: "Développeurs", sub: "Lien GitHub & Code" },
                            { label: "Designers", sub: "Behance & Portfolios" },
                            { label: "Freelances", sub: "Tarifs & Missions" },
                            { label: "Étudiants", sub: "Formations & Projets" },
                            { label: "Ingénieurs", sub: "Expertise technique" },
                            { label: "Chefs de projet", sub: "Méthodologie" },
                            { label: "Consultants", sub: "Compétences clés" },
                            { label: "Entrepreneurs", sub: "Lancements & Pitch" }
                        ].map((audience, i) => (
                            <div key={i} className="audience-item reveal">
                                <div className="audience-icon">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="audience-label">{audience.label}</div>
                                    <div className="audience-sub">{audience.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RECRUITER SECTION */}
            <section className="section" id="recruiters" style={{ background: "var(--bg-soft)" }}>
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow font-mono">Expérience Recruteur</div>
                        <h2 className="section-title">Valorisez vos forces.<br /><span className="italic">Faites gagner du temps.</span></h2>
                        <p className="section-desc">
                            Nous offrons aux recruteurs une lecture fluide et instantanée du potentiel réel de chaque candidat.
                        </p>
                    </div>

                    <div className="recruiter-layout px-10">

                        {/* Steps & Quote */}
                        <div className="reveal text-left">
                            <div className="recruiter-steps">
                                {[
                                    { num: "01", text: "Parcourir rapidement les expériences" },
                                    { num: "02", text: "Consulter directement les démos de projets" },
                                    { num: "03", text: "Vérifier les badges de certifications et GitHub" },
                                    { num: "04", text: "Télécharger le CV papier à jour en un clic" }
                                ].map((step, i) => (
                                    <div key={i} className="recruiter-step">
                                        <span className="recruiter-step-num font-display">{step.num}</span>
                                        <span className="recruiter-step-text font-sans">{step.text}</span>
                                        <span className="recruiter-step-arrow">→</span>
                                    </div>
                                ))}
                            </div>

                            <div className="recruiter-quote">
                                <p className="recruiter-quote-text">
                                    "Les profils Profolio me font gagner un temps fou. Je peux naviguer dans les compétences, voir le vrai code GitHub et télécharger le CV à jour. C'est le standard de demain."
                                </p>
                                <div className="recruiter-quote-author">
                                    ALEXANDRE DUBOIS — TECH RECRUITER FREELANCE (EX-MANOMANO)
                                </div>
                            </div>
                        </div>

                        {/* Recruiter view mockup */}
                        <div className="reveal reveal-delay-1">
                            <div className="recruiter-card">
                                <div className="recruiter-card-header text-left">
                                    <div className="recruiter-card-avatar">SN</div>
                                    <div>
                                        <h4 className="recruiter-card-name">Sarah Ngoma</h4>
                                        <p className="recruiter-card-role font-sans">Product Designer • Paris</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left font-sans">
                                    <div className="recruiter-card-section">
                                        <div className="recruiter-card-label">Statut professionnel</div>
                                        <div className="recruiter-card-value">Disponible immédiatement pour CDI</div>
                                    </div>

                                    <div className="recruiter-card-section">
                                        <div className="recruiter-card-label">GitHub vérifié</div>
                                        <div className="recruiter-card-value flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span>14 dépôts publics connectés</span>
                                        </div>
                                    </div>

                                    <div className="recruiter-card-section">
                                        <div className="recruiter-card-label">Dernière mise à jour</div>
                                        <div className="recruiter-card-value text-indigo-650">Aujourd'hui, à 18h42</div>
                                    </div>
                                </div>

                                <div className="recruiter-card-actions">
                                    <button className="recruiter-card-btn recruiter-card-btn-primary cursor-pointer">
                                        Contacter le candidat
                                    </button>
                                    <button className="recruiter-card-btn recruiter-card-btn-secondary cursor-pointer">
                                        Télécharger le CV
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            <section className="section">
                <div className="container">
                    <div className="reveal px-10">
                        <div className="section-eyebrow">Philosophie</div>
                        <h2 className="section-title">Notre charte du design<br /><span className="italic">et de l'expérience.</span></h2>
                        <p className="section-desc">
                            Nous construisons une plateforme qui inspire immédiatement confiance aux entreprises de technologie.
                        </p>
                    </div>

                    <div className="philosophy-grid px-10">
                        {[
                            { num: "01", title: "Minimalisme", desc: "Chaque élément possède une utilité propre. Aucune surcharge visuelle superflue." },
                            { num: "02", title: "Élégance", desc: "De grands espaces aérés, une hiérarchie visuelle claire, des polices modernes." },
                            { num: "03", title: "Fluidité", desc: "Des animations discrètes et une navigation naturelle sur mobile et desktop." },
                            { num: "04", title: "Professionnel", desc: "Chaque profil donne l'impression d'avoir été conçu sur-mesure par une agence." },
                            { num: "05", title: "Rapidité", desc: "Temps de chargement minimisés et navigation instantanée entre les sections." }
                        ].map((p, i) => (
                            <div key={i} className="philosophy-item reveal">
                                <div className="philosophy-number">{p.num}</div>
                                <h3 className="philosophy-title">{p.title}</h3>
                                <p className="philosophy-desc font-sans">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AMBITION / FINAL CTA */}
            <section className="ambition" id="ambition">
                <div className="ambition-glow"></div>
                <div className="container">
                    <div className="ambition-content">
                        <h2 className="ambition-title reveal">
                            Passez au CV<br />
                            <span className="italic">nouvelle</span> <span className="accent">génération.</span>
                        </h2>

                        <p className="ambition-desc reveal reveal-delay-1 font-sans">
                            Rejoignez des milliers de professionnels qui font confiance à Profolio pour valoriser leur parcours avec élégance, simplicité et crédibilité.
                        </p>

                        <div className="ambition-actions reveal reveal-delay-2">
                            {user ? (
                                <Link href="/dashboard" className="btn btn-primary btn-lg">Accéder à mon Dashboard</Link>
                            ) : (
                                <Link href="/register" className="btn btn-primary btn-lg">Créer mon Profolio</Link>
                            )}
                            <a href="#playground-section" className="btn btn-outline btn-lg">Voir la démo interactive</a>
                        </div>

                        <div className="ambition-meta reveal reveal-delay-3 font-mono text-[11px]">
                            <span className="ambition-meta-item">Gratuit & sans engagement</span>
                            <span className="ambition-meta-item">Badge certifié inclus</span>
                            <span className="ambition-meta-item">Export PDF illimité</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">

                        {/* Brand Block */}
                        <div className="footer-brand text-left">
                            <Link href="#" className="logo">
                                <div className="logo-mark">P</div>
                                <span>Profolio</span>
                            </Link>
                            <p className="footer-brand-desc font-sans">
                                L'identité professionnelle numérique de nouvelle génération. Centralisez toute votre carrière au même endroit.
                            </p>
                        </div>

                        {/* Col 1 */}
                        <div className="footer-col text-left">
                            <div className="footer-col-title">Produit</div>
                            <ul className="footer-links font-sans">
                                <li><a href="#features">Fonctionnalités</a></li>
                                <li><a href="#playground-section">Studio IA</a></li>
                                <li><a href="/register">Créer un profil</a></li>
                                <li><a href="#">Tarifs</a></li>
                            </ul>
                        </div>

                        {/* Col 2 */}
                        <div className="footer-col text-left">
                            <div className="footer-col-title font-mono">Ressources</div>
                            <ul className="footer-links font-sans">
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Documentation</a></li>
                                <li><a href="#">Aide & FAQ</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="footer-col text-left">
                            <div className="footer-col-title">Légal</div>
                            <ul className="footer-links font-sans">
                                <li><a href="#">Confidentialité</a></li>
                                <li><a href="#">Mentions Légales</a></li>
                                <li><a href="#">CGU & CGV</a></li>
                                <li><a href="#">Cookies</a></li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            &copy; 2026 PROFOLIO. CONÇU POUR LES PROFESSIONNELS DE LA TECH.
                        </div>
                        <div className="footer-legal">
                            <a href="#">Sécurité</a>
                            <a href="#">Accessibilité</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
