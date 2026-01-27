import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {!hideNav && <Sidebar />}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
