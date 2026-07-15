import React from "react";
import { MapPin, Mail, Phone, GitBranch, Send, ExternalLink, Briefcase, GraduationCap, Layers, FolderKanban, Quote, ArrowRight, CheckCircle2 } from "lucide-react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function SaaSTemplate({
  profile,
  formatDate,
  skillGroups,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  
  const cardClass = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300";

  return (
    <>
      <div className="fixed inset-0 bg-[#fafafa] dark:bg-[#0a0a10] -z-10"></div>
      
      {/* Background glowing orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent/10 dark:bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 dark:bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 font-inter text-slate-800 dark:text-slate-200 animate-fade-in">
        
        {/* HERO SECTION */}
        <header className="text-center space-y-6 mb-20 relative">
          <div className="inline-block relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 relative z-10 shadow-lg">
              {profile.photo_url ? (
                <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black bg-gradient-to-br from-accent to-accent text-white">
                  {profile.user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-20 -z-0"></div>
          </div>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            {profile.contact_location && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/30 text-accent dark:text-accent text-xs font-semibold border border-accent dark:border-accent/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Based in {profile.contact_location}
              </div>
            )}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {profile.user?.name}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400">
              {profile.title}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {profile.contact_email && (
              <a href={`mailto:${profile.contact_email}`} className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                <Mail className="w-4 h-4" /> Get in touch
              </a>
            )}
            {profile.social_linkedin && (
              <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {profile.social_github && (
              <a href={profile.social_github} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> GitHub
              </a>
            )}
          </div>
        </header>

        {/* BIO */}
        {profile.bio && (
          <section className="mb-20 max-w-2xl mx-auto text-center">
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {profile.bio}
            </p>
          </section>
        )}

        {/* PROJECTS */}
        {profile.projects?.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/30 flex items-center justify-center text-accent dark:text-accent">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Features & Projects</h2>
            </div>
            
            <div className="space-y-6">
              {profile.projects.map((proj: any) => (
                <div 
                  key={proj.id} 
                  onClick={() => handleProjectClick(proj.id)}
                  className={`${cardClass} cursor-pointer group flex flex-col md:flex-row gap-6 items-center`}
                >
                  {proj.image_url && (
                    <div className="w-full md:w-48 h-48 md:h-32 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                    {proj.tags && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {proj.tags.split(",").slice(0, 4).map((tag: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          
          {/* EXPERIENCE */}
          {profile.experiences?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/30 flex items-center justify-center text-accent dark:text-accent">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Experience</h2>
              </div>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:ml-[0.5rem] md:before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                {profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="relative pl-8 md:pl-10">
                    <div className="absolute left-0 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-accent mt-1"></div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{exp.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-accent dark:text-accent">{exp.company}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span className="text-xs text-slate-500 font-mono">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS */}
          {profile.skills?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/30 flex items-center justify-center text-accent dark:text-accent">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Core Competencies</h2>
              </div>
              
              <div className={`${cardClass}`}>
                <div className="space-y-5">
                  {profile.skills.map((skill: any) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{skill.name}</span>
                        <span className="text-xs font-mono text-slate-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>

        {/* TESTIMONIALS */}
        {profile.recommendations?.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center mb-10">Trusted by great people</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profile.recommendations.map((rec: any) => (
                <div key={rec.id} className={`${cardClass} relative`}>
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-100 dark:text-slate-800" />
                  <div className="relative z-10">
                    <p className="text-slate-600 dark:text-slate-400 mb-6 italic">"{rec.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                        {rec.recommender_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{rec.recommender_name}</p>
                        <p className="text-xs text-slate-500">{rec.recommender_role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setShowRecModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Endorse {profile.user?.name}
          </button>
        </div>

      </div>
    </>
  );
}
