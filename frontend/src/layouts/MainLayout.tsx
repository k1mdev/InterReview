import React, { useState, type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "5rem" : "17vw";

return (
  <div className="bg-blue-500 flex transition-all duration-300 h-screen">
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

    <main
      className="bg-yellow-500 flex flex-col items-center justify-start w-full transition-all duration-300"
      style={{
        marginLeft: sidebarWidth,
      }}
    >
      {children}
    </main>
  </div>
    );

};

export default MainLayout;
