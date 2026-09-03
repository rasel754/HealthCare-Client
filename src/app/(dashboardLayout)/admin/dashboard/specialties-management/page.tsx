"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSpecialtiesService, createSpecialtyService, updateSpecialtyService, deleteSpecialtyService } from "@/src/services/specialty.services";
import { ISpecialty } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, Trash2, Edit, Layers, X } from "lucide-react";
import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";


export default function SpecialtiesManagementPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<ISpecialty | null>(null);
  
  // Create Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  
  const [msg, setMsg] = useState<string | null>(null);

  const { data: specialtiesResponse, isLoading } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getSpecialtiesService(),
  });

  const specialties = (specialtiesResponse && "data" in specialtiesResponse ? specialtiesResponse.data : []) as ISpecialty[];

  const createSpecialtyMutation = useMutation({
    mutationFn: createSpecialtyService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Medical specialty created successfully!");
        setTimeout(() => {
          setIsAddModalOpen(false);
          setTitle("");
          setDescription("");
          setFile(null);
          setMsg(null);
          queryClient.invalidateQueries({ queryKey: ["specialties"] });
        }, 1200);
      }
    },
  });

  const updateSpecialtyMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateSpecialtyService(id, formData),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Medical specialty updated successfully!");
        setTimeout(() => {
          setEditingSpecialty(null);
          setEditTitle("");
          setEditDescription("");
          setEditFile(null);
          setMsg(null);
          queryClient.invalidateQueries({ queryKey: ["specialties"] });
        }, 1200);
      }
    },
  });

  const deleteSpecialtyMutation = useMutation({
    mutationFn: (id: string) => deleteSpecialtyService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["specialties"] }),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);

    createSpecialtyMutation.mutate(formData);
  };

  const openEditModal = (s: ISpecialty) => {
    setEditingSpecialty(s);
    setEditTitle(s.title || "");
    setEditDescription(s.description || "");
    setEditFile(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty) return;
    setMsg(null);
    const formData = new FormData();
    if (editTitle) formData.append("title", editTitle);
    if (editDescription) formData.append("description", editDescription);
    if (editFile) formData.append("file", editFile);

    updateSpecialtyMutation.mutate({ id: editingSpecialty.id, formData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Specialties Management</h1>
          <p className="text-xs text-slate-500 mt-1">Configure clinical specialty categories and icons</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2 h-11 px-5">
          <Plus className="h-4 w-4" /> Create Specialty
        </Button>
      </div>

      {isLoading ? (
        <ClinicalCardGridSkeleton count={6} message="Loading clinical specialties..." />
      ) : specialties.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Specialties Found</h3>
          <p className="text-xs text-muted-foreground">Click &apos;Create Specialty&apos; above to add specialty categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((s) => (
            <div key={s.id} className="bg-card text-card-foreground rounded-3xl border border-border p-6 flex items-start justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                  {s.icon ? <img src={s.icon} alt={s.title} className="h-full w-full object-cover" /> : <Layers className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description || "No description provided."}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(s)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                  title="Edit Specialty"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteSpecialtyMutation.mutate(s.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Specialty"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Specialty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-lg">Create Medical Specialty</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {msg && <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">{msg}</div>}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Specialty Title</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g. Cardiology, Neurology, Pediatrics..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                />
              </div>

              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  placeholder="Describe medical focus and treatments..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="iconFile">Icon Image File</Label>
                <Input
                  id="iconFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                />
              </div>

              <Button type="submit" disabled={createSpecialtyMutation.isPending} className="w-full rounded-xl mt-2">
                {createSpecialtyMutation.isPending ? "Creating..." : "Save Specialty"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Specialty Modal */}
      {editingSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-lg">Edit Medical Specialty</h3>
              <button onClick={() => setEditingSpecialty(null)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {msg && <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">{msg}</div>}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Specialty Title</Label>
                <Input
                  id="editTitle"
                  required
                  placeholder="Specialty title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                />
              </div>

              <div>
                <Label htmlFor="editDesc">Description</Label>
                <Textarea
                  id="editDesc"
                  placeholder="Specialty description..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="editIconFile">New Icon Image File (Optional)</Label>
                <Input
                  id="editIconFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                />
              </div>

              <Button type="submit" disabled={updateSpecialtyMutation.isPending} className="w-full rounded-xl mt-2">
                {updateSpecialtyMutation.isPending ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}