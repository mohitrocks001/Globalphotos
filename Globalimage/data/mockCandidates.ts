
import { Candidate } from '../types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'The Adventurer',
    imageUrl: 'https://picsum.photos/seed/adventure/800/600',
    votes: 42,
    description: 'Caught in the wild, seeking the next summit.',
    tags: ['Nature', 'Epic', 'Outdoor'],
    timestamp: Date.now() - 1000000,
    vibeScore: 92,
    aiCritique: 'This shot perfectly captures the essence of wandering souls. The lighting suggests a dawn of new possibilities.'
  },
  {
    id: '2',
    name: 'Urban Echo',
    imageUrl: 'https://picsum.photos/seed/urban/800/600',
    votes: 28,
    description: 'The city never sleeps, and neither does the style.',
    tags: ['City', 'Modern', 'Style'],
    timestamp: Date.now() - 2000000,
    vibeScore: 88,
    aiCritique: 'Geometric precision meets street energy. A masterclass in modern composition.'
  },
  {
    id: '3',
    name: 'Quiet Coffee',
    imageUrl: 'https://picsum.photos/seed/coffee/800/600',
    votes: 56,
    description: 'Simple moments are the most profound.',
    tags: ['Minimalist', 'Cozy', 'Interior'],
    timestamp: Date.now() - 500000,
    vibeScore: 95,
    aiCritique: 'The warmth is palpable. This image evokes a sense of peace that is rarely captured so effectively.'
  }
];
