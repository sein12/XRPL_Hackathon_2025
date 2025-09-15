import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StepNameEmail() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onNext = () => {
    // TODO: 전역 상태 관리로
    // 임시 보관: localStorage (간단/해커톤용)
    localStorage.setItem("signup_name", name);
    localStorage.setItem("signup_email", email);
    nav("/signup/account");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button className="w-full" onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
