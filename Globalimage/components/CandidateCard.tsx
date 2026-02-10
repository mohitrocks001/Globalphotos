
import React from 'react';
import { Candidate } from '../types';
import { Heart, Tag, Star, Award } from 'lucide-react';
import { Button } from './Button';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (id: string) => void;
  hasVoted: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onVote, hasVoted }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-300 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={candidate.imageUrl}
          alt={candidate.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {candidate.vibeScore && (
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {candidate.vibeScore}% Vibe
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
          {candidate.tags.map(tag => (
            <span key={tag} className="bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{candidate.name}</h3>
            <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{candidate.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-black">{candidate.votes}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Votes</span>
          </div>
        </div>

        {candidate.aiCritique && (
          <div className="mt-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100 italic text-xs text-zinc-600 relative">
            <Award className="absolute -top-2 -right-2 w-5 h-5 text-indigo-500 bg-white rounded-full p-1 border border-zinc-100" />
            "{candidate.aiCritique}"
          </div>
        )}

        <div className="mt-6">
          <Button
            variant={hasVoted ? 'outline' : 'primary'}
            className="w-full gap-2 rounded-2xl py-3"
            onClick={() => onVote(candidate.id)}
            disabled={hasVoted}
          >
            <Heart className={`w-4 h-4 ${hasVoted ? 'fill-zinc-400 text-zinc-400' : 'text-white'}`} />
            {hasVoted ? 'Voted' : 'Cast Vote'}
          </Button>
        </div>
      </div>
    </div>
  );
};
