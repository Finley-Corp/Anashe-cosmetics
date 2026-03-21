"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const QUIZ_DATA = [
  { q: "What is your skin type?", type: "single", opts: [{i:"✨",l:"Oily"}, {i:"💧",l:"Dry"}, {i:"🌿",l:"Combination"}, {i:"🌸",l:"Sensitive"}] },
  { q: "What are your main concerns?", type: "multi", opts: [{l:"Acne"}, {l:"Dark Spots"}, {l:"Wrinkles"}, {l:"Dehydration"}, {l:"Pores"}] },
  { q: "What results do you desire?", type: "multi", opts: [{l:"Glowy Skin"}, {l:"Smooth Texture"}, {l:"Anti-aging"}, {l:"Even Tone"}] }
];

export const QuizSection = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelect = (val: string, isSingle: boolean) => {
    setAnswers(prev => {
      const current = prev[step] || [];
      if (isSingle) return { ...prev, [step]: [val] };
      const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
      return { ...prev, [step]: next };
    });
  };

  const currentOpts = answers[step] || [];

  return (
    <section id="quiz" className="py-24 px-6 lg:px-20 bg-[#1e1f1e] relative border-t border-white/5">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(180,181,223,0.04)_0%,transparent_65%)] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-anashe-lila font-normal mb-3">
            <Icon icon="solar:magic-stick-3-linear" /> IA-Powered
          </div>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-white line-height-[1.2]">
            Your <em className="text-anashe-peach not-italic">personalized</em> ritual
          </h2>
          <p className="text-sm text-white/50 mt-4 max-w-lg mx-auto font-light">
            Answer 3 questions. Our AI generates your complete K-Beauty ritual with specific products for your profile.
          </p>
        </div>
        
        <div className="bg-[#252726]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-12 min-h-[460px] flex flex-col transition-all duration-500 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!result ? (
              !isGenerating ? (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex justify-center gap-2 mb-10">
                    {QUIZ_DATA.map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          i < step ? "w-6 bg-anashe-mint" : i === step ? "w-10 bg-anashe-lila" : "w-6 bg-white/10"
                        )}
                      />
                    ))}
                  </div>

                  <div className="text-2xl lg:text-3xl font-light tracking-tight text-center text-white mb-10">
                    {QUIZ_DATA[step].q}
                  </div>

                  <div className={cn(
                    "grid gap-3 mb-10",
                    QUIZ_DATA[step].type === 'single' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
                  )}>
                    {QUIZ_DATA[step].opts.map((o) => {
                      const isSelected = currentOpts.includes(o.l);
                      return (
                        <button 
                          key={o.l}
                          onClick={() => handleSelect(o.l, QUIZ_DATA[step].type === 'single')}
                          className={cn(
                            "p-4 md:p-6 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 font-light text-sm",
                            isSelected 
                              ? "bg-anashe-lila/10 border-anashe-lila text-anashe-lila" 
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30"
                          )}
                        >
                          {(o as any).i && <span className="text-2xl">{(o as any).i}</span>}
                          {o.l}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <button 
                      className={cn("text-xs font-normal tracking-widest uppercase text-white/40 hover:text-white transition-colors px-4 py-2", step === 0 && 'invisible')}
                      onClick={() => setStep(prev => prev - 1)}
                    >
                      ← Back
                    </button>
                    <button 
                      className={cn(
                        "text-xs font-normal tracking-widest uppercase rounded-lg px-8 py-4 transition-all duration-300",
                        currentOpts.length > 0 ? "bg-white text-anashe-bg hover:bg-anashe-lila hover:-translate-y-0.5 shadow-lg" : "bg-white/5 text-white/30 pointer-events-none"
                      )}
                      onClick={() => {
                        if (step < QUIZ_DATA.length - 1) setStep(prev => prev + 1);
                        else {
                          setIsGenerating(true);
                          setTimeout(() => {
                            setIsGenerating(false);
                            setResult({ type: answers[0][0] });
                          }, 2000);
                        }
                      }}
                    >
                      {step === QUIZ_DATA.length - 1 ? 'Generate Ritual ✦' : 'Next →'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center m-auto"
                >
                  <div className="text-4xl text-anashe-lila mb-4 animate-[spinRing_1.5s_linear_infinite]">
                    <Icon icon="solar:stars-line-duotone" />
                  </div>
                  <div className="text-lg font-light text-white">Creating your ritual...</div>
                </motion.div>
              )
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col h-full"
              >
                <div className="text-center mb-8 border-b border-white/10 pb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anashe-lila/10 border border-anashe-lila/30 text-[10px] tracking-widest uppercase text-anashe-lila font-normal mb-4">
                    ✦ Ritual for {result.type} skin
                  </div>
                  <h3 className="text-2xl font-light text-white">Anashe Recommendation</h3>
                </div>
                <div className="flex justify-center mt-auto">
                  <button 
                    className="text-xs font-normal tracking-widest uppercase text-white/50 hover:text-white border border-white/20 rounded-lg px-6 py-3 transition-colors"
                    onClick={() => { setStep(0); setAnswers({}); setResult(null); }}
                  >
                    ↺ Restart
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
