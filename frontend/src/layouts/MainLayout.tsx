import React, { type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {


  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
    );

};

export default MainLayout;
