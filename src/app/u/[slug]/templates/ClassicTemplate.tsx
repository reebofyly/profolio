import React from "react";
import Link from "next/link";
import { 
  MapPin, Mail, Phone, Globe, GitBranch, Send, ExternalLink, 
  Briefcase, GraduationCap, Layers, FolderKanban, BadgeCheck, 
  Quote, Award, Sparkles, MessageSquare 
} from "lucide-react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function ClassicTemplate({
  profile,
  formatDate,
  skillGroups,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  return (
    <>
      {/* Cover Photo */}
      <div className="relative h-44 sm:h-56 overflow-hidden w-full border-b border-slate-200/80 dark:border-slate-900">
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-accent via-accent to-accent opacity-90"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf7] dark:from-slate-950 to-transparent"></div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 mb-10 sm:-mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Sticky Info Card */}
          <div className="lg:col-span-1 lg:sticky lg:top-35 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm text-left transition-colors">
              
              {/* Photo */}
              <div className="relative -mt-16 sm:-mt-20 mb-4 inline-block">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#fafaf7] dark:border-slate-950 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {profile.photo_url ? (
                    <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent dark:text-accent font-bold text-3xl bg-gradient-to-br from-accent to-accent dark:from-slate-800 dark:to-slate-900">
                      {profile.user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-lg bg-accent border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="Disponible pour missions">
                  <BadgeCheck className="w-4 h-4" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-playfair mt-2">
                {profile.user?.name}
              </h1>
              
              <p className="text-accent dark:text-accent font-bold text-xs sm:text-sm mt-1 uppercase tracking-wider font-mono">
                {profile.title}
              </p>

              {profile.contact_location && (
                <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.contact_location}</span>
                </p>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                {profile.contact_email && (
                  <a href={`mailto:${profile.contact_email}`} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-accent/10 dark:hover:bg-accent/20 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent border border-slate-200 dark:border-slate-800/80 transition-colors" title="Envoyer un email">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {profile.contact_phone && (
                  <a href={`tel:${profile.contact_phone}`} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-accent/10 dark:hover:bg-accent/20 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent border border-slate-200 dark:border-slate-800/80 transition-colors" title="Téléphoner">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {profile.social_github && (
                  <a href={profile.social_github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-accent/10 dark:hover:bg-accent/20 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent border border-slate-200 dark:border-slate-800/80 transition-colors" title="GitHub">
                    <GitBranch className="w-4 h-4" />
                  </a>
                )}
                {profile.social_linkedin && (
                  <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-accent/10 dark:hover:bg-accent/20 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent border border-slate-200 dark:border-slate-800/80 transition-colors" title="LinkedIn">
                    <Send className="w-4 h-4" />
                  </a>
                )}
                {profile.social_website && (
                  <a href={profile.social_website} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-accent/10 dark:hover:bg-accent/20 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent border border-slate-200 dark:border-slate-800/80 transition-colors" title="Site Web Personnel">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="mt-5">
                <button 
                  onClick={() => setShowRecModal(true)}
                  className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-accent dark:text-accent" />
                  <span>Recommander ce profil</span>
                </button>
              </div>
            </div>

            {/* Bio description */}
            {profile.bio && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm text-left transition-colors relative overflow-hidden">
                <div className="absolute top-2 right-2 text-accent dark:text-slate-800 opacity-20">
                  <Quote className="w-12 h-12" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-mono">À propos</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-sans">{profile.bio}</p>
              </div>
            )}

            {/* Languages List */}
            {profile.languages?.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm text-left transition-colors">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 font-mono">Langues</h3>
                <div className="space-y-2">
                  {profile.languages.map((lang: any) => (
                    <div key={lang.id} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{lang.name}</span>
                      <span className="font-mono text-slate-400 text-[10px] uppercase font-bold tracking-wider">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Scrolling Work sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECTION: PROJECTS */}
            {profile.projects?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <FolderKanban className="w-5 h-5 text-accent dark:text-accent" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">Projets Récents</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.projects.map((proj: any) => (
                    <div 
                      key={proj.id} 
                      onClick={() => handleProjectClick(proj.id)}
                      className="border border-slate-200 dark:border-slate-800 hover:border-accent dark:hover:border-accent rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group cursor-pointer flex flex-col h-full"
                    >
                      {proj.image_url && (
                        <div className="h-40 overflow-hidden relative border-b border-slate-200 dark:border-slate-800">
                          <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-white/95 dark:bg-slate-900/95 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-[9px] font-bold uppercase tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                            Voir Détails
                          </div>
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 tracking-tight group-hover:text-accent dark:group-hover:text-accent transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3 font-sans">
                            {proj.description}
                          </p>
                        </div>
                        
                        <div>
                          {proj.tags && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {proj.tags.split(",").slice(0, 3).map((tag: string, i: number) => (
                                <span key={i} className="text-[9px] font-bold uppercase tracking-wider bg-accent/60 dark:bg-accent/20 text-accent dark:text-accent border border-accent/50 dark:border-accent/40 px-2 py-0.5 rounded-full font-mono">{tag.trim()}</span>
                              ))}
                              {proj.tags.split(",").length > 3 && (
                                <span className="text-[9px] font-bold text-slate-400 px-1 font-mono">+{proj.tags.split(",").length - 3}</span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                            {proj.demo_url && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-accent dark:text-accent">
                                <ExternalLink className="w-3 h-3" /> Démo
                              </span>
                            )}
                            {proj.github_url && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                <GitBranch className="w-3 h-3" /> Code
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION: EXPERIENCES */}
            {profile.experiences?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Briefcase className="w-5 h-5 text-accent dark:text-accent" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">Parcours professionnel</h2>
                </div>

                <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2">
                  {profile.experiences.map((exp: any) => (
                    <div key={exp.id} className="relative group">
                      
                      {/* Timeline Node */}
                      <div className="absolute -left-[24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-accent dark:border-accent bg-[#fafaf7] dark:bg-slate-950 group-hover:scale-125 transition-transform"></div>
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">{exp.title}</h3>
                          {exp.is_current && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent border border-accent dark:border-accent/50 px-2 py-0.5 rounded-md font-mono">Actuel</span>
                          )}
                        </div>
                        
                        <p className="text-accent dark:text-accent font-bold text-xs sm:text-sm mt-0.5">{exp.company}</p>
                        
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                          {exp.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{exp.location}</span>}
                          <span>·</span>
                          <span>{formatDate(exp.start_date)} — {exp.is_current ? "Présent" : formatDate(exp.end_date)}</span>
                        </div>
                        
                        {exp.description && (
                          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed font-sans">
                            {exp.description}
                          </p>
                        )}

                        {exp.skills_used && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {exp.skills_used.split(",").map((s: string, i: number) => (
                              <span key={i} className="text-[9px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded font-mono">{s.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION: SKILLS */}
            {profile.skills?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Layers className="w-5 h-5 text-accent dark:text-accent" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">Compétences techniques</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.keys(skillGroups).map((cat) => (
                    <div key={cat} className="space-y-3.5">
                      <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-slate-800 pb-1">
                        {cat}
                      </h3>
                      <div className="space-y-3">
                        {skillGroups[cat].map((skill: any) => (
                          <div key={skill.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-700 dark:text-slate-300">{skill.name}</span>
                              <span className="text-slate-400 font-mono text-[10px]">{skill.level}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent dark:bg-accent rounded-full transition-all duration-1000"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION: CERTIFICATIONS */}
            {profile.certifications?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Award className="w-5 h-5 text-accent dark:text-accent" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">Certifications</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.certifications.map((cert: any) => (
                    <div key={cert.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all flex items-start justify-between gap-3 group">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm tracking-tight truncate" title={cert.name}>{cert.name}</h3>
                        <p className="text-accent dark:text-accent font-bold text-[10px] mt-0.5">{cert.issuer}</p>
                        <p className="text-slate-400 text-[10px] font-mono mt-1">Obtenue en {formatDate(cert.issue_date)}</p>
                      </div>
                      {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" rel="noreferrer" className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-accent transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION: EDUCATION */}
            {profile.educations?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm text-left transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <GraduationCap className="w-5 h-5 text-accent dark:text-accent" />
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">Formation & Diplômes</h2>
                </div>

                <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2">
                  {profile.educations.map((edu: any) => (
                    <div key={edu.id} className="relative group">
                      <div className="absolute -left-[24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-accent dark:border-accent bg-[#fafaf7] dark:bg-slate-950 group-hover:scale-125 transition-transform"></div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">{edu.degree}</h3>
                        <p className="text-accent dark:text-accent font-bold text-xs sm:text-sm mt-0.5">{edu.institution}</p>
                        
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                          {edu.field_of_study && <span>{edu.field_of_study}</span>}
                          <span>·</span>
                          <span>{formatDate(edu.start_date)} — {edu.is_current ? "Présent" : formatDate(edu.end_date)}</span>
                        </div>

                        {edu.description && (
                          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed font-sans">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION: RECOMMENDATIONS */}
            {profile.recommendations?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Quote className="w-5 h-5 text-accent dark:text-accent" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-playfair">Recommandations</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.recommendations.map((rec: any) => (
                    <div key={rec.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between h-full relative">
                      <Quote className="w-6 h-6 text-accent dark:text-slate-800 mb-2 shrink-0" />
                      <p className="text-slate-600 dark:text-slate-300 text-xs italic leading-relaxed mb-4 font-sans flex-1">
                        "{rec.content}"
                      </p>
                      <div className="flex items-center gap-3 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-accent/10 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                          {rec.recommender_avatar ? (
                            <img src={rec.recommender_avatar} alt={rec.recommender_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-accent dark:text-accent font-black text-sm">
                              {rec.recommender_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate flex items-center gap-1.5">
                            <span>{rec.recommender_name}</span>
                            {rec.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">{rec.recommender_role} · {rec.recommender_company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CONTACT SECTION */}
            <section className="bg-gradient-to-br from-accent via-accent to-accent dark:from-accent dark:via-accent dark:to-accent rounded-3xl p-8 text-white text-left shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 blur-xl"></div>
              <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-accent/10 blur-xl"></div>
              
              <h3 className="text-lg font-black tracking-tight mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--lime)]" />
                Travaillons ensemble !
              </h3>
              <p className="text-white text-xs sm:text-sm mb-6 leading-relaxed">
                Vous êtes intéressé(e) par mon profil pour une opportunité, une mission freelance ou une collaboration ? Prenez contact directement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {profile.contact_email && (
                  <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 transition-all rounded-2xl px-4 py-3 border border-white/10 text-white">
                    <Mail className="w-4 h-4 shrink-0 text-[var(--lime)]" />
                    <span className="text-xs font-bold truncate">{profile.contact_email}</span>
                  </a>
                )}
                {profile.contact_phone && (
                  <a href={`tel:${profile.contact_phone}`} className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 transition-all rounded-2xl px-4 py-3 border border-white/10 text-white">
                    <Phone className="w-4 h-4 shrink-0 text-[var(--lime)]" />
                    <span className="text-xs font-bold truncate">{profile.contact_phone}</span>
                  </a>
                )}
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
}
