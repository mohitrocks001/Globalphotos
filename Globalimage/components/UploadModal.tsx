
import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { analyzeImage } from '../services/geminiService';
import { Candidate } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (candidate: Omit<Candidate, 'id' | 'votes' | 'timestamp'>) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !name) return;

    setIsAnalyzing(true);
    // Use Gemini to get critique and vibe
    const aiData = await analyzeImage(image);
    
    onSubmit({
      name,
      description: description || "New entry in the gallery.",
      imageUrl: image,
      vibeScore: aiData.vibeScore,
      aiCritique: aiData.critique,
      tags: aiData.tags
    });

    setIsAnalyzing(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">Enter the Contest</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="space-y-6">
            {/* Image Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer transition-all ${
                image ? 'border-zinc-200 p-2' : 'border-zinc-200 hover:border-black bg-zinc-50'
              }`}
            >
              {image ? (
                <div className="relative w-full h-full group">
                  <img src={image} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Change Photo</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                    <Upload className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900">Click to upload photo</p>
                  <p className="text-xs text-zinc-500 mt-1">High quality JPEGs or PNGs</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Candidate Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunset Serenity"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us the story behind this picture..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              className="w-full gap-2 py-4 text-base rounded-2xl shadow-lg"
              disabled={!image || !name || isAnalyzing}
              isLoading={isAnalyzing}
            >
              <Sparkles className="w-5 h-5" />
              {isAnalyzing ? 'AI is analyzing your masterpiece...' : 'Submit Entry'}
            </Button>
            <p className="text-center text-[10px] text-zinc-400 mt-4 px-8 leading-relaxed">
              By submitting, you agree to our terms of service. Our AI (Gemini) will automatically review and critique your submission.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
