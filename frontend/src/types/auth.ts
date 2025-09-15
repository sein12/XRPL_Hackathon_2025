import { api } from "./axios";

export type SignupBody = {
  name?: string; // UI 필드 상 이름(서버에 안 보낼 수도 있으니 선택)
  email?: string | "";
  username: string;
  password: string;
  passwordConfirm: string;
  walletAddr?: string | null;
};

export type LoginBody = { username: string; password: string };

export async function signup(body: SignupBody) {
  // 서버 스키마는 username/password/passwordConfirm/email만 사용
  const res = await api.post("/auth/signup", {
    username: body.username,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    email: body.email ?? "",
  });
  return res.data.user as {
    id: string;
    username: string;
    email?: string | null;
    walletAddr?: string | null;
  };
}

export async function login(body: LoginBody) {
  const res = await api.post("/auth/login", body);
  return res.data as {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email?: string | null;
      walletAddr?: string | null;
    };
  };
}
