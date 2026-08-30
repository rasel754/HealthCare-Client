"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSpecialtiesService, createSpecialtyService, deleteSpecialtyService } from "@/src/services/specialty.services";
import { ISpecialty } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, Trash2, Layers, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function SpecialtiesManagementPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
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

  const deleteSpecialtyMutation = useMutation({
    mutationFn: (id: string) => deleteSpecialtyService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["specialties"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);

    createSpecialtyMutation.mutate(formData);
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
        <div className="py-12 text-center text-xs text-slate-500">Loading specialties...</div>
      ) : specialties.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Layers className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Specialties Found</h3>
          <p className="text-xs text-slate-400">Click &apos;Create Specialty&apos; above to add specialty categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                  {s.icon ? <img src={s.icon} alt={s.title} className="h-full w-full object-cover" /> : <Layers className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description || "No description provided."}</p>
                </div>
              </div>
              <button
                onClick={() => deleteSpecialtyMutation.mutate(s.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Specialty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Create Medical Specialty</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {msg && <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Specialty Title</Label>
                <Input
                  id="title"
                  required
                  placeholder="Cardiology, Neurology..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  placeholder="Specialty overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl mt-1"
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
                  className="rounded-xl mt-1"
                />
              </div>

              <Button type="submit" disabled={createSpecialtyMutation.isPending} className="w-full rounded-xl mt-2">
                {createSpecialtyMutation.isPending ? "Creating..." : "Save Specialty"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}