// src/routes/signup/StepWallet.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useSignup } from "@/contexts/SignupContext";
import {
  issueCredential,
  acceptIssuedCredentialBySeed,
} from "@/api/credential";

export default function StepWallet() {
  const nav = useNavigate();

  const { signup } = useAuth();
  const { state, set, reset } = useSignup();

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // 발급/수락 진행 상태
  const [open, setOpen] = useState(false); // 수락 모달
  const [issuedHash, setIssuedHash] = useState<string | undefined>(undefined);
  const [issued, setIssued] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // 1) Credential 발급 (Create)
  const onIssue = async () => {
    setErr("");
    if (!state.userSeed) {
      setErr("Seed를 입력해주세요. (Devnet / 데모 전용)");
      return;
    }
    setBusy(true);
    try {
      const res = await issueCredential({
        userSeed: state.userSeed,
        type: "KYC",
        expirationSec: 60 * 60, // 1시간
      });
      setIssuedHash(res?.summary?.hash);
      setIssued(true);
      setOpen(true); // 발급 성공 → 수락 모달 오픈
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Credential 발급에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  // 2) 모달에서 "수락" 눌렀을 때 (Accept)
  const onAccept = async () => {
    setBusy(true);
    try {
      await acceptIssuedCredentialBySeed(state.userSeed, "KYC");
      setAccepted(true);
      setOpen(false);
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Credential 수락에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  // 3) 회원 생성 완료
  const onComplete = async () => {
    setErr("");
    if (state.password !== state.passwordConfirm) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }
    // (선택) 수락 완료를 강제하려면 아래 조건 유지
    if (!accepted) {
      setErr("Credential 수락을 완료해주세요.");
      return;
    }

    setBusy(true);
    try {
      await signup({
        name: state.name,
        email: state.email,
        username: state.username,
        password: state.password,
        passwordConfirm: state.passwordConfirm,
        walletAddr: state.walletAddr || null,
      });
      reset(); // 폼 상태 초기화
      nav("/signup/complete");
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "회원가입에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 지갑 주소 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="wallet">Wallet Address</Label>
        <Input
          id="wallet"
          placeholder="r..."
          value={state.walletAddr}
          onChange={(e) => set("walletAddr", e.target.value)}
        />
      </div>

      {/* (옵션) 지갑 연동 버튼 */}
      {/* <Button variant="secondary" className="w-full" type="button">
        Connect to Xaman
      </Button> */}

      {/* Seed 입력 (데모용) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="seed">User Seed (Devnet / Demo)</Label>
        <Input
          id="seed"
          type="password"
          placeholder="sn************************"
          value={state.userSeed}
          onChange={(e) => set("userSeed", e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onIssue}
            disabled={busy}
          >
            Credential 발급
          </Button>
          {issued && (
            <span className="text-xs text-muted-foreground">
              발급 완료{issuedHash ? ` • ${issuedHash.slice(0, 8)}…` : ""}
            </span>
          )}
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <Button
        className="w-full"
        onClick={onComplete}
        disabled={busy || !accepted}
      >
        Complete
      </Button>

      {/* 수락 확인 모달 */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Credential을 수락하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              원장에 발급 트랜잭션이 제출되었습니다.
              {issuedHash ? (
                <>
                  <br />
                  TX Hash:{" "}
                  <span className="font-mono break-all">{issuedHash}</span>
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onAccept} disabled={busy}>
              수락
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
