import { createContext, useContext, useState, type ReactNode } from "react";
type SignupState = {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  walletAddr: string;
  userSeed: string; // ⚠️ 데모용(수탁). 프로덕션에서 seed는 보관/전송 금지!
};

const defaultState: SignupState = {
  name: "",
  email: "",
  username: "",
  password: "",
  passwordConfirm: "",
  walletAddr: "",
  userSeed: "",
};

type Ctx = {
  state: SignupState;
  setState: React.Dispatch<React.SetStateAction<SignupState>>;
  set<K extends keyof SignupState>(k: K, v: SignupState[K]): void;
  reset(): void;
};

const SignupContext = createContext<Ctx | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SignupState>(defaultState);
  const set = <K extends keyof SignupState>(k: K, v: SignupState[K]) =>
    setState((s) => ({ ...s, [k]: v }));
  const reset = () => setState(defaultState);

  return (
    <SignupContext.Provider value={{ state, setState, set, reset }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used within <SignupProvider>");
  return ctx;
}
