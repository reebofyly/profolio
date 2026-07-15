import React from "react";
import { FolderKanban, Briefcase, Layers, Quote } from "lucide-react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function DeveloperTemplate({
  profile,
  formatDate,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  return (
    <>
      <div className="fixed inset-0 bg-slate-950 dot-pattern -z-10"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 font-mono text-left space-y-8 text-slate-400 animate-slide-up">
        
        {/* Terminal Header */}
        <div className="border mt-10 border-slate-800 rounded-xl bg-slate-950/90 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        {/* Window bar */}
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">bash - profile.json</span>
          <span></span>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm leading-relaxed">
          <div className="">
            <span className="text-accent">user@profolio:~$</span> <span className="text-white">whoami</span>
            <div className="relative w-40 h-40 my-4 rounded-2xl overflow-hidden bg-gradient-to-tr from-accent via-accent to-accent p-1 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent dark:text-accent font-black text-7xl">
                    {profile.user?.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <p className="text-cyan-400 font-bold text-sm sm:text-3xl mt-1">{profile.user?.name}</p>
          </div>

          <div>
            <span className="text-accent">user@profolio:~$</span> <span className="text-white">cat info.json</span>
            <pre className="text-accent dark:text-accent mt-2 bg-black/40 p-4 rounded-xl overflow-x-auto text-[11px] sm:text-xs">
{`{
  "title": "${profile.title}",
  "location": "${profile.contact_location || "Remote"}",
  "status": "Available for contracts/hire",
  "socials": {
    "github": "${profile.social_github || ""}",
    "linkedin": "${profile.social_linkedin || ""}",
    "website": "${profile.social_website || ""}"
  }
}`}
            </pre>
          </div>

          {profile.bio && (
            <div>
              <span className="text-accent">user@profolio:~$</span> <span className="text-white">cat bio.txt</span>
              <p className="text-slate-400 mt-1 pl-4 border-l-2 border-slate-700 italic">
                "{profile.bio}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Projects Terminal block */}
        {profile.projects?.length > 0 && (
          <div className="border border-slate-800 rounded-xl bg-slate-950/90 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-shadow">
            <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
              <span className="text-xs font-bold text-accent flex items-center gap-1.5"><FolderKanban className="w-4 h-4" /> projects/</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Files: {profile.projects.length}</span>
            </div>
            <div className="p-4 space-y-4">
              {profile.projects.map((proj: any) => (
                <div 
                  key={proj.id} 
                  onClick={() => handleProjectClick(proj.id)}
                  className="p-3 border border-slate-800 bg-black/35 hover:bg-slate-900/50 hover:border-accent/40 rounded-lg cursor-pointer transition-colors"
                >
                  <h4 className="text-white text-xs font-bold flex items-center gap-1.5 hover:text-accent">
                    <span className="text-accent">▶</span> {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{proj.description}</p>
                  {proj.tags && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {proj.tags.split(",").slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Terminal block */}
        {profile.experiences?.length > 0 && (
          <div className="border border-slate-800 rounded-xl bg-slate-950/90 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-shadow">
            <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
              <span className="text-xs font-bold text-accent flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> experiences/</span>
            </div>
            <div className="p-4 space-y-4">
              {profile.experiences.map((exp: any) => (
                <div key={exp.id} className="p-3 border border-slate-900 bg-black/20 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-550 font-bold block">{formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                  <h4 className="text-white text-xs font-bold">{exp.title} @ <span className="text-cyan-400">{exp.company}</span></h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills block */}
        {profile.skills?.length > 0 && (
          <div className="lg:col-span-2 border border-slate-800 rounded-xl bg-slate-950/90 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
              <span className="text-xs font-bold text-accent flex items-center gap-1.5"><Layers className="w-4 h-4" /> skills/</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.skills.map((skill: any) => (
                <div key={skill.id} className="p-2 border border-slate-900 bg-black/10 rounded-lg flex items-center justify-between gap-2">
                  <span className="text-xs text-white font-bold truncate">{skill.name}</span>
                  <span className="text-[9px] text-accent font-mono">[{skill.level}%]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations block */}
        {profile.recommendations?.length > 0 && (
          <div className="lg:col-span-2 border border-slate-800 rounded-xl bg-slate-950/90 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
              <span className="text-xs font-bold text-accent flex items-center gap-1.5"><Quote className="w-4 h-4" /> recommendations/</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Total: {profile.recommendations.length}</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.recommendations.map((rec: any) => (
                <div key={rec.id} className="p-4 border border-slate-900 bg-black/20 rounded-lg space-y-3">
                  <p className="text-slate-400 text-xs italic leading-relaxed">
                    "{rec.content}"
                  </p>
                  <div className="text-[10px] text-slate-500 font-bold border-t border-slate-900/50 pt-2 flex items-center gap-1.5">
                    <span>Ref: {rec.recommender_name} ({rec.recommender_role} @ {rec.recommender_company})</span>
                    {rec.is_verified && <span className="text-accent font-mono text-[9px]">[VERIFIED]</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Developer Footer button */}
      <div className="pt-4 flex justify-center">
        <button 
          onClick={() => setShowRecModal(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent text-slate-950 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-lg cursor-pointer"
        >
          <span>$ write_recommendation</span>
        </button>
      </div>
      </div>
    </>
  );
}
