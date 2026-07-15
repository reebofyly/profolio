import React from "react";

interface TemplateProps {
  profile: any;
  formatDate: (dateStr: string | null | undefined) => string;
  skillGroups: Record<string, any[]>;
  handleProjectClick: (id: number) => void;
  setShowRecModal: (val: boolean) => void;
}

export default function MinimalistTemplate({
  profile,
  formatDate,
  handleProjectClick,
  setShowRecModal,
}: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-16 pb-10 space-y-24 text-left font-inter animate-slide-up">
      {/* Header Profile */}
      <div className="space-y-8 border-b border-black dark:border-white pb-16">
        <div className="relative w-32 h-32 overflow-hidden border border-black dark:border-white">
          {profile.photo_url ? (
            <img src={profile.photo_url} alt={profile.user?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium text-2xl bg-slate-50 dark:bg-slate-900">
              {profile.user?.name?.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-black dark:text-white leading-none uppercase">
            {profile.user?.name}
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 font-medium tracking-tight">
            {profile.title}
          </p>
          {profile.contact_location && (
            <p className="text-sm font-mono uppercase text-slate-500">{profile.contact_location}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-wider text-black dark:text-white pt-6 border-t border-black/10 dark:border-white/10">
          {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="hover:text-accent transition-colors">Email</a>}
          {profile.contact_phone && <a href={`tel:${profile.contact_phone}`} className="hover:text-accent transition-colors">Téléphone</a>}
          {profile.social_github && <a href={profile.social_github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">GitHub</a>}
          {profile.social_linkedin && <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>}
          {profile.social_website && <a href={profile.social_website} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Site Web</a>}
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="max-w-2xl text-xl sm:text-3xl leading-snug font-medium text-black dark:text-white border-l-4 border-black dark:border-white pl-6">
          <p>
            {profile.bio}
          </p>
        </div>
      )}

      {/* Projects Section */}
      {profile.projects?.length > 0 && (
        <section className="space-y-12 text-left">
          <h2 className="text-lg font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black dark:border-white pb-4">Projets Sélectionnés</h2>
          <div className="grid gap-12">
            {profile.projects.map((proj: any) => (
              <div key={proj.id} onClick={() => handleProjectClick(proj.id)} className="group cursor-pointer grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b border-black/10 dark:border-white/10 pb-12 hover:pl-4 transition-all">
                <div className="md:col-span-1">
                  <span className="text-xs font-mono uppercase text-slate-500 group-hover:text-black dark:group-hover:text-white transition-colors">{proj.tags ? proj.tags.split(',')[0] : 'Projet'}</span>
                </div>
                <div className="md:col-span-3 space-y-4">
                  <h3 className="font-black text-black dark:text-white text-3xl sm:text-4xl group-hover:underline underline-offset-8 transition-all">{proj.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">{proj.description}</p>
                {proj.tags && (
                  <div className="flex gap-2">
                    {proj.tags.split(",").slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-[9px] font-mono text-slate-400">{tag.trim().toLowerCase()}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {profile.experiences?.length > 0 && (
        <section className="space-y-12 text-left">
          <h2 className="text-lg font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black dark:border-white pb-4">Parcours</h2>
          <div className="space-y-12">
            {profile.experiences.map((exp: any) => (
              <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b border-black/10 dark:border-white/10 pb-12">
                <div className="md:col-span-1">
                  <span className="text-xs font-mono uppercase text-slate-500">{formatDate(exp.start_date)} — {exp.is_current ? "Présent" : formatDate(exp.end_date)}</span>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <h3 className="font-black text-black dark:text-white text-2xl">{exp.title}</h3>
                  <p className="font-bold text-slate-500 text-lg">{exp.company}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-2xl">{exp.description}</p>
              </div>
            </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {profile.skills?.length > 0 && (
        <section className="space-y-12 text-left">
          <h2 className="text-lg font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black dark:border-white pb-4">Domaines d'Expertise</h2>
          <div className="flex flex-wrap gap-4">
            {profile.skills.map((skill: any) => (
              <div key={skill.id} className="text-xl sm:text-3xl font-black text-black dark:text-white uppercase px-4 py-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default">
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {profile.recommendations?.length > 0 && (
        <section className="space-y-12 text-left">
          <h2 className="text-lg font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black dark:border-white pb-4">Témoignages</h2>
          <div className="space-y-16">
            {profile.recommendations.map((rec: any) => (
              <div key={rec.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b border-black/10 dark:border-white/10 pb-12">
                <div className="md:col-span-1">
                  <p className="text-xs font-mono uppercase text-slate-500 font-bold">
                    {rec.recommender_name}
                  </p>
                  <p className="text-xs font-mono uppercase text-slate-400">
                    {rec.recommender_role} @ {rec.recommender_company}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-black dark:text-white text-2xl sm:text-3xl font-medium leading-tight">
                    "{rec.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Button */}
      <div className="pt-16 pb-8 border-t border-black dark:border-white">
        <button 
          onClick={() => setShowRecModal(true)}
          className="w-full text-center py-6 border-2 border-black dark:border-white text-black dark:text-white text-2xl sm:text-3xl font-black uppercase tracking-tighter hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
        >
          Ajouter un témoignage
        </button>
      </div>
    </div>
  );
}
