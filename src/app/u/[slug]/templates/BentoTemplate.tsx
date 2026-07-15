import React from "react";
import { MapPin, Mail, Phone, GitBranch, Send, ExternalLink, Briefcase, Layers, FolderKanban, Quote, ArrowRight } from "lucide-react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function BentoTemplate({
  profile,
  formatDate,
  skillGroups,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  
  const bentoCard = "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md";

  return (
    <>
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 -z-10 transition-colors"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 font-sans text-slate-800 dark:text-slate-200 animate-slide-up">
        
        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
          
          {/* PROFILE MAIN CARD (Spans 2 cols) */}
          <div className={`md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-center ${bentoCard} relative overflow-hidden group bg-gradient-to-br from-accent/50 to-accent/50 dark:from-accent/20 dark:to-accent/20`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl shrink-0">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-slate-100 dark:bg-slate-800 text-accent">
                    {profile.user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left flex-1 space-y-2">
                <div className="inline-block px-3 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-xs font-bold text-accent dark:text-accent mb-2 border border-slate-200/50 dark:border-slate-700/50">
                  {profile.contact_location || "Available for work"}
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  {profile.user?.name}
                </h1>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                  {profile.title}
                </p>
              </div>
            </div>
          </div>

          {/* BIO CARD */}
          <div className={`md:col-span-1 lg:col-span-2 row-span-1 ${bentoCard} flex flex-col justify-center`}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">À Propos</h2>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {profile.bio || "Aucune biographie fournie pour le moment."}
            </p>
          </div>

          {/* SOCIAL LINKS CARD */}
          <div className={`md:col-span-1 lg:col-span-1 row-span-1 ${bentoCard} flex flex-col items-center justify-center gap-4`}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest w-full text-center">Contact</h2>
            <div className="flex gap-4">
              {profile.contact_email && (
                <a href={`mailto:${profile.contact_email}`} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-accent/10 dark:hover:bg-accent/50 hover:text-accent transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {profile.social_github && (
                <a href={profile.social_github} target="_blank" rel="noreferrer" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-accent/10 dark:hover:bg-accent/50 hover:text-accent transition-colors">
                  <GitBranch className="w-5 h-5" />
                </a>
              )}
              {profile.social_linkedin && (
                <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-accent/10 dark:hover:bg-accent/50 hover:text-accent transition-colors">
                  <Send className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          {/* SKILLS CARD */}
          {profile.skills?.length > 0 && (
            <div className={`md:col-span-2 lg:col-span-1 row-span-2 ${bentoCard} flex flex-col overflow-hidden`}>
              <div className="flex items-center gap-2 mb-6">
                <Layers className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 custom-scrollbar">
                {profile.skills.map((skill: any) => (
                  <span key={skill.id} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS CARD (Spans multiple rows/cols) */}
          {profile.projects?.length > 0 && (
            <div className={`md:col-span-3 lg:col-span-3 row-span-2 ${bentoCard} flex flex-col`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projets Récents</h2>
                </div>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{profile.projects.length} projets</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {profile.projects.slice(0, 2).map((proj: any) => (
                  <div 
                    key={proj.id} 
                    onClick={() => handleProjectClick(proj.id)}
                    className="group cursor-pointer rounded-xl overflow-hidden relative border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {proj.image_url ? (
                      <>
                        <img src={proj.image_url} alt={proj.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/20 dark:from-accent/10 dark:to-accent/10"></div>
                    )}
                    
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[200px]">
                      <h3 className={`font-bold text-xl mb-1 ${proj.image_url ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{proj.title}</h3>
                      <p className={`text-sm line-clamp-2 ${proj.image_url ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE CARD */}
          {profile.experiences?.length > 0 && (
            <div className={`md:col-span-3 lg:col-span-2 row-span-2 ${bentoCard} flex flex-col`}>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Expérience</h2>
              </div>
              
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {profile.experiences.map((exp: any, idx: number) => (
                  <div key={exp.id} className="relative pl-6">
                    {/* Timeline line */}
                    {idx !== profile.experiences.length - 1 && (
                      <div className="absolute left-1.5 top-2 bottom-0 w-px bg-slate-200 dark:bg-slate-700 h-full"></div>
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-slate-900"></div>
                    
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{exp.title}</h3>
                    <p className="text-sm font-semibold text-accent mb-1">{exp.company}</p>
                    <p className="text-xs text-slate-500 font-mono mb-2">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Présent" : formatDate(exp.end_date)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDATIONS CARD */}
          {profile.recommendations?.length > 0 && (
            <div className={`md:col-span-2 lg:col-span-2 row-span-1 ${bentoCard} flex flex-col justify-center !bg-accent text-white border-transparent`}>
              <Quote className="w-8 h-8 text-white/30 mb-4" />
              <p className="text-lg sm:text-xl font-medium leading-relaxed mb-4">
                "{profile.recommendations[0].content}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{profile.recommendations[0].recommender_name}</p>
                  <p className="text-sm text-accent">{profile.recommendations[0].recommender_role}</p>
                </div>
                <button 
                  onClick={() => setShowRecModal(true)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                  title="Voir plus ou ajouter"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          
        </div>

      </div>
    </>
  );
}
