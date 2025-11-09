import React, { useState, useEffect } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router"
import { useAuth } from '@/auth/AuthProvider';

const Sidebar = () => {
  const { getSession } = useAuth();
  const { logOut, user } = useAuth();
  interface Attempt {
    attempt_id: string;
    question: string;

  }
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
  if (!user) return;

  const fetchAttempts = async () => {
    try {
      const session = await getSession();
      const uid = session?.data?.session?.user?.id;
      if (!uid) return;

      const res = await fetch(`http://localhost:5000/api/attempt?user_id=${encodeURIComponent(uid)}`);

      const json = await res.json();

      if (json.status === 'success' && Array.isArray(json.data)) {
        setAttempts(json.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchAttempts();
}, [user]);



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
        {attempts.map((attempt) => {
          const isSelected = attempt.attempt_id === selectedId;
          return (
            <Link
              key={attempt.attempt_id}
              to={`/analysis/${attempt.attempt_id}`}
              onClick={() => {
                const newSelectedId = isSelected ? null : attempt.attempt_id;
                setSelectedId(newSelectedId);
                console.log("Selected ID:", newSelectedId); // <-- log here
              }}
              className={`
                p-2 rounded mb-2 cursor-pointer
                ${isSelected ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-100 hover:bg-gray-200"}
                transition-colors duration-200
                truncate
              `}
              title={attempt.question}
            >
              {attempt.question}
            </Link>
          );
        })}
        {attempts.length === 0 && (
          <div className="text-sm text-gray-500">No attempts yet.</div>
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
