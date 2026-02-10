
import React from 'react';
import { User, Candidate, VoteState } from '../types';
import { ArrowLeft, Heart, User as UserIcon, ShieldCheck, History } from 'lucide-react';
import { Button } from './Button';
import { CandidateCard } from './CandidateCard';

interface UserProfileProps {
  user: User;
  candidates: Candidate[];
  voteState: VoteState;
  onBack: () => void;
  onVote: (id: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, candidates, voteState, onBack, onVote }) => {
  const votedCandidates = candidates.filter(c => voteState.hasVotedFor.includes(c.id));

  return (
    <div className="min-h-screen bg-[#FBFBFE] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="bg-white border-b border-zinc-100 pb-12 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Gallery</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] bg-gradient-to-tr from-zinc-100 to-zinc-50 p-1.5 shadow-2xl overflow-hidden border border-zinc-100">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover rounded-[34px] bg-white"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-2xl shadow-xl border-4 border-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                  {user.name}
                </h1>
                <div className="inline-flex self-center md:self-auto bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Verified Curator
                </div>
              </div>
              <p className="text-xl text-zinc-400 font-medium">@{user.handle}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-8 mt-8 pt-8 border-t border-zinc-50">
                <div className="text-center md:text-left">
                  <p className="text-3xl font-black text-black">{voteState.hasVotedFor.length}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Votes Cast</p>
                </div>
                <div className="h-10 w-[1px] bg-zinc-100" />
                <div className="text-center md:text-left">
                  <p className="text-3xl font-black text-black">{new Set(candidates.map(c => c.id)).size}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Available Entries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voted History Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-black rounded-xl">
            <History className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Voting History</h2>
        </div>

        {votedCandidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {votedCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onVote={onVote}
                hasVoted={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-dashed border-zinc-200 py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-[28px] flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-zinc-200" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2">Your history is empty</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mb-10">
              Start exploring the gallery and support your favorite creators to see them here.
            </p>
            <Button variant="primary" onClick={onBack} className="rounded-2xl px-8">
              Explore Gallery
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
