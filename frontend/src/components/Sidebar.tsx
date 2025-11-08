import React from 'react'
import { Link } from "react-router"
import { IconPlus, IconMenu2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button'

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]
      ${collapsed ? "w-20" : "w-[17vw]"} transition-all duration-300 bg-white z-10`}
    >
      <div className="shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <span className="text-3xl font-semibold">InterReview</span>}
        <Button size="icon" variant="secondary" onClick={() => setCollapsed(!collapsed)}>
          <IconMenu2 />
        </Button>
      </div>

      {!collapsed && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-center items-center space-x-2">
            <span className="font-medium">Add Attempt</span>
            <Button size="icon" variant="secondary">
              <Link to="/create">
                <IconPlus />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {Array.from({ length: 20 }).map((_, idx) => (
          <div
            key={idx}
            className={`p-2 bg-gray-100 rounded mb-2 ${
              collapsed ? "text-center" : ""
            }`}
          >
            {!collapsed ? `Item ${idx + 1}` : idx + 1}
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-black">
          <span className="text-sm">Happy prep, username</span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;