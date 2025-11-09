import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router"
import { useAuth } from '@/auth/AuthProvider';

const Sidebar = () => {
  const { logOut, user } = useAuth();
  const questionHeaders = ["Explain how you blah blah blah", "When was a time blah blah blah", "What would you do if blah blah blah", "What is your experience in blah blah blah", "Explain how you blah blah blah", "When was a time blah blah blah", "What would you do if blah blah blah", "What is your experience in blah blah blah"]
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);



  return (
    <div
      className="h-screen flex flex-col w-[17vw] transition-all duration-300 bg-white shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]"
    >
      <div className="shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
        <span className="text-3xl font-semibold">InterReview</span>
      </div>

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

      <div className="flex-1 overflow-y-auto p-4">
        {questionHeaders.map((header, idx) => {

          const isSelected = idx === selectedIndex;
          return (
            <div
              key={idx}
              onClick={() => {
                if (isSelected) {
                  setSelectedIndex(null);
                } else {
                  setSelectedIndex(idx);
                }
              }}
              className={`
                p-2 rounded mb-2 cursor-pointer
                ${isSelected ? "bg-gray-400" : "bg-gray-100"}
                hover:bg-gray-200
                transition-colors duration-200
                truncate
              `}
            >
              {header}
            </div>
          )

        }
          

        )}
      </div>

      <div className="p-4 border-t border-black">
        <span className="text-sm">Happy prep, {user?.email}</span>
        <button 
            className='text-red-600 border border-red-600 rounded-md p-1 mt-2 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95' 
            onClick={logOut}>Log Out</button>
      </div>
    </div>
  );
};

export default Sidebar;
