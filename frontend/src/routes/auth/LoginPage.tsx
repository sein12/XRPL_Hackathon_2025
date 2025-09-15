// src/routes/auth/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MobileShell from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollText } from "lucide-react";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form);
      nav("/dashboard", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Login Failed");
    }
  };

  return (
    <MobileShell>
      <div className="min-h-[70vh] w-full flex flex-col gap-6 items-center justify-center">
        <div className="flex gap-2 items-center">
          <ScrollText className="w-10 h-10" />
          <p className="text-2xl font-bold">보험자동청구체계</p>
        </div>

        <form onSubmit={onSubmit} className="w-3xs flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Input
              id="username"
              placeholder="ID"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {err && <p className="text-sm text-red-600">{err}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </form>
      </div>
    </MobileShell>
  );
}
