
import React, { useState, useEffect, useMemo } from 'react';
import { Camera, LayoutGrid, Trophy, ArrowUpDown, PlusCircle, Search, TrendingUp, LogIn, LogOut, CheckCircle2, Twitter, User as UserIcon } from 'lucide-react';
import { Candidate, SortOption, VoteState, User } from './types';
import { INITIAL_CANDIDATES } from './data/mockCandidates';
import { CandidateCard } from './components/CandidateCard';
import { UploadModal } from './components/UploadModal';
import { LoginModal } from './components/LoginModal';
import { UserProfile } from './components/UserProfile';
import { Button } from './components/Button';

type View = 'home' | 'profile';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [voteState, setVoteState] = useState<VoteState>(() => {
    const saved = localStorage.getItem('voteState');
    return saved ? JSON.parse(saved) : { hasVotedFor: [] };
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<View>('home');
  const [sortOption, setSortOption] = useState<SortOption>('votes');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginToast, setShowLoginToast] = useState(false);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('voteState', JSON.stringify(voteState));
  }, [voteState]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  const handleVote = (id: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (voteState.hasVotedFor.includes(id)) return;

    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, votes: c.votes + 1 } : c
    ));
    setVoteState(prev => ({
      hasVotedFor: [...prev.hasVotedFor, id]
    }));
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const handleAddCandidate = (newCandidateData: Omit<Candidate, 'id' | 'votes' | 'timestamp'>) => {
    const newCandidate: Candidate = {
      ...newCandidateData,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0,
      timestamp: Date.now()
    };
    setCandidates(prev => [newCandidate, ...prev]);
  };

  const sortedCandidates = useMemo(() => {
    let filtered = candidates.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (sortOption === 'votes') return b.votes - a.votes;
      if (sortOption === 'newest') return b.timestamp - a.timestamp;
      if (sortOption === 'oldest') return a.timestamp - b.timestamp;
      return 0;
    });
  }, [candidates, sortOption, searchQuery]);

  const topThree = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 3);

  if (currentView === 'profile' && user) {
    return (
      <UserProfile 
        user={user} 
        candidates={candidates} 
        voteState={voteState} 
        onBack={() => setCurrentView('home')} 
        onVote={handleVote}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#FBFBFE]">
      {/* Login Toast */}
      {showLoginToast && (
        <div className="fixed top-24 right-6 z-[100] bg-zinc-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <div className="bg-emerald-500 p-1 rounded-full">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Successfully Logged In</p>
            <p className="text-[10px] text-zinc-400">Welcome back, @{user?.handle}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
              <Camera className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter">PICVOTE</span>
          </div>

          <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-2 w-96 group focus-within:border-zinc-300 transition-colors">
            <Search className="w-4 h-4 text-zinc-400 mr-2 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search candidates or tags..."
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden sm:flex border-zinc-200" onClick={() => setIsUploadModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Enter Contest
            </Button>
            
            <div className="h-8 w-[1px] bg-zinc-100 mx-1 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-3 bg-zinc-50 p-1 pr-1 rounded-full border border-zinc-100">
                <button 
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-3 pl-2 group"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-100 transition-transform group-hover:scale-105" />
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] font-black text-zinc-900 leading-none group-hover:text-indigo-600 transition-colors">@{user.handle}</p>
                  </div>
                </button>
                <button onClick={handleLogout} className="p-1.5 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                className="gap-2 bg-black rounded-full px-5"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-16 pb-12 max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-zinc-100 px-4 py-1.5 rounded-full text-[10px] font-black text-zinc-600 mb-6 tracking-widest uppercase border border-zinc-200">
            <TrendingUp className="w-3 h-3 text-black" /> 
            Active Contest 2025
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.85] mb-8">
            Global Photo <br /> <span className="text-zinc-300">Showdown.</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed mb-10">
            Securely vote for your favorite visual stories. Join thousands of creators in the ultimate gallery contest verified by X.
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-12 h-12 rounded-full border-4 border-[#FBFBFE] shadow-sm bg-white" />
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-[#FBFBFE] bg-zinc-900 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                +2.4k
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-zinc-900">2,482 Voters Today</p>
              <p className="text-xs text-zinc-400">Join the movement</p>
            </div>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <section className="px-6 py-8 border-y border-zinc-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-black" />
              <span className="font-black text-sm uppercase tracking-tight">Gallery</span>
              <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">{candidates.length}</span>
            </div>
            <div className="h-6 w-[1px] bg-zinc-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-6">
              {['All', 'Nature', 'Urban', 'Minimalist', 'Cozy'].map(tab => (
                <button key={tab} className={`text-sm font-bold transition-all ${tab === 'All' ? 'text-black underline underline-offset-8 decoration-2' : 'text-zinc-400 hover:text-black'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100 px-4 py-2 rounded-2xl border border-zinc-200">
              <ArrowUpDown className="w-4 h-4 text-zinc-400" />
              <select 
                className="bg-transparent text-xs font-black text-zinc-900 outline-none cursor-pointer uppercase tracking-wider"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="votes">Top Rated</option>
                <option value="newest">Latest Entries</option>
                <option value="oldest">Classic First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="px-6 py-16 max-w-7xl mx-auto">
        {sortedCandidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sortedCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onVote={handleVote}
                hasVoted={voteState.hasVotedFor.includes(candidate.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-zinc-50 rounded-[40px] flex items-center justify-center mb-8 border border-zinc-100 shadow-inner">
              <Search className="w-10 h-10 text-zinc-200" />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">No masterpieces match your search</h3>
            <p className="text-zinc-500 mt-3 max-w-sm mx-auto">Try different keywords or browse our top rated categories.</p>
            <Button className="mt-10 rounded-2xl" variant="outline" onClick={() => { setSearchQuery(''); setSortOption('votes'); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <Button 
          variant="primary" 
          size="lg" 
          className="shadow-2xl rounded-full px-10 py-5 gap-3 border-[6px] border-[#FBFBFE] bg-black"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <PlusCircle className="w-6 h-6" />
          Join Contest
        </Button>
      </div>

      <footer className="mt-32 py-20 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                <Camera className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter">PICVOTE</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              The premium platform for digital creators. Verified by X, powered by Gemini.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black text-zinc-900 mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
              <a href="#" className="hover:text-black transition-colors">Contest Rules</a>
              <a href="#" className="hover:text-black transition-colors">Past Winners</a>
              <a href="#" className="hover:text-black transition-colors">AI Analysis</a>
              <a href="#" className="hover:text-black transition-colors">Contact Support</a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black text-zinc-900 mb-6 uppercase tracking-widest text-xs">Stay Verified</h4>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="rounded-2xl border-zinc-200 py-3 w-full">
                <Twitter className="w-4 h-4 mr-2" /> Follow Updates
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-50 text-center">
           <p className="text-zinc-300 text-[10px] font-black tracking-widest uppercase">© 2025 PicVote Contest Platform • All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
