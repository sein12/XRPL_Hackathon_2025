import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StepAccount() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState("");

  const onNext = async () => {
    setErr("");
    if (password !== passwordConfirm) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }
    // ✅ 로컬에 보관만
    localStorage.setItem("signup_username", username);
    localStorage.setItem("signup_password", password);
    localStorage.setItem("signup_passwordConfirm", passwordConfirm);

    nav("/signup/wallet");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">ID</Label>
        <Input
          id="username"
          placeholder="ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password2">Confirm Password</Label>
        <Input
          id="password2"
          type="password"
          placeholder="Rewrite password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <Button className="w-full" onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
