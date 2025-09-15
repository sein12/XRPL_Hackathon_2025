// src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import MobileShell from "@/components/layout/MobileShell";
import LoginPage from "@/routes/auth/LoginPage";
import SignupLayout from "@/routes/auth/signup/SignupLayout";
import StepNameEmail from "@/routes/auth/signup/StepNameEmail";
import StepAccount from "@/routes/auth/signup/StepAccount";
import StepWallet from "@/routes/auth/signup/StepWallet";
import StepComplete from "@/routes/auth/signup/StepComplete";

import HomePage from "@/routes/dashboard/HomePage";
// import ProductsPage from "@/routes/dashboard/ProductsPage";
// import ProductDetailPage from "@/routes/dashboard/ProductDetailPage";
// import ContractListPage from "@/routes/dashboard/ContractListPage";
// import ClaimFormPage from "@/routes/dashboard/ClaimFormPage";
// import ClaimDetailPage from "@/routes/dashboard/ClaimDetailPage";

// import NotFound from "@/routes/NotFound";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// 로그인 상태면 dashboard로, 아니면 로그인 페이지
function AuthedRedirect() {
  const { isAuthed } = useAuth();
  return isAuthed ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

// 인증 보호 레이아웃: 통과 시 하위 라우트 렌더
function ProtectedRoute() {
  const { isAuthed } = useAuth();
  return isAuthed ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 로그인 */}
          <Route path="/" element={<AuthedRedirect />} />

          {/* 회원가입 (스텝) */}
          <Route path="/signup" element={<SignupLayout />}>
            <Route index element={<StepNameEmail />} />
            <Route path="account" element={<StepAccount />} />
            <Route path="wallet" element={<StepWallet />} />
            <Route path="complete" element={<StepComplete />} />
          </Route>

          {/* 대시보드 (인증 필요) */}
          <Route element={<ProtectedRoute />}>
            {/* 홈 */}
            <Route path="/dashboard" element={<MobileShell />}>
              <Route index element={<HomePage />} />

              {/* 상품 */}
              {/* <Route
                path="products"
                element={<MobileShell title="보험 상품" backTo={-1} />}
              >
                <Route index element={<ProductsPage />} />
                <Route path=":id" element={<ProductDetailPage />} />
              </Route> */}

              {/* 내 계약 */}
              {/* <Route
                path="contracts"
                element={<MobileShell title="내 계약" backTo={-1} />}
              >
                <Route index element={<ContractListPage />} />
              </Route> */}

              {/* 청구 */}
              {/* <Route
                path="claims"
                element={<MobileShell title="보험 청구" backTo={-1} />}
              >
                <Route index element={<ClaimFormPage />} />
                <Route path=":id" element={<ClaimDetailPage />} />
              </Route>  */}
            </Route>
          </Route>

          {/* Not Found */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
