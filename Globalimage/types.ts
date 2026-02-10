
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export interface Candidate {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
  description: string;
  vibeScore?: number;
  aiCritique?: string;
  tags: string[];
  timestamp: number;
}

export type SortOption = 'votes' | 'newest' | 'oldest';

export interface VoteState {
  hasVotedFor: string[];
}
