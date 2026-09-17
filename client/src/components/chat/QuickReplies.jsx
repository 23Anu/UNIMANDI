import React from "react";
import { Zap } from "lucide-react";

const QUICK_PROMPTS = [
  "Is this still available?",
  "Can we meet near SAC / Library?",
  "Can you do a quick student discount?",
  "Is the condition good?",
  "I can pick it up today after class!",
  "What time are you free?",
];

export const QuickReplies = ({ onSelectPrompt }) => {
  return (
    <div className="py-2.5 px-3.5 border-t border-slate-150 bg-slate-50/90 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 shrink-0 pr-1">
        <Zap className="w-3 h-3 text-[#FF5A1F]" />
        <span>Quick:</span>
      </div>
      {QUICK_PROMPTS.map((prompt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectPrompt(prompt)}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-[11px] font-medium text-slate-700 hover:text-[#FF5A1F] border border-slate-200 hover:border-[#FF5A1F]/30 whitespace-nowrap transition-all shrink-0 shadow-2xs"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
