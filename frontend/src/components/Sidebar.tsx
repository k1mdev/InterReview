import React, { useState, useEffect } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/auth/AuthProvider';
import { motion } from 'framer-motion';

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
}, [user, getSession]);

  const navigate = useNavigate();



  return (
    <aside className="relative h-screen flex flex-col w-[17vw] min-w-[260px] bg-gradient-to-b from-white via-indigo-50 to-gray-50 overflow-hidden shadow-[4px_0_18px_-4px_rgba(0,0,0,0.15)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-60px] left-[-40px] w-48 h-48 bg-blue-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-80px] right-[-40px] w-56 h-56 bg-purple-300/40 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shrink-0 px-5 py-6 border-b border-indigo-100/60 backdrop-blur-sm bg-white/70 flex items-center justify-between"
      >
        <motion.h1
          className="text-2xl font-extrabold tracking-tight cursor-pointer select-none"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          onClick={() => navigate('/')}
        >
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inter
          </span>
          <motion.span
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-[length:200%_200%] bg-clip-text text-transparent"
          >
            Review
          </motion.span>
        </motion.h1>
      </motion.div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-center items-center">
          <Link
            to="/create"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-shadow"
          >
            <span className='text-sm font-medium text-white select-none'>Add Attempt</span>
            <IconPlus className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {attempts.map((attempt) => {
          const isSelected = attempt.attempt_id === selectedId;
          return (
            <motion.div
              key={attempt.attempt_id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                to={`/analysis/${attempt.attempt_id}`}
                onClick={() => {
                  const newSelectedId = isSelected ? null : attempt.attempt_id;
                  setSelectedId(newSelectedId);
                }}
                className={`group block w-full rounded-lg px-3 py-2 text-sm font-medium tracking-tight transition-all border
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-md'
                      : 'bg-white/70 border-indigo-100 hover:border-indigo-300 hover:bg-white shadow-sm'
                  }
                `}
                title={attempt.question}
              >
                <span className="line-clamp-2 leading-snug">
                  {attempt.question}
                </span>
              </Link>
            </motion.div>
          );
        })}
        {attempts.length === 0 && (
          <div className="text-xs text-gray-500 select-none italic">No attempts yet.</div>
        )}
      </div>

      <div className="px-5 py-5 border-t border-indigo-100/60 bg-white/60 backdrop-blur-sm text-xs text-gray-600 space-y-2">
        <div className="truncate select-none">Signed in as {user?.email}</div>
        <Button
          variant="outline"
          onClick={logOut}
          className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 cursor-pointer transition-colors"
        >
          Log Out
        </Button>
        <div className="pt-2 text-[10px] text-gray-400 select-none">© {new Date().getFullYear()} InterReview</div>
      </div>
    </aside>
  );
};

export default Sidebar;
