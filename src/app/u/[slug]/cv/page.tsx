"use client";

import React, { useState, useEffect, use } from "react";

const API_BASE = "http://localhost:8000/api";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

export default function CVPrint({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/profiles/${slug}`)
      .then((r) => r.json())
      .then((data) => { setProfile(data); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-slate-400 text-sm">Préparation du CV...</p>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-red-500">Profil introuvable</p>
    </div>
  );

  const accent = profile.accent_color || "#6366f1";

  return (
    <>
      {/* ---- PRINT TOOLBAR (hidden on print) ---- */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: accent }}>P</div>
          <div>
            <p className="font-bold text-sm">Aperçu PDF — {profile.user?.name}</p>
            <p className="text-slate-400 text-xs">Optimisé pour impression A4 sans coupure d'éléments</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          ↓ Télécharger PDF
        </button>
      </div>

      {/* ---- CV CONTENT ---- */}
      <div className="bg-slate-100 print:bg-white min-h-screen pt-16 print:pt-0 pb-16 print:pb-0">
        <div className="max-w-[794px] mx-auto print:mx-0 bg-white shadow-xl print:shadow-none">

          {/* === HEADER === */}
          <header
            className="px-10 pt-10 pb-8 border-b-4"
            style={{ borderColor: accent }}
          >
            <div className="flex items-start gap-6">
              {profile.photo_url && (
                <img
                  src={profile.photo_url}
                  alt={profile.user?.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {profile.user?.name}
                </h1>
                <p className="font-bold text-lg mt-1" style={{ color: accent }}>{profile.title}</p>

                {/* Contact grid */}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {profile.contact_location && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>📍</span> {profile.contact_location}
                    </span>
                  )}
                  {profile.contact_email && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>✉</span> {profile.contact_email}
                    </span>
                  )}
                  {profile.contact_phone && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>📞</span> {profile.contact_phone}
                    </span>
                  )}
                  {profile.social_linkedin && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>🔗</span> {profile.social_linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  )}
                  {profile.social_github && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>⚙</span> {profile.social_github.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  )}
                  {profile.social_website && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>🌐</span> {profile.social_website.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                {profile.bio}
              </p>
            )}
          </header>

          {/* === BODY: 2 columns === */}
          <div className="flex px-0">

            {/* LEFT COLUMN — wider */}
            <div className="flex-1 px-10 py-8 space-y-8 border-r border-slate-100">

              {/* Experiences */}
              {profile.experiences?.length > 0 && (
                <section style={{ breakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-4 pb-1.5 border-b" style={{ color: accent, borderColor: accent + "33" }}>
                    Expériences professionnelles
                  </h2>
                  <div className="space-y-5">
                    {profile.experiences.map((exp: any) => (
                      <div key={exp.id} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{exp.title}</h3>
                            <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>
                              {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5 font-mono">
                            {formatDate(exp.start_date)} — {exp.is_current ? "Présent" : formatDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{exp.description}</p>
                        )}
                        {exp.skills_used && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.skills_used.split(",").map((s: string) => (
                              <span key={s} className="text-[9px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: accent, borderColor: accent + "40", backgroundColor: accent + "08" }}>
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {profile.projects?.length > 0 && (
                <section style={{ breakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-4 pb-1.5 border-b" style={{ color: accent, borderColor: accent + "33" }}>
                    Projets
                  </h2>
                  <div className="space-y-3">
                    {profile.projects.map((proj: any) => (
                      <div key={proj.id} style={{ breakInside: "avoid", pageBreakInside: "avoid", borderColor: accent + "40" }} className="pl-3 border-l-2">
                        <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                        {proj.tags && (
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: accent }}>
                            {proj.tags}
                          </p>
                        )}
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{proj.description}</p>
                        {(proj.demo_url || proj.github_url) && (
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {proj.demo_url || proj.github_url}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {profile.educations?.length > 0 && (
                <section style={{ breakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-4 pb-1.5 border-b" style={{ color: accent, borderColor: accent + "33" }}>
                    Formation
                  </h2>
                  <div className="space-y-4">
                    {profile.educations.map((edu: any) => (
                      <div key={edu.id} style={{ breakInside: "avoid", pageBreakInside: "avoid" }} className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                          <p className="text-xs font-semibold" style={{ color: accent }}>{edu.institution}</p>
                          {edu.field_of_study && <p className="text-xs text-slate-400">{edu.field_of_study}</p>}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 font-mono">
                          {formatDate(edu.start_date)} — {edu.is_current ? "Présent" : formatDate(edu.end_date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              {profile.recommendations?.filter((r: any) => r.is_visible).length > 0 && (
                <section style={{ breakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-4 pb-1.5 border-b" style={{ color: accent, borderColor: accent + "33" }}>
                    Recommandations
                  </h2>
                  <div className="space-y-4">
                    {profile.recommendations.filter((r: any) => r.is_visible).map((rec: any) => (
                      <div key={rec.id} style={{ breakInside: "avoid", pageBreakInside: "avoid", borderColor: accent + "40" }} className="pl-3 border-l-2 italic">
                        <p className="text-xs text-slate-600 leading-relaxed">"{rec.content}"</p>
                        <p className="mt-1.5 text-[10px] font-bold text-slate-800 not-italic">{rec.recommender_name}</p>
                        <p className="text-[10px] text-slate-400 not-italic">{rec.recommender_role} · {rec.recommender_company}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT COLUMN — narrower */}
            <div className="w-56 px-6 py-8 space-y-7 bg-slate-50 print:bg-slate-50">

              {/* Skills */}
              {profile.skills?.length > 0 && (
                <section style={{ breakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: accent }}>
                    Compétences
                  </h2>

                  {/* Group by category */}
                  {Object.entries(
                    profile.skills.reduce((acc: any, s: any) => {
                      acc[s.category] = acc[s.category] || [];
                      acc[s.category].push(s);
                      return acc;
                    }, {})
                  ).map(([cat, skills]: any) => (
                    <div key={cat} className="mb-3" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">{cat}</p>
                      <div className="space-y-1.5">
                        {skills.map((skill: any) => (
                          <div key={skill.id}>
                            <div className="flex justify-between mb-0.5">
                              <span className="text-[10px] font-semibold text-slate-700">{skill.name}</span>
                              <span className="text-[9px] text-slate-400">{skill.level}%</span>
                            </div>
                            <div className="h-1 bg-slate-200 rounded-full">
                              <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: accent }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Languages */}
              {profile.languages?.length > 0 && (
                <section style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: accent }}>
                    Langues
                  </h2>
                  <div className="space-y-1.5">
                    {profile.languages.map((lang: any) => (
                      <div key={lang.id} className="flex justify-between text-[10px]">
                        <span className="font-semibold text-slate-700">{lang.name}</span>
                        <span className="text-slate-400">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {profile.certifications?.length > 0 && (
                <section style={{ breakInside: "avoid" }}>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: accent }}>
                    Certifications
                  </h2>
                  <div className="space-y-2.5">
                    {profile.certifications.map((cert: any) => (
                      <div key={cert.id} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <p className="font-bold text-slate-900 text-[10px] leading-snug">{cert.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{cert.issuer}</p>
                        <p className="text-[9px] text-slate-400">{formatDate(cert.issue_date)}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <footer className="px-10 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] text-slate-300 font-mono">profolio.app/u/{slug}</span>
            <span className="text-[9px] text-slate-300">{new Date().toLocaleDateString("fr-FR")}</span>
          </footer>
        </div>
      </div>

      {/* ---- PRINT CSS — perfect page break control ---- */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          /* Hide toolbar */
          .print\\:hidden { display: none !important; }

          /* Reset body for print */
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Page wrapper */
          .min-h-screen { min-height: unset !important; }

          /* Never break inside these elements */
          section,
          [style*="breakInside"],
          header {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Allow breaks between sections */
          section + section {
            break-before: auto;
          }

          /* Ensure backgrounds print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Remove shadow on print */
          .shadow-xl {
            box-shadow: none !important;
          }

          /* Ensure bg-slate-50 prints */
          .bg-slate-50 {
            background-color: #f8fafc !important;
          }
        }
      `}</style>
    </>
  );
}
