"use client";

import React, { useState, useEffect, use, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Save,
  Briefcase, GraduationCap, Layers, FolderKanban, Award, Quote, Languages, ExternalLink, X,
  Star, Lock, RefreshCw, Camera, Palette, GripVertical, Upload
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

function formatDate(s: string) { return s ? new Date(s).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : ""; }

const inputCls = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-all text-sm";
const labelCls = "block text-xs font-semibold text-slate-500 mb-1.5";

// --- Section forms ---
function ExperienceForm({ profileId, item, onSave, onCancel, apiFetch }: any) {
  const [form, setForm] = useState(item || { title: "", company: "", location: "", start_date: "", end_date: "", is_current: false, description: "", skills_used: "" });
  const [saving, setSaving] = useState(false);
  const handle = (e: any) => setForm((p: any) => ({ ...p, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const submit = async (e: any) => {
    e.preventDefault(); setSaving(true);
    const url = item ? `/profiles/${profileId}/sections/experiences/${item.id}` : `/profiles/${profileId}/sections/experiences`;
    const res = await apiFetch(url, { method: item ? "PUT" : "POST", body: JSON.stringify(form) });
    if (res.ok) { onSave(); } setSaving(false);
  };
  return (
    <form onSubmit={submit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Titre *</label><input required name="title" value={form.title} onChange={handle} className={inputCls} placeholder="Lead Developer" /></div>
        <div><label className={labelCls}>Entreprise *</label><input required name="company" value={form.company} onChange={handle} className={inputCls} placeholder="PixelCraft" /></div>
        <div><label className={labelCls}>Lieu</label><input name="location" value={form.location} onChange={handle} className={inputCls} placeholder="Paris" /></div>
        <div><label className={labelCls}>Date de début *</label><input required name="start_date" type="date" value={form.start_date} onChange={handle} className={inputCls} /></div>
        <div><label className={labelCls}>Date de fin</label><input name="end_date" type="date" value={form.end_date} onChange={handle} className={inputCls} disabled={form.is_current} /></div>
        <div className="flex items-center gap-2 pt-6"><input type="checkbox" name="is_current" checked={form.is_current} onChange={handle} className="w-4 h-4 text-indigo-600 rounded" /><label className="text-xs font-semibold text-slate-600">Poste actuel</label></div>
      </div>
      <div><label className={labelCls}>Description</label><textarea name="description" value={form.description} onChange={handle} rows={3} className={`${inputCls} resize-none`} placeholder="Décrivez vos missions..." /></div>
      <div><label className={labelCls}>Compétences utilisées (séparées par des virgules)</label><input name="skills_used" value={form.skills_used} onChange={handle} className={inputCls} placeholder="React, Laravel, Docker" /></div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100">Annuler</button>
      </div>
    </form>
  );
}

function SkillForm({ profileId, item, onSave, onCancel, apiFetch }: any) {
  const [form, setForm] = useState(item || { name: "", level: 80, category: "Frontend" });
  const [saving, setSaving] = useState(false);
  const handle = (e: any) => setForm((p: any) => ({ ...p, [e.target.name]: e.target.name === "level" ? parseInt(e.target.value) : e.target.value }));
  const submit = async (e: any) => {
    e.preventDefault(); setSaving(true);
    const url = item ? `/profiles/${profileId}/sections/skills/${item.id}` : `/profiles/${profileId}/sections/skills`;
    const res = await apiFetch(url, { method: item ? "PUT" : "POST", body: JSON.stringify(form) });
    if (res.ok) { onSave(); } setSaving(false);
  };
  return (
    <form onSubmit={submit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>Compétence *</label><input required name="name" value={form.name} onChange={handle} className={inputCls} placeholder="React" /></div>
        <div><label className={labelCls}>Niveau ({form.level}%)</label><input name="level" type="range" min="1" max="100" value={form.level} onChange={handle} className="w-full mt-2 accent-indigo-600" /></div>
        <div>
          <label className={labelCls}>Catégorie *</label>
          <select name="category" value={form.category} onChange={handle} className={inputCls}>
            {["Frontend", "Backend", "Database", "DevOps", "Design", "Management", "Autre"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100">Annuler</button>
      </div>
    </form>
  );
}

function ProjectForm({ profileId, item, onSave, onCancel, apiFetch }: any) {
  const [form, setForm] = useState(
    item || {
      title: "",
      description: "",
      tags: "",
      demo_url: "",
      github_url: "",
      behance_url: "",
      details: "",
      client_name: "",
      client_role: "",
      client_feedback: "",
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [clientAvatarFile, setClientAvatarFile] = useState<File | null>(null);
  
  // Gallery state
  const [existingGallery, setExistingGallery] = useState<string[]>(
    (item && Array.isArray(item.gallery)) ? item.gallery : []
  );
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const handle = (e: any) =>
    setForm((p: any) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAddGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewGalleryFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveExistingGalleryItem = (indexToRemove: number) => {
    setExistingGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewGalleryFile = (indexToRemove: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.tags) formData.append("tags", form.tags);
    if (form.demo_url) formData.append("demo_url", form.demo_url);
    if (form.github_url) formData.append("github_url", form.github_url);
    if (form.behance_url) formData.append("behance_url", form.behance_url);
    if (form.details) formData.append("details", form.details);
    if (form.client_name) formData.append("client_name", form.client_name);
    if (form.client_role) formData.append("client_role", form.client_role);
    if (form.client_feedback) formData.append("client_feedback", form.client_feedback);

    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);
    if (clientAvatarFile) formData.append("client_avatar", clientAvatarFile);

    // Gallery fields
    formData.append("existing_gallery", JSON.stringify(existingGallery));
    newGalleryFiles.forEach((file) => {
      formData.append("gallery_files[]", file);
    });

    if (item) {
      formData.append("_method", "PUT");
    }

    const url = item
      ? `/profiles/${profileId}/sections/projects/${item.id}`
      : `/profiles/${profileId}/sections/projects`;

    try {
      const res = await apiFetch(url, {
        method: "POST", // POST is required for PHP file upload processing with _method=PUT
        body: formData,
      });
      if (res.ok) {
        onSave();
      } else {
        const errData = await res.json();
        alert(errData.message || "Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la communication avec l'API.");
    } finally {
      setSaving(false);
    }
  };

  const labelCls = "block text-xs font-semibold text-slate-500 mb-1.5";
  const inputCls = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-all text-sm";

  return (
    <form onSubmit={submit} className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200 text-left font-sans">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        {item ? "Modifier le projet" : "Nouveau projet"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className={labelCls}>Titre du projet *</label>
          <input required name="title" value={form.title} onChange={handle} className={inputCls} placeholder="Ex: Horizon E-Commerce" />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Courte description * (pour la carte de présentation)</label>
          <textarea required name="description" value={form.description} onChange={handle} rows={2} className={`${inputCls} resize-none`} placeholder="Ex: Horizon est une plateforme e-commerce..." />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Présentation détaillée (Markdown supporté)</label>
          <textarea name="details" value={form.details || ""} onChange={handle} rows={5} className={`${inputCls} resize-none`} placeholder="Présentation complète du projet : contexte, technologies, architecture, défis..." />
        </div>

        <div>
          <label className={labelCls}>Tags (séparés par des virgules)</label>
          <input name="tags" value={form.tags || ""} onChange={handle} className={inputCls} placeholder="Next.js, Tailwind, Stripe" />
        </div>

        <div>
          <label className={labelCls}>URL de démonstration</label>
          <input name="demo_url" type="url" value={form.demo_url || ""} onChange={handle} className={inputCls} placeholder="https://horizon.example.com" />
        </div>

        <div>
          <label className={labelCls}>URL GitHub / Code source</label>
          <input name="github_url" type="url" value={form.github_url || ""} onChange={handle} className={inputCls} placeholder="https://github.com/username/project" />
        </div>

        <div>
          <label className={labelCls}>URL Behance / Design</label>
          <input name="behance_url" type="url" value={form.behance_url || ""} onChange={handle} className={inputCls} placeholder="https://behance.net/gallery/..." />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 mt-2">
        <h4 className="text-xs font-bold text-slate-700 mb-2">Médias du projet</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Image principale (Fichier)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            {item?.image_url && !imageFile && (
              <p className="text-[10px] text-slate-400 mt-1 truncate">Actuelle : <a href={item.image_url} target="_blank" rel="noreferrer" className="underline">{item.image_url}</a></p>
            )}
          </div>

          <div>
            <label className={labelCls}>Vidéo de démonstration (Fichier)</label>
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            {item?.video_url && !videoFile && (
              <p className="text-[10px] text-slate-400 mt-1 truncate">Actuelle : <a href={item.video_url} target="_blank" rel="noreferrer" className="underline">{item.video_url}</a></p>
            )}
          </div>

          {/* Gallery upload */}
          <div className="md:col-span-2 border-t border-slate-100 pt-3">
            <label className={labelCls}>Galerie d'images du projet</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleAddGalleryFiles} 
              className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100" 
            />
            
            {/* Gallery items preview */}
            {(existingGallery.length > 0 || newGalleryFiles.length > 0) && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3 bg-white p-3 rounded-xl border border-slate-150">
                {/* Existing gallery */}
                {existingGallery.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExistingGalleryItem(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 opacity-90 transition-opacity cursor-pointer"
                      title="Supprimer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* New files queued */}
                {newGalleryFiles.map((file, idx) => {
                  const objectUrl = URL.createObjectURL(file);
                  return (
                    <div key={`new-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border border-indigo-200 bg-indigo-50/20 group">
                      <img src={objectUrl} alt="New item preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveNewGalleryFile(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 opacity-90 transition-opacity cursor-pointer"
                        title="Supprimer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 mt-2">
        <h4 className="text-xs font-bold text-slate-700 mb-2">Témoignage / Retour client (Optionnel)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nom du client</label>
            <input name="client_name" value={form.client_name || ""} onChange={handle} className={inputCls} placeholder="Ex: Jean Dupont" />
          </div>

          <div>
            <label className={labelCls}>Rôle / Entreprise du client</label>
            <input name="client_role" value={form.client_role || ""} onChange={handle} className={inputCls} placeholder="Ex: CEO chez Alpha Tech" />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Retour client / Témoignage</label>
            <textarea name="client_feedback" value={form.client_feedback || ""} onChange={handle} rows={2} className={`${inputCls} resize-none`} placeholder="Ex: Super travail réalisé en un temps record..." />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Avatar du client (Fichier)</label>
            <input type="file" accept="image/*" onChange={(e) => setClientAvatarFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            {item?.client_avatar_url && !clientAvatarFile && (
              <p className="text-[10px] text-slate-400 mt-1 truncate">Actuel : <a href={item.client_avatar_url} target="_blank" rel="noreferrer" className="underline">{item.client_avatar_url}</a></p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-200">
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100">Annuler</button>
      </div>
    </form>
  );
}

function GenericSection({ title, icon: Icon, items: initialItems, renderItem, renderForm, onDelete, apiFetch, profileId, sectionKey }: any) {
  const [items, setItems] = useState<any[]>(initialItems || []);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { setItems(initialItems || []); }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i: any) => i.id === active.id);
    const newIndex = items.findIndex((i: any) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await apiFetch(`/profiles/${profileId}/sections/${sectionKey}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ order: newItems.map((i: any) => i.id) }),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet élément ?")) return;
    setDeleting(id);
    await apiFetch(`/profiles/${profileId}/sections/${sectionKey}/${id}`, { method: "DELETE" });
    onDelete();
    setDeleting(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
          <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <button onClick={() => { setShowForm(true); setEditItem(null); }}
          className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </div>

      {(showForm && !editItem) && renderForm({ onSave: () => { setShowForm(false); onDelete(); }, onCancel: () => setShowForm(false) })}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 mt-4">
            {items.map((item: any) => (
              <SortableItem key={item.id} id={item.id}>
                {editItem?.id === item.id
                  ? renderForm({ item, onSave: () => { setEditItem(null); onDelete(); }, onCancel: () => setEditItem(null) })
                  : (
                    <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all">
                      <div className="flex-1 min-w-0">{renderItem(item)}</div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setEditItem(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50">
                          {deleting === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
              </SortableItem>
            ))}
            {items.length === 0 && !showForm && (
              <p className="text-xs text-slate-400 text-center py-4">Aucun élément. Cliquez sur "+ Ajouter" pour commencer.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ id, children }: { id: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-indigo-500"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      {children}
    </div>
  );
}

export default function ProfileEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { apiFetch } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    apiFetch(`/profiles/${id}/edit`)
      .then(r => r.json())
      .then(full => {
        setProfile(full);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load profile edit details:", err);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null); setSuccess(false);
    try {
      const res = await apiFetch(`/profiles/${id}`, { method: "PUT", body: JSON.stringify(profile) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', photoFile);
    try {
      const res = await apiFetch(`/profiles/${id}/upload-photo`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur upload');
      setProfile((p: any) => ({ ...p, photo_url: data.photo_url }));
      setPhotoFile(null);
      setPhotoPreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>;
  if (!profile) return <div className="p-8 text-slate-400 text-sm">Profil introuvable</div>;

  const inputCls2 = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-all text-sm";

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/profiles" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-slate-900">{profile.title}</h1>
          <p className="text-slate-400 text-xs mt-0.5">Modifier le profil</p>
        </div>
        <a href={`/u/${profile.slug}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all">
          <ExternalLink className="w-3.5 h-3.5" /> Voir le profil
        </a>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profil enregistré avec succès !
        </div>
      )}

      {/* Bio form */}
      <form onSubmit={handleSave} className="mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-800 text-sm mb-1">Informations générales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Titre *</label><input required className={inputCls2} value={profile.title || ""} onChange={e => setProfile((p: any) => ({ ...p, title: e.target.value }))} /></div>

            {/* Slug — read-only with regenerate button */}
            <div className="sm:col-span-2">
              <label className={labelCls}>
                URL du profil
                <span className="ml-2 text-[10px] font-normal text-slate-400 normal-case tracking-normal">✦ Identifiant unique</span>
              </label>
              <div className="flex items-stretch rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <span className="px-3 py-2.5 bg-slate-100 border-r border-slate-200 text-xs text-slate-400 font-medium shrink-0 flex items-center">
                  profolio.app/u/
                </span>
                <div className="flex-1 px-3 py-2.5 text-sm font-mono text-slate-700 flex items-center gap-2 min-w-0">
                  <Lock className="w-3 h-3 text-slate-300 shrink-0" />
                  <span className="truncate">{profile.slug}</span>
                </div>
                <button
                  type="button"
                  title="Regénérer un nouvel identifiant"
                  onClick={() => {
                    const suffix = Math.random().toString(36).substring(2, 8);
                    const base = (profile.title || "profil")
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "")
                      .substring(0, 30);
                    setProfile((p: any) => ({ ...p, slug: base ? `${base}-${suffix}` : suffix }));
                  }}
                  className="px-3 py-2.5 bg-slate-100 border-l border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Regénérer</span>
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400">
                ⚠️ Changer l'identifiant invalide les liens partagés pointant vers l'ancien URL.
              </p>
            </div>

            <div className="sm:col-span-2"><label className={labelCls}>Biographie</label><textarea rows={4} className={`${inputCls2} resize-none`} value={profile.bio || ""} onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))} /></div>
            <div><label className={labelCls}>Email de contact</label><input className={inputCls2} type="email" value={profile.contact_email || ""} onChange={e => setProfile((p: any) => ({ ...p, contact_email: e.target.value }))} /></div>
            <div><label className={labelCls}>Téléphone</label><input className={inputCls2} value={profile.contact_phone || ""} onChange={e => setProfile((p: any) => ({ ...p, contact_phone: e.target.value }))} /></div>
            <div><label className={labelCls}>Localisation</label><input className={inputCls2} value={profile.contact_location || ""} onChange={e => setProfile((p: any) => ({ ...p, contact_location: e.target.value }))} /></div>
            <div><label className={labelCls}>GitHub</label><input className={inputCls2} value={profile.social_github || ""} onChange={e => setProfile((p: any) => ({ ...p, social_github: e.target.value }))} /></div>
            <div><label className={labelCls}>LinkedIn</label><input className={inputCls2} value={profile.social_linkedin || ""} onChange={e => setProfile((p: any) => ({ ...p, social_linkedin: e.target.value }))} /></div>
            <div><label className={labelCls}>Site web</label><input className={inputCls2} value={profile.social_website || ""} onChange={e => setProfile((p: any) => ({ ...p, social_website: e.target.value }))} /></div>

            {/* Photo de profil — Upload fichier */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Photo de profil</label>
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                    {(photoPreview || profile.photo_url) ? (
                      <img src={photoPreview || profile.photo_url} alt="Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1.5 shadow-md hover:bg-indigo-500 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFileChange} />
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 text-xs text-slate-500 hover:text-indigo-600 transition-all w-full justify-center">
                    <Upload className="w-3.5 h-3.5" />
                    {photoPreview ? 'Changer la photo' : 'Choisir un fichier'}
                  </button>
                  {photoPreview && (
                    <button type="button" onClick={handlePhotoUpload} disabled={uploadingPhoto}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold w-full justify-center disabled:opacity-50">
                      {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      {uploadingPhoto ? 'Envoi...' : 'Enregistrer la photo'}
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400">JPG, PNG ou WebP — max 3 Mo</p>
                </div>
              </div>
            </div>

            <div><label className={labelCls}>Photo de couverture (URL)</label><input className={inputCls2} value={profile.cover_url || ""} onChange={e => setProfile((p: any) => ({ ...p, cover_url: e.target.value }))} /></div>
            
            <div className="sm:col-span-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Gabarit visuel du profil (Template)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    id: "classic", 
                    name: "Classic", 
                    desc: "Mise en page classique divisée en colonnes, frise chronologique sombre et présentation épurée.",
                  },
                  { 
                    id: "minimalist", 
                    name: "Minimalist", 
                    desc: "Design minimaliste à colonne unique centré, typographie aérée et focus absolu sur le contenu.",
                  },
                  { 
                    id: "developer", 
                    name: "Developer / Monospace", 
                    desc: "Thème typé console / IDE avec police monospace, blocs de code, et accents vert fluo/cyan.",
                  },
                  { 
                    id: "creative", 
                    name: "Creative / Bold", 
                    desc: "Mise en page dynamique et asymétrique, dégradés vibrants et conteneurs en verre flouté.",
                  },
                  { 
                    id: "neumorphism", 
                    name: "Neumorphism / Soft UI", 
                    desc: "Design tactile avec ombres douces et effets 3D d'embossage.",
                  },
                  { 
                    id: "bento", 
                    name: "Bento / Grid UI", 
                    desc: "Mise en page ludique en grille asymétrique façon écosystème Apple.",
                  },
                  { 
                    id: "luxury", 
                    name: "Luxury / Dark Elegance", 
                    desc: "Thème sombre haut de gamme, typographie serif et accents dorés.",
                  },
                  { 
                    id: "saas", 
                    name: "SaaS / Modern Startup", 
                    desc: "Style épuré de startup tech, halos vibrants et cartes nettes.",
                  }
                ].map((t) => (
                  <label 
                    key={t.id} 
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                      profile.template === t.id 
                        ? "border-indigo-600 bg-indigo-50/20 shadow-md shadow-indigo-600/5" 
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="template" 
                      value={t.id} 
                      checked={profile.template === t.id} 
                      onChange={e => setProfile((p: any) => ({ ...p, template: e.target.value }))} 
                      className="absolute right-4 top-4 w-4 h-4 text-indigo-600" 
                    />
                    <div className="space-y-1.5 pr-8">
                      <span className="font-extrabold text-sm text-slate-800 block">{t.name}</span>
                      <span className="text-xs text-slate-400 font-semibold block leading-relaxed">{t.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="sm:col-span-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                Couleur d'accent
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6','#64748b','#1e293b'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setProfile((p: any) => ({ ...p, accent_color: color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      profile.accent_color === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs text-slate-400">Personnalisé&nbsp;:</span>
                  <input
                    type="color"
                    value={profile.accent_color || '#6366f1'}
                    onChange={e => setProfile((p: any) => ({ ...p, accent_color: e.target.value }))}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                </div>
                <span className="text-xs font-mono text-slate-500">{profile.accent_color || '#6366f1'}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.01] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
            </button>
          </div>
        </div>
      </form>

      {/* Section: Experiences */}
      <div className="space-y-5">
        <GenericSection
          title="Expériences"
          icon={Briefcase}
          items={profile.experiences}
          profileId={id}
          sectionKey="experiences"
          apiFetch={apiFetch}
          onDelete={load}
          renderItem={(exp: any) => (
            <div>
              <p className="font-semibold text-slate-900 text-sm">{exp.title} <span className="text-slate-400 font-normal">·</span> <span className="text-indigo-700 text-xs">{exp.company}</span></p>
              <p className="text-xs text-slate-400">{formatDate(exp.start_date)} — {exp.is_current ? "Présent" : formatDate(exp.end_date)}</p>
            </div>
          )}
          renderForm={({ item, onSave, onCancel }: any) => (
            <ExperienceForm profileId={id} item={item} onSave={onSave} onCancel={onCancel} apiFetch={apiFetch} />
          )}
        />

        {/* Section: Skills */}
        <GenericSection
          title="Compétences"
          icon={Layers}
          items={profile.skills}
          profileId={id}
          sectionKey="skills"
          apiFetch={apiFetch}
          onDelete={load}
          renderItem={(sk: any) => (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">{sk.name}</p>
                <p className="text-xs text-slate-400">{sk.category}</p>
              </div>
              <div className="w-24 h-1.5 bg-slate-200 rounded-full">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${sk.level}%` }}></div>
              </div>
              <span className="text-xs text-slate-400 w-8 text-right">{sk.level}%</span>
            </div>
          )}
          renderForm={({ item, onSave, onCancel }: any) => (
            <SkillForm profileId={id} item={item} onSave={onSave} onCancel={onCancel} apiFetch={apiFetch} />
          )}
        />

        {/* Section: Certifications (simplified generic) */}
        <GenericSection
          title="Certifications"
          icon={Award}
          items={profile.certifications}
          profileId={id}
          sectionKey="certifications"
          apiFetch={apiFetch}
          onDelete={load}
          renderItem={(c: any) => (
            <div>
              <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
              <p className="text-xs text-slate-400">{c.issuer} · {formatDate(c.issue_date)}</p>
            </div>
          )}
          renderForm={({ item, onSave, onCancel }: any) => {
            const [form, setForm] = useState<any>(item || { name: "", issuer: "", issue_date: "", expiration_date: "", credential_id: "", credential_url: "", is_verified: false });
            const [saving, setSaving] = useState(false);
            const handle = (e: any) => setForm((p: any) => ({ ...p, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
            const submit = async (e: any) => {
              e.preventDefault(); setSaving(true);
              const url = item ? `/profiles/${id}/sections/certifications/${item.id}` : `/profiles/${id}/sections/certifications`;
              const res = await apiFetch(url, { method: item ? "PUT" : "POST", body: JSON.stringify(form) });
              if (res.ok) onSave(); setSaving(false);
            };
            return (
              <form onSubmit={submit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Certification *</label><input required name="name" value={form.name} onChange={handle} className={inputCls} /></div>
                  <div><label className={labelCls}>Organisme *</label><input required name="issuer" value={form.issuer} onChange={handle} className={inputCls} /></div>
                  <div><label className={labelCls}>Date d'obtention *</label><input required name="issue_date" type="date" value={form.issue_date} onChange={handle} className={inputCls} /></div>
                  <div><label className={labelCls}>Expiration</label><input name="expiration_date" type="date" value={form.expiration_date} onChange={handle} className={inputCls} /></div>
                  <div><label className={labelCls}>ID Credential</label><input name="credential_id" value={form.credential_id} onChange={handle} className={inputCls} /></div>
                  <div><label className={labelCls}>URL Credential</label><input name="credential_url" type="url" value={form.credential_url} onChange={handle} className={inputCls} /></div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Enregistrer
                  </button>
                  <button type="button" onClick={onCancel} className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100">Annuler</button>
                </div>
              </form>
            );
          }}
        />

        {/* Section: Projets */}
        <GenericSection
          title="Projets"
          icon={FolderKanban}
          items={profile.projects}
          profileId={id}
          sectionKey="projects"
          apiFetch={apiFetch}
          onDelete={load}
          renderItem={(proj: any) => (
            <div className="flex gap-4 items-start text-left font-sans">
              {proj.image_url && (
                <img src={proj.image_url} alt={proj.title} className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm">{proj.title}</p>
                <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                {proj.tags && (
                  <p className="text-[10px] text-indigo-600 mt-0.5">{proj.tags}</p>
                )}
              </div>
            </div>
          )}
          renderForm={({ item, onSave, onCancel }: any) => (
            <ProjectForm profileId={id} item={item} onSave={onSave} onCancel={onCancel} apiFetch={apiFetch} />
          )}
        />

        {/* Section: Recommandations Reçues (Modération) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Quote className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Modération des recommandations reçues ({profile.recommendations?.length || 0})</h2>
          </div>

          <div className="space-y-4">
            {profile.recommendations?.map((rec: any) => {
              const toggleRec = async (field: "is_visible" | "is_verified", currentVal: boolean) => {
                const res = await apiFetch(`/profiles/${id}/recommendations/${rec.id}/toggle`, {
                  method: "PUT",
                  body: JSON.stringify({ [field]: !currentVal })
                });
                if (res.ok) {
                  load();
                }
              };

              const deleteRec = async () => {
                if (!confirm("Supprimer cette recommandation définitivement ?")) return;
                const res = await apiFetch(`/profiles/${id}/sections/recommendations/${rec.id}`, {
                  method: "DELETE"
                });
                if (res.ok) {
                  load();
                }
              };

              return (
                <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 text-left">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-slate-100 text-xs sm:text-sm">{rec.recommender_name}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{rec.recommender_role} chez {rec.recommender_company} ({rec.relationship})</p>
                    </div>
                    <button onClick={deleteRec} className="p-1.5 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 transition-all shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100 font-sans">
                    "{rec.content}"
                  </p>

                  <div className="flex gap-2 flex-wrap items-center pt-1">
                    <button
                      type="button"
                      onClick={() => toggleRec("is_visible", rec.is_visible)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all cursor-pointer ${
                        rec.is_visible
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {rec.is_visible ? "Visible (Approuvé)" : "Masqué (En attente)"}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleRec("is_verified", rec.is_verified)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all cursor-pointer ${
                        rec.is_verified
                          ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {rec.is_verified ? "Badge Vérifié" : "Non Vérifié"}
                    </button>
                  </div>
                </div>
              );
            })}
            {(!profile.recommendations || profile.recommendations.length === 0) && (
              <p className="text-xs text-slate-400 text-center py-4">Aucune recommandation reçue pour le moment.</p>
            )}
          </div>
        </div>

        {/* Section: Modération des Avis Projets */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <FolderKanban className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Modération des avis projets</h2>
          </div>

          <div className="space-y-4">
            {profile.projects?.flatMap((proj: any) => 
              (proj.reviews || []).map((rev: any) => {
                const deleteReview = async () => {
                  if (!confirm(`Supprimer l'avis de ${rev.user?.name} sur le projet "${proj.title}" ?`)) return;
                  const res = await apiFetch(`/projects/${proj.id}/reviews/${rev.id}`, {
                    method: "DELETE"
                  });
                  if (res.ok) {
                    load();
                  }
                };

                return (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 text-left">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">
                          Projet: {proj.title}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5">{rev.user?.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{new Date(rev.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <button onClick={deleteReview} className="p-1.5 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 transition-all shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating ? "fill-amber-400 text-amber-500" : "text-slate-200 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-slate-650 bg-white p-3 rounded-lg border border-slate-200 font-sans">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
            
            {(!profile.projects || profile.projects.every((p: any) => !p.reviews || p.reviews.length === 0)) && (
              <p className="text-xs text-slate-400 text-center py-4">Aucun avis laissé sur vos projets pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
