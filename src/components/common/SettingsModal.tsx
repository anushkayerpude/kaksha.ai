'use client';

import React, { useState } from 'react';
import { X, Key, CheckCircle, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl p-6 border border-[#e6dfd5] shadow-2xl text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-black/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-[#881337]/10 border border-[#881337]/20 text-[#881337]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Kaksha.ai Integration Settings</h3>
            <p className="text-xs text-slate-500">Configure Gemini 3.8 Flash and Google Workspace tools</p>
          </div>
        </div>

        {/* Gemini API Key Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Gemini API Key (Optional for Custom Topics)
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use built-in verified demo mode)"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-sm focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] transition-all font-mono"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Kaksha.ai operates with 100% verified demo data out-of-the-box. Enter your Google AI Studio API key to research and generate content for any custom educational topic live!
            </p>
          </div>

          {/* Integration Status Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e6dfd5]">
            <div className="p-3 rounded-xl bg-white border border-[#e6dfd5] flex items-center gap-2.5 shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <p className="text-xs font-semibold text-slate-900">Google Search Grounding</p>
                <p className="text-[10px] text-emerald-600 font-medium">Enabled (Gemini Tools)</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#e6dfd5] flex items-center gap-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#881337]" />
              <div>
                <p className="text-xs font-semibold text-slate-900">Model Architecture</p>
                <p className="text-[10px] text-[#881337] font-medium">gemini-3.8-flash</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d9488]/10 border border-[#0d9488]/20 text-[11px] text-slate-700 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
            <span>
              Google Docs, Google Slides, and Google Forms exports are equipped with both live Google API endpoints and full in-browser visual renderers.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-md transition-all"
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                Saved!
              </>
            ) : (
              'Save Key & Close'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
