// src/components/layout/MobileShell.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import BottomNav from "./BottomNav";

interface MobileShellProps {
  showHeader?: boolean;
  title?: string;
  backTo?: string | number;
  children?: React.ReactNode; // ✅ 추가: 직접 children을 넣을 수도 있게
}

export default function MobileShell({
  showHeader = false,
  title,
  backTo = -1,
  children,
}: MobileShellProps) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center">
      {showHeader && (
        <header className="w-full max-w-[420px] flex items-center gap-2 px-4 pt-6">
          {backTo !== undefined && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                typeof backTo === "number" ? nav(backTo) : nav(backTo)
              }
              aria-label="뒤로가기"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
      )}

      <main className="flex-1 w-full max-w-[420px] p-4">
        {children ?? <Outlet />} {/* ✅ children 우선 */}
      </main>

      {pathname.startsWith("/dashboard") && (
        <div className="w-full max-w-[420px]">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
