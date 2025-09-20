// src/routes/MyPage.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchMyCredentialsBySeed,
  type CredentialObject,
} from "@/api/credential";
import { useSignup } from "@/contexts/SignupContext";
import { getClientBalance } from "@/api/xrpl";

/** hex → utf8 (CredentialType/URI 간단 디코더; 실패 시 원본 반환) */
function hexToUtf8Safe(hex?: string) {
  if (!hex) return "";
  try {
    return Buffer.from(hex.replace(/^0x/i, ""), "hex").toString("utf8");
  } catch {
    return hex;
  }
}

export default function Profile() {
  const { user } = useSignup();
  const [items, setItems] = useState<CredentialObject[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);

  const getBalance = async () => {
    const res = await getClientBalance();
    setBalance(res.client_balance_xrp);
  };

  useEffect(() => {
    getBalance();
  }, []);

  const onCheck = async () => {
    setErr("");
    setItems(null);

    if (!user) {
      setErr("로그인이 필요합니다.");
      return;
    }
    if (!user.walletAddr) {
      console.log(user);
      setErr("지갑(현재 데모에선 seed)이 없습니다.");
      return;
    }

    setLoading(true);
    try {
      // ⚠️ 데모 전용: 서버에 seed를 전달해 조회
      const res = await fetchMyCredentialsBySeed(user.userSeed);
      setItems(res.items ?? []);
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const maskedWalletAddr = user?.walletAddr
    ? user.walletAddr.slice(0, 4) + "••••••••••" + user.walletAddr.slice(-4)
    : "";

  return (
    <div className="max-w-[720px] mx-auto p-4 space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">My Page</h1>
        <p className="text-sm text-muted-foreground">
          Seed 저장은 데모용입니다. 프로덕션에서는 주소만 저장하고 비수탁
          서명으로 전환하세요.
        </p>
      </div>
      <div>
        <span className="text-sm">
          현재 지갑 잔액:{" "}
          <span className="font-mono">{balance.toLocaleString()} XRP</span>
        </span>
      </div>

      <div className="rounded-md border p-4 space-y-2">
        <div className="text-sm">
          <span className="font-medium">현재 저장 값</span>:{" "}
          <span className="font-mono">{maskedWalletAddr || "—"}</span>
        </div>
        <Button onClick={onCheck} disabled={loading}>
          {loading ? "조회 중..." : "내 Credential 조회"}
        </Button>
        {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
      </div>

      {items && (
        <div className="rounded-md border p-4">
          <div className="mb-3 text-sm text-muted-foreground">
            총 {items.length}개
          </div>
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm">보유한 Credential이 없습니다.</p>
            ) : (
              items.map((it, i) => (
                <div
                  key={it.index ?? i}
                  className="p-3 rounded-md border bg-card text-card-foreground"
                >
                  <div className="text-xs text-muted-foreground">#{i + 1}</div>
                  <div className="mt-1 text-sm">
                    <div>
                      <span className="font-medium">Issuer</span>:{" "}
                      <span className="font-mono break-all">{it.Issuer}</span>
                    </div>
                    <div>
                      <span className="font-medium">Subject</span>:{" "}
                      <span className="font-mono break-all">{it.Subject}</span>
                    </div>
                    <div>
                      <span className="font-medium">Type</span>:{" "}
                      <span className="font-mono">
                        {hexToUtf8Safe(it.CredentialType)}
                      </span>
                    </div>
                    {it.URI && (
                      <div>
                        <span className="font-medium">URI</span>:{" "}
                        <span className="font-mono break-all">
                          {hexToUtf8Safe(it.URI)}
                        </span>
                      </div>
                    )}
                    {typeof it.Expiration === "number" && (
                      <div>
                        <span className="font-medium">Expiration</span>:{" "}
                        {new Date(it.Expiration * 1000).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
