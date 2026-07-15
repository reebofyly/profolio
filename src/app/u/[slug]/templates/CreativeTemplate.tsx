import React from "react";
import { Briefcase, MessageSquare, Quote, BadgeCheck } from "lucide-react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function CreativeTemplate({
  profile,
  formatDate,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  return (
    <>
      <div className="fixed inset-0 gradient-mesh -z-10"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 pt-10 font-outfit text-left space-y-12 animate-slide-up">
        {/* Asymmetric Profile Header Block */}
        <div className="relative backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] flex flex-col md:flex-row gap-6 items-center">
        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-tr from-accent via-accent to-accent p-1 shrink-0">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent dark:text-accent font-black text-4xl">
                {profile.user?.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-accent via-accent to-accent bg-clip-text text-transparent leading-none">
            {profile.user?.name}
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-base font-black tracking-wide uppercase">
            ✨ {profile.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{profile.contact_location}</p>
          
          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/20 dark:bg-black/10 p-3.5 rounded-xl border border-white/10">
              "{profile.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Asymmetric 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Block: Skills & Certifications */}
        <div className="lg:col-span-1 space-y-6">
          {profile.skills?.length > 0 && (
            <div className="backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent font-mono">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: any) => (
                  <span 
                    key={skill.id} 
                    className="text-xs font-bold bg-white/60 dark:bg-slate-800/60 border border-white/45 dark:border-slate-800/40 px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 shadow-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Block: Projects & Experiences */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Projects list */}
          {profile.projects?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-6 bg-gradient-to-b from-accent to-accent rounded-full"></span>
                Projets Créatifs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.projects.map((proj: any) => (
                  <div 
                    key={proj.id} 
                    onClick={() => handleProjectClick(proj.id)}
                    className="backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl overflow-hidden hover:-translate-y-2 cursor-pointer shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.15)] transition-all flex flex-col h-full group"
                  >
                    {proj.image_url && (
                      <div className="h-40 overflow-hidden relative border-b border-white/10">
                        <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-2 group-hover:text-accent transition-colors">{proj.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">{proj.description}</p>
                      </div>
                      {proj.tags && (
                        <div className="flex flex-wrap gap-1">
                          {proj.tags.split(",").slice(0, 2).map((t: string, i: number) => (
                            <span key={i} className="text-[9px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-mono">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experiences list */}
          {profile.experiences?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-6 bg-gradient-to-b from-accent to-accent rounded-full"></span>
                Parcours
              </h2>
              <div className="space-y-4">
                {profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl p-6 flex gap-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold font-mono text-accent dark:text-accent uppercase tracking-widest">{formatDate(exp.start_date)} — {exp.is_current ? "Présent" : formatDate(exp.end_date)}</span>
                      <h4 className="text-slate-950 dark:text-white text-sm font-bold">{exp.title} · <span className="text-slate-500 dark:text-slate-400 font-normal">{exp.company}</span></h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations list */}
          {profile.recommendations?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-6 bg-gradient-to-b from-accent to-accent rounded-full"></span>
                Recommandations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.recommendations.map((rec: any) => (
                  <div key={rec.id} className="backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] relative group hover:-translate-y-1 transition-transform">
                    <Quote className="w-8 h-8 text-accent/10 absolute top-4 right-4" />
                    <p className="text-slate-600 dark:text-slate-300 text-xs italic leading-relaxed mb-6">
                      "{rec.content}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        {rec.recommender_avatar ? (
                          <img src={rec.recommender_avatar} alt={rec.recommender_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-accent font-extrabold text-sm">{rec.recommender_name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs truncate flex items-center gap-1">
                          <span>{rec.recommender_name}</span>
                          {rec.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{rec.recommender_role} · {rec.recommender_company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Creative Footer button */}
      <div className="pt-6 flex justify-center">
        <button 
          onClick={() => setShowRecModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent hover:from-accent hover:to-accent text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Recommander ce profil</span>
        </button>
      </div>
      </div>
    </>
  );
}
