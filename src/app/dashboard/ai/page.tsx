"use client";

import React, { useState } from "react";
import { Sparkles, Copy, RefreshCw, Loader2, FileText, PenTool, Wand2, CheckCircle2 } from "lucide-react";

type Mode = "bio" | "cover_letter" | "summary";

const modes: { id: Mode; label: string; icon: any; description: string; placeholder: string }[] = [
  {
    id: "bio",
    label: "Réécrire la bio",
    icon: PenTool,
    description: "Entrez votre bio existante et obtenez une version améliorée, professionnelle et percutante.",
    placeholder: "Collez ici votre bio actuelle ou décrivez votre profil en quelques mots...\n\nEx: Je suis développeur web avec 5 ans d'expérience en React et Node.js. J'aime créer des applications performantes...",
  },
  {
    id: "cover_letter",
    label: "Lettre de motivation",
    icon: FileText,
    description: "Décrivez le poste visé et votre profil. L'IA génèrera une lettre de motivation personnalisée.",
    placeholder: "Décrivez le poste et l'entreprise :\n\nPoste : Développeur Full Stack Senior\nEntreprise : TechCorp\nVos forces : 5 ans d'expérience React/Laravel, passion pour le code propre, leadership d'équipe...",
  },
  {
    id: "summary",
    label: "Résumé exécutif",
    icon: Wand2,
    description: "Obtenez un résumé exécutif concis à partir de vos expériences pour votre profil ou CV.",
    placeholder: "Listez vos expériences ou compétences clés :\n\n- 5 ans en développement web (React, Vue, Laravel)\n- 2 ans de gestion d'équipe (5 personnes)\n- Expert en performance et architecture micro-services...",
  },
];

const BIO_TEMPLATES: Record<Mode, (input: string) => string> = {
  bio: (input) =>
    `Professionnel passionné avec une expertise confirmée dans ${input.length > 100 ? "mon domaine" : input.split(" ").slice(0, 5).join(" ")}, je combine créativité technique et vision stratégique pour délivrer des résultats mesurables. Mon approche centrée sur l'impact et l'innovation me permet d'apporter une valeur ajoutée unique à chaque projet et équipe.

Polyvalent et rigoureux, j'excelle à transformer des défis complexes en solutions élégantes, en collaborant étroitement avec les équipes produit, design et métier pour garantir une expérience utilisateur optimale.`,

  cover_letter: (input) =>
    `Madame, Monsieur,

Enthousiaste à l'idée de rejoindre votre équipe, je vous soumets ma candidature en réponse à votre offre. Fort(e) d'une expérience solide et d'une passion authentique pour l'innovation, je suis convaincu(e) de pouvoir contribuer significativement à vos projets.

Mon parcours m'a permis de développer une expertise technique approfondie, couplée à de réelles capacités d'adaptation et de collaboration. Les défis que vous relevez au quotidien correspondent précisément aux types de problématiques que j'affectionne résoudre avec rigueur et créativité.

Particulièrement attiré(e) par la culture d'innovation et d'excellence qui caractérise votre organisation, je serais ravi(e) de pouvoir vous présenter ma candidature lors d'un entretien.

Dans l'attente de votre retour, je vous adresse mes salutations distinguées.`,

  summary: (input) =>
    `Professionnel expérimenté avec une expertise multidimensionnelle couvrant le développement, la gestion de projet et l'innovation. Reconnu pour ma capacité à orchestrer des projets complexes de bout en bout tout en maintenant des standards de qualité élevés.

Mon expérience transversale me permet d'avoir une vision holistique des enjeux technologiques et business, faisant de moi un interlocuteur privilegié entre les équipes techniques et les parties prenantes métier.

🎯 Points forts clés : expertise technique, leadership naturel, orientation résultats, veille technologique active.`,
};

export default function AIPage() {
  const [mode, setMode] = useState<Mode>("bio");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentMode = modes.find(m => m.id === mode)!;

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    // Simulate progressive typing effect
    await new Promise(r => setTimeout(r, 800));
    const result = BIO_TEMPLATES[mode](input);
    let current = "";
    const chars = result.split("");
    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      setOutput(current);
      await new Promise(r => setTimeout(r, 12 + Math.random() * 8));
      if (i % 20 === 0) await new Promise(r => setTimeout(r, 5));
    }

    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Assistant IA</h1>
            <p className="text-slate-500 text-sm">Propulsé par l'intelligence artificielle Profolio</p>
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {modes.map((m) => (
          <button key={m.id} onClick={() => { setMode(m.id); setInput(""); setOutput(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m.id
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
              : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-700"}`}>
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 mb-6 text-sm text-slate-600">
        <p className="font-medium text-violet-800 mb-1">💡 {currentMode.label}</p>
        <p>{currentMode.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 text-sm">Votre entrée</h3>
            <span className="text-xs text-slate-400">{input.length} caractères</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={currentMode.placeholder}
            className="flex-1 min-h-[260px] text-sm text-slate-700 leading-relaxed placeholder-slate-300 outline-none resize-none"
          />
          <div className="pt-4 mt-2 border-t border-slate-100">
            <button onClick={generate} disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-sm shadow-violet-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Génération en cours...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Générer avec l'IA</>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 text-sm">Résultat généré</h3>
            {output && (
              <div className="flex items-center gap-2">
                <button onClick={generate}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                  title="Régénérer">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button onClick={copyOutput}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${copied ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                  {copied ? (<><CheckCircle2 className="w-3.5 h-3.5" /> Copié !</>) : (<><Copy className="w-3.5 h-3.5" /> Copier</>)}
                </button>
              </div>
            )}
          </div>

          <div className={`flex-1 min-h-[260px] ${output ? "text-slate-700" : "flex items-center justify-center"}`}>
            {output ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{output}{loading && <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 animate-pulse align-bottom" />}</p>
            ) : (
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-300 text-sm">Le résultat apparaîtra ici</p>
              </div>
            )}
          </div>

          {output && !loading && (
            <div className="pt-4 mt-2 border-t border-slate-100">
              <button onClick={copyOutput}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 font-semibold py-2.5 rounded-xl text-sm transition-all">
                {copied ? (<><CheckCircle2 className="w-4 h-4 text-green-500" /> Copié dans le presse-papiers</>) : (<><Copy className="w-4 h-4" /> Copier dans le presse-papiers</>)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm mb-3">✨ Conseils pour de meilleurs résultats</h3>
        <ul className="space-y-2 text-sm text-slate-500">
          <li>• Plus votre entrée est détaillée, plus le résultat sera personnalisé et pertinent.</li>
          <li>• Pour la bio : mentionnez votre domaine, vos années d'expérience et vos spécialités.</li>
          <li>• Pour la lettre de motivation : précisez le poste, l'entreprise et 3 de vos points forts.</li>
          <li>• Vous pouvez cliquer sur <strong>Régénérer</strong> pour obtenir une nouvelle variante.</li>
        </ul>
      </div>
    </div>
  );
}
