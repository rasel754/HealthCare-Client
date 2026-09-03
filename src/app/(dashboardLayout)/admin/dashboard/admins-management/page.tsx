"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminsService, getSuperAdminsService, createAdminService, createSuperAdminService, deleteAdminService, changeUserRoleService } from "@/src/services/admin.services";
import { Role } from "@/src/types/auth.type";
import { IAdmin, ISuperAdmin } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ShieldCheck, Plus, Trash2, X, RefreshCw } from "lucide-react";
import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";


export default function AdminsManagementPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);
  const [msg, setMsg] = useState<string | null>(null);

  const { data: adminsResponse, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdminsService({ limit: 50 }),
  });

  const { data: superAdminsResponse } = useQuery({
    queryKey: ["super-admins"],
    queryFn: () => getSuperAdminsService({ limit: 50 }),
  });

  const admins = (adminsResponse && "data" in adminsResponse ? adminsResponse.data : []) as IAdmin[];
  const superAdmins = (superAdminsResponse && "data" in superAdminsResponse ? superAdminsResponse.data : []) as ISuperAdmin[];

  const createAdminMutation = useMutation({
    mutationFn: (payload: { password: string; admin: Partial<IAdmin>; role: Role }) => {
      if (payload.role === Role.SUPER_ADMIN) {
        return createSuperAdminService({ password: payload.password, superAdmin: payload.admin });
      }
      return createAdminService({ password: payload.password, admin: payload.admin });
    },
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Administrative account created successfully!");
        setTimeout(() => {
          setIsAddModalOpen(false);
          setName("");
          setEmail("");
          setPassword("");
          setContactNumber("");
          setMsg(null);
          queryClient.invalidateQueries({ queryKey: ["admins"] });
          queryClient.invalidateQueries({ queryKey: ["super-admins"] });
        }, 1200);
      }
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) => changeUserRoleService(userId, role),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("User role updated successfully!");
        setTimeout(() => setMsg(null), 1500);
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        queryClient.invalidateQueries({ queryKey: ["super-admins"] });
      }
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: string) => deleteAdminService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["super-admins"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    createAdminMutation.mutate({
      password,
      admin: { name, email, contactNumber },
      role: selectedRole,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">System Administrators</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage administrative staff and super admin credentials</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2 h-11 px-5">
          <Plus className="h-4 w-4" /> Create Admin Account
        </Button>
      </div>

      {msg && <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold">{msg}</div>}

      {isLoading ? (
        <ClinicalCardGridSkeleton count={6} message="Loading administrative accounts..." />
      ) : admins.length === 0 && superAdmins.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Admins Registered</h3>
          <p className="text-xs text-muted-foreground">Click &apos;Create Admin Account&apos; to onboard new system admins.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((adm) => (
            <div key={adm.id} className="bg-card text-card-foreground rounded-3xl border border-border p-6 flex flex-col justify-between shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-accent text-foreground flex items-center justify-center font-bold text-lg border border-border">
                    {adm.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{adm.name}</h3>
                    <p className="text-xs text-muted-foreground">{adm.email}</p>
                    <span className="inline-block mt-1 bg-accent text-accent-foreground font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase border border-border">
                      ADMIN
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteAdminMutation.mutate(adm.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Admin"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeRoleMutation.mutate({ userId: adm.id, role: Role.SUPER_ADMIN })}
                  disabled={changeRoleMutation.isPending}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Promote to Super Admin
                </Button>
              </div>
            </div>
          ))}

          {superAdmins.map((sadm) => (
            <div key={sadm.id} className="bg-card text-card-foreground rounded-3xl border border-primary/30 p-6 flex flex-col justify-between shadow-sm space-y-4 ring-1 ring-primary/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {sadm.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{sadm.name}</h3>
                    <p className="text-xs text-muted-foreground">{sadm.email}</p>
                    <span className="inline-block mt-1 bg-primary/10 text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase border border-primary/20">
                      SUPER ADMIN
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeRoleMutation.mutate({ userId: sadm.id, role: Role.ADMIN })}
                  disabled={changeRoleMutation.isPending}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Demote to Admin
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-lg">Create System Admin</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {msg && <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="aname">Full Name</Label>
                <Input id="aname" required placeholder="Admin full name..." value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
              </div>

              <div>
                <Label htmlFor="aemail">Email Address</Label>
                <Input id="aemail" type="email" required placeholder="admin@healthcare.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
              </div>

              <div>
                <Label htmlFor="apassword">Password</Label>
                <Input id="apassword" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
              </div>

              <div>
                <Label htmlFor="acontact">Contact Number</Label>
                <Input id="acontact" placeholder="+8801700000000" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
              </div>

              <div>
                <Label>Administrative Role</Label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={Role.ADMIN}>Admin</option>
                  <option value={Role.SUPER_ADMIN}>Super Admin</option>
                </select>
              </div>

              <Button type="submit" disabled={createAdminMutation.isPending} className="w-full rounded-xl mt-2">
                {createAdminMutation.isPending ? "Creating..." : "Create Administrative Account"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}