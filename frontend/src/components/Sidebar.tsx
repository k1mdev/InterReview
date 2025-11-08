import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router"

const Sidebar = () => {
  return (
    <div
      className="fixed top-0 left-0 h-screen flex flex-col w-[17vw] transition-all duration-300 bg-white shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]"
    >
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
        <span className="text-3xl font-semibold">InterReview</span>
      </div>

      {/* Add Attempt Section */}
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

      <div className="w-full border-t border-black"></div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {Array.from({ length: 20 }).map((_, idx) => (
          <div key={idx} className="p-2 bg-gray-100 rounded mb-2">
            {`Item ${idx + 1}`}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-black">
        <span className="text-sm">Happy prep, username</span>
      </div>
    </div>
  );
};

export default Sidebar;
