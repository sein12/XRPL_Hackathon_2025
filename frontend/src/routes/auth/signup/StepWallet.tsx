import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function StepWallet() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const [wallet, setWallet] = useState("");
  const [err, setErr] = useState("");

  const onComplete = async () => {
    setErr("");
    try {
      const body = {
        name: localStorage.getItem("signup_name") ?? undefined,
        email: localStorage.getItem("signup_email") ?? "",
        username: localStorage.getItem("signup_username") || "",
        password: localStorage.getItem("signup_password") || "",
        passwordConfirm: localStorage.getItem("signup_passwordConfirm") || "",
        walletAddr: wallet || null, // ✅ 지갑 포함
      };
      await signup(body); // ✅ 여기서 회원 생성
      // (선택) 로컬 임시 값 정리
      [
        "signup_name",
        "signup_email",
        "signup_username",
        "signup_password",
        "signup_passwordConfirm",
      ].forEach((k) => localStorage.removeItem(k));

      nav("/signup/complete");
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Failed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="wallet">Wallet Address</Label>
        <Input
          id="wallet"
          placeholder="0x..."
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
      </div>
      <Button variant="secondary" className="w-full">
        Connect to Xaman
      </Button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <Button className="w-full" onClick={onComplete}>
        Complete
      </Button>
    </div>
  );
}
