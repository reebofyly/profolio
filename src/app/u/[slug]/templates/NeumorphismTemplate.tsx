import React from "react";
import { MapPin, Mail, Phone, GitBranch, Send, ExternalLink, Briefcase, GraduationCap, Layers, FolderKanban, Quote, Award } from "lucide-react";

interface TemplateProps {
    profile: any;
    formatDate: (dateStr: string | null | undefined) => string;
    skillGroups: Record<string, any[]>;
    handleProjectClick: (id: number) => void;
    setShowRecModal: (val: boolean) => void;
}

export default function NeumorphismTemplate({
    profile,
    formatDate,
    skillGroups,
    handleProjectClick,
    setShowRecModal,
}: TemplateProps) {

    // Tailwind custom shadow strings for Neumorphism
    // Light mode: bg-[#e0e5ec] | Dark mode: bg-[#1e2329]
    const neumoCard = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)] rounded-3xl p-6 sm:p-4 transition-all";
    const neumoCardHover = "hover:shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] dark:hover:shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.4),inset_-6px_-6px_10px_0_rgba(255,255,255,0.05)]";
    const neumoInset = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.4),inset_-6px_-6px_10px_0_rgba(255,255,255,0.05)] rounded-2xl";
    const neumoBtn = "bg-[#e0e5ec] dark:bg-[#1e2329] shadow-[5px_5px_10px_rgb(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] dark:shadow-[5px_5px_10px_rgba(0,0,0,0.4),-5px_-5px_10px_rgba(255,255,255,0.05)] hover:shadow-[inset_4px_4px_8px_0_rgba(163,177,198,0.7),inset_-4px_-4px_8px_0_rgba(255,255,255,0.8)] dark:hover:shadow-[inset_4px_4px_8px_0_rgba(0,0,0,0.4),inset_-4px_-4px_8px_0_rgba(255,255,255,0.05)] active:scale-95 rounded-2xl transition-all cursor-pointer";

    return (
        <>
            <div className="fixed inset-0 bg-[#e0e5ec] dark:bg-[#1e2329] -z-10 transition-colors"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 font-sans text-slate-700 dark:text-slate-300 animate-slide-up">

                {/* Header section */}
                <header className={`${neumoCard} flex flex-col md:flex-row items-center gap-8 md:gap-12`}>
                    <div className="shrink-0 relative">
                        <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full p-2 ${neumoInset}`}>
                            <div className="w-full h-full rounded-full overflow-hidden">
                                {profile.photo_url ? (
                                    <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-400">
                                        {profile.user?.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                {profile.user?.name}
                            </h1>
                            <p className="text-lg sm:text-xl font-medium text-accent dark:text-accent mt-2">
                                {profile.title}
                            </p>
                            {profile.contact_location && (
                                <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-slate-500 mt-2 font-medium">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profile.contact_location}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                            {profile.contact_email && (
                                <a href={`mailto:${profile.contact_email}`} className={`${neumoBtn} p-3 text-slate-600 dark:text-slate-400 hover:text-accent`} title="Email">
                                    <Mail className="w-5 h-5" />
                                </a>
                            )}
                            {profile.contact_phone && (
                                <a href={`tel:${profile.contact_phone}`} className={`${neumoBtn} p-3 text-slate-600 dark:text-slate-400 hover:text-accent`} title="Téléphone">
                                    <Phone className="w-5 h-5" />
                                </a>
                            )}
                            {profile.social_github && (
                                <a href={profile.social_github} target="_blank" rel="noreferrer" className={`${neumoBtn} p-3 text-slate-600 dark:text-slate-400 hover:text-accent`} title="GitHub">
                                    <GitBranch className="w-5 h-5" />
                                </a>
                            )}
                            {profile.social_linkedin && (
                                <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className={`${neumoBtn} p-3 text-slate-600 dark:text-slate-400 hover:text-accent`} title="LinkedIn">
                                    <Send className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                {/* Bio Section */}
                {profile.bio && (
                    <section className={`${neumoInset} p-6 sm:p-8 text-center md:text-left`}>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {profile.bio}
                        </p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-2 space-y-12">
                        {/* Projects */}
                        {profile.projects?.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <div className={`p-3 rounded-full ${neumoCard}`}><FolderKanban className="w-5 h-5 text-accent" /></div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Projets Récents</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {profile.projects.map((proj: any) => (
                                        <div
                                            key={proj.id}
                                            onClick={() => handleProjectClick(proj.id)}
                                            className={`${neumoCard} ${neumoCardHover} cursor-pointer group flex flex-col h-full`}
                                        >
                                            {proj.image_url && (
                                                <div className={`h-50 -mt-2 -mx-2 mb-4 rounded-2xl overflow-hidden ${neumoInset} p-1`}>
                                                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover rounded-xl" />
                                                </div>
                                            )}
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2 line-clamp-1">{proj.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-6 mb-4 flex-1">{proj.description}</p>

                                            {proj.tags && (
                                                <div className="flex flex-wrap gap-2">
                                                    {proj.tags.split(",").slice(0, 3).map((tag: string, i: number) => (
                                                        <span key={i} className={`text-[10px] font-bold uppercase tracking-wider text-accent px-3 py-1 ${neumoInset}`}>
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Experience */}
                        {profile.experiences?.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <div className={`p-3 rounded-full ${neumoCard}`}><Briefcase className="w-5 h-5 text-accent" /></div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Parcours</h2>
                                </div>

                                <div className="space-y-6">
                                    {profile.experiences.map((exp: any) => (
                                        <div key={exp.id} className={`${neumoCard} rounded-xl`}>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{exp.title}</h3>
                                                <span className={`text-xs font-bold text-slate-500 px-3 py-1 ${neumoInset}`}>
                                                    {formatDate(exp.start_date)} - {exp.is_current ? "Présent" : formatDate(exp.end_date)}
                                                </span>
                                            </div>
                                            <p className="font-bold text-accent text-sm mb-3">{exp.company}</p>
                                            {exp.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-12">

                        {/* Skills */}
                        {profile.skills?.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <div className={`p-3 rounded-full ${neumoCard}`}><Layers className="w-5 h-5 text-accent" /></div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Skills</h2>
                                </div>

                                <div className={`${neumoCard} space-y-6 rounded-xl`}>
                                    {profile.skills.map((skill: any) => (
                                        <div key={skill.id} className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <span>{skill.name}</span>
                                                <span>{skill.level}%</span>
                                            </div>
                                            <div className={`h-3 w-full rounded-full ${neumoInset} p-0.5`}>
                                                <div
                                                    className="h-full bg-accent rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]"
                                                    style={{ width: `${skill.level}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Testimonials */}
                        {profile.recommendations?.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <div className={`p-3 rounded-full ${neumoCard}`}><Quote className="w-5 h-5 text-accent" /></div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Avis</h2>
                                </div>

                                <div className="space-y-6">
                                    {profile.recommendations.map((rec: any) => (
                                        <div key={rec.id} className={`${neumoInset} p-6 relative`}>
                                            <Quote className="absolute top-4 right-4 w-12 h-12 text-slate-300 dark:text-slate-700 opacity-50" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4 relative z-10">"{rec.content}"</p>
                                            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{rec.recommender_name}</div>
                                            <div className="text-xs text-accent">{rec.recommender_role}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                </div>

                {/* Action */}
                <div className="pt-12 flex justify-center pb-12">
                    <button
                        onClick={() => setShowRecModal(true)}
                        className={`${neumoBtn} px-8 py-4 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-sm flex items-center gap-3`}
                    >
                        <Send className="w-4 h-4" /> Laisser une recommandation
                    </button>
                </div>
            </div>
        </>
    );
}
