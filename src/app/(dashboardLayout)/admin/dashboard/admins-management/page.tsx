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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Administrators</h1>
          <p className="text-xs text-slate-500 mt-1">Manage administrative staff and super admin credentials</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2 h-11 px-5">
          <Plus className="h-4 w-4" /> Create Admin Account
        </Button>
      </div>

      {msg && <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold">{msg}</div>}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading administrators...</div>
      ) : admins.length === 0 && superAdmins.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Admins Registered</h3>
          <p className="text-xs text-slate-400">Click &apos;Create Admin Account&apos; to onboard new system admins.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((adm) => (
            <div key={adm.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {adm.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{adm.name}</h3>
                    <p className="text-xs text-slate-500">{adm.email}</p>
                    <span className="inline-block mt-1 bg-slate-100 text-slate-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                      ADMIN
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteAdminMutation.mutate(adm.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Admin"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
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
            <div key={sadm.id} className="bg-white rounded-3xl border border-slate-900/20 p-6 flex flex-col justify-between shadow-sm space-y-4 ring-1 ring-slate-900/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {sadm.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{sadm.name}</h3>
                    <p className="text-xs text-slate-500">{sadm.email}</p>
                    <span className="inline-block mt-1 bg-primary/10 text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                      SUPER ADMIN
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Create System Admin</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {msg && <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="aname">Full Name</Label>
                <Input id="aname" required placeholder="Admin Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1" />
              </div>

              <div>
                <Label htmlFor="aemail">Email Address</Label>
                <Input id="aemail" type="email" required placeholder="admin@healthcare.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl mt-1" />
              </div>

              <div>
                <Label htmlFor="apassword">Password</Label>
                <Input id="apassword" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl mt-1" />
              </div>

              <div>
                <Label htmlFor="acontact">Contact Number</Label>
                <Input id="acontact" placeholder="+8801700000000" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="rounded-xl mt-1" />
              </div>

              <div>
                <Label>Administrative Role</Label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium mt-1 bg-white"
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