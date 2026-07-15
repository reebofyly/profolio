import React from "react";
import { MapPin, Mail, Phone, GitBranch, Send, ExternalLink, Briefcase, GraduationCap, Layers, FolderKanban, Quote, Award } from "lucide-react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function LuxuryTemplate({
  profile,
  formatDate,
  skillGroups,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  
  const goldText = "text-accent dark:text-accent";
  const goldBorder = "border-accent/30 dark:border-accent/30";
  const bgCard = "bg-[#141414] border border-[#2a2a2a]";

  return (
    <>
      <div className="fixed inset-0 bg-[#0a0a0a] -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-10 font-inter text-slate-300 animate-slide-up">
        
        {/* HEADER */}
        <header className="flex flex-col items-center text-center space-y-8 mb-24">
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border border-[#333] p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#111]">
              {profile.photo_url ? (
                <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-playfair text-accent">
                  {profile.user?.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-playfair tracking-wider text-white uppercase font-light">
              {profile.user?.name}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-[#333]"></div>
              <p className={`text-sm sm:text-base tracking-[0.2em] uppercase font-light ${goldText}`}>
                {profile.title}
              </p>
              <div className="w-12 h-px bg-[#333]"></div>
            </div>
            
            {profile.contact_location && (
              <p className="text-xs tracking-widest text-[#888] uppercase mt-4">
                {profile.contact_location}
              </p>
            )}
          </div>
          
          <div className="flex gap-6 pt-4">
            {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="text-[#888] hover:text-accent transition-colors uppercase text-[10px] tracking-widest">Email</a>}
            {profile.contact_phone && <a href={`tel:${profile.contact_phone}`} className="text-[#888] hover:text-accent transition-colors uppercase text-[10px] tracking-widest">Phone</a>}
            {profile.social_linkedin && <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className="text-[#888] hover:text-accent transition-colors uppercase text-[10px] tracking-widest">LinkedIn</a>}
          </div>
        </header>

        {/* BIO */}
        {profile.bio && (
          <section className="mb-24 text-center max-w-3xl mx-auto">
            <Quote className={`w-8 h-8 mx-auto mb-6 opacity-40 ${goldText}`} />
            <p className="text-xl sm:text-3xl font-playfair italic font-light leading-relaxed text-[#ccc]">
              "{profile.bio}"
            </p>
          </section>
        )}

        {/* PROJECTS (Masonry-ish or Grid) */}
        {profile.projects?.length > 0 && (
          <section className="mb-24">
            <h2 className="text-2xl sm:text-3xl font-playfair text-center text-white mb-16 uppercase tracking-widest">
              Selected Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {profile.projects.map((proj: any, idx: number) => (
                <div 
                  key={proj.id} 
                  onClick={() => handleProjectClick(proj.id)}
                  className={`group cursor-pointer ${idx % 2 === 1 ? 'md:mt-16' : ''}`}
                >
                  <div className="relative overflow-hidden mb-6 bg-[#111] aspect-[4/3]">
                    {proj.image_url ? (
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <FolderKanban className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 border border-white/0 group-hover:border-accent/50 m-4 transition-colors duration-700"></div>
                  </div>
                  
                  <div className="text-center px-4">
                    <h3 className="text-xl font-playfair text-white mb-2 tracking-wide">{proj.title}</h3>
                    <div className={`w-8 h-px mx-auto mb-4 bg-accent/50 transition-all duration-500 group-hover:w-16`}></div>
                    <p className="text-[#888] text-sm font-light leading-relaxed line-clamp-2">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE & SKILLS (Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          
          {/* Experience */}
          {profile.experiences?.length > 0 && (
            <section>
              <h2 className="text-xl font-playfair text-white mb-10 uppercase tracking-widest flex items-center gap-4">
                <span className={`w-8 h-px bg-accent`}></span>
                Experience
              </h2>
              <div className="space-y-10">
                {profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="relative pl-6 border-l border-[#333]">
                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 -translate-x-[3px] rounded-full bg-accent"></div>
                    <h3 className="text-lg text-white font-playfair mb-1">{exp.title}</h3>
                    <p className={`text-xs uppercase tracking-widest mb-3 ${goldText}`}>{exp.company}</p>
                    <p className="text-[10px] text-[#666] tracking-widest font-mono mb-3">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-[#999] font-light leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <section>
              <h2 className="text-xl font-playfair text-white mb-10 uppercase tracking-widest flex items-center gap-4">
                <span className={`w-8 h-px bg-accent`}></span>
                Expertise
              </h2>
              <div className="space-y-6">
                {profile.skills.map((skill: any) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs tracking-widest uppercase text-[#ccc] mb-2">
                      <span>{skill.name}</span>
                      <span className={goldText}>{skill.level}%</span>
                    </div>
                    <div className="h-px w-full bg-[#333]">
                      <div className="h-full bg-accent" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        {profile.recommendations?.length > 0 && (
          <section className="mb-24 py-16 border-y border-[#222]">
            <h2 className="text-xl font-playfair text-center text-white mb-12 uppercase tracking-widest">
              Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {profile.recommendations.map((rec: any) => (
                <div key={rec.id} className="p-8 bg-[#111] border border-[#222] text-center">
                  <p className="text-[#aaa] font-light italic leading-relaxed mb-6">"{rec.content}"</p>
                  <p className="text-white font-playfair tracking-wider mb-1">{rec.recommender_name}</p>
                  <p className={`text-[10px] uppercase tracking-widest ${goldText}`}>{rec.recommender_role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center pb-16">
          <button 
            onClick={() => setShowRecModal(true)}
            className="px-8 py-4 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-500 text-xs uppercase tracking-[0.2em]"
          >
            Leave a Recommendation
          </button>
        </div>

      </div>
    </>
  );
}
