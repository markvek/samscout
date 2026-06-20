import React, { useState } from "react";
import { Search, Globe, Star, ShieldAlert, Sparkles, Compass } from "lucide-react";

interface Props {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  demoUrl: string;
  loadingProgress?: number;
}

const STEPS = [
  "Resolving corporate domain DNS assets...",
  "Running site text parser vectors...",
  "Compiling capability statement parameters...",
  "Analyzing core technology stack alignments...",
  "Querying active SAM.gov solicitations registry...",
  "Calibrating percentage matchmaking matrices...",
  "Running critical requirements gap analysis...",
  "Drafting preliminary cover letters and RFP summaries..."
];

export default function SearchHero({ onAnalyze, isLoading, demoUrl, loadingProgress }: Props) {
  const [url, setUrl] = useState(demoUrl);
  const [error, setError] = useState("");
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  React.useEffect(() => {
    if (isLoading && loadingProgress !== undefined) {
      const stepIdx = Math.min(
        Math.floor((loadingProgress / 100) * STEPS.length),
        STEPS.length - 1
      );
      setCurrentStepIdx(stepIdx);
    }
  }, [isLoading, loadingProgress]);

  React.useEffect(() => {
    if (demoUrl) {
      setUrl(demoUrl);
    }
  }, [demoUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please input a valid company URL");
      return;
    }

    let parsedUrl = url.trim();
    if (!/^https?:\/\//i.test(parsedUrl)) {
      parsedUrl = "https://" + parsedUrl;
    }

    try {
      new URL(parsedUrl);
    } catch {
      setError("Entered text does not conform to a valid URL string.");
      return;
    }

    onAnalyze(parsedUrl);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 relative shadow-sm overflow-hidden px-6 py-12 md:py-16 text-center text-slate-900">
      {/* Visual top accent bar from minimalism */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-usa-blue" />
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          {/* Minimalism-style Tag */}
          <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-3.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 mb-4">
            <Compass className="w-3.5 h-3.5 text-usa-red" />
            Dynamic Site Parser Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-semibold tracking-tight leading-tight text-usa-blue">
            Evaluate Your Match Against <br />
            <span className="font-serif italic text-usa-red">
              U.S. Government Contracts
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-sans max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Scan your organization’s capabilities from any URL. Instantly map compatibility, calculate exact percentage scores, and perform comprehensive gap deep-dives.
          </p>
        </div>

        {/* URL Form Input */}
        {!isLoading ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-gray-50 p-2 border border-gray-200 rounded shadow-inner">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., https://spacex.com"
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border border-gray-200 focus:border-usa-blue/50 focus:ring-1 focus:ring-usa-blue rounded text-sm outline-none font-sans font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-usa-blue hover:bg-usa-blue/90 active:scale-95 text-white font-sans text-xs font-bold uppercase tracking-wider px-7 py-3 rounded transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                Analyze Company
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 justify-center text-usa-red text-xs font-mono">
                <ShieldAlert className="w-4 h-4 text-usa-red fill-white" />
                {error}
              </div>
            )}
          </form>
        ) : (
          /* Animated Loader with status updates */
          <div className="max-w-md mx-auto py-6">
            <div className="relative flex justify-center mb-6">
              <span className="relative flex h-12 w-12">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-usa-red opacity-20"></span>
                <span className="relative inline-flex rounded-full h-12 w-12 bg-white border border-gray-200 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-usa-blue animate-bounce" />
                </span>
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-sans text-usa-blue tracking-widest font-bold uppercase animate-pulse">
                GEMINI INTELLECTUAL MATCHMAKER ACTIVE
              </h4>
              <p className="text-xs text-gray-500 font-mono italic">
                "{STEPS[currentStepIdx]}"
              </p>
              
              {/* Real 1-time progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-3 max-w-xs mx-auto border border-gray-200 relative">
                <div 
                  className="bg-usa-blue h-full transition-all duration-300"
                  style={{ width: `${loadingProgress ?? 0}%` }}
                />
              </div>
              <div className="text-[10px] tracking-widest text-usa-blue font-mono font-bold mt-1">
                {loadingProgress ?? 0}% COMPLETE
              </div>
            </div>
          </div>
        )}

        {/* SamScout Product Overview Sections */}
        {!isLoading && (
          <div className="mt-12 pt-10 border-t border-gray-150 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-usa-blue" />
                <div className="space-y-2.5">
                  <div className="text-[10px] tracking-widest text-[#002868] font-mono font-bold uppercase">
                    1.1. Scan Your Digital Twin
                  </div>
                  <h4 className="text-sm font-sans font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="bg-[#EEF2FF] text-usa-blue text-[9px] font-sans px-1.5 py-0.5 rounded uppercase font-bold">Takes 10 Seconds</span>
                  </h4>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    Simply drop your company website URL into <strong>SamScout</strong>. Our background agents instantly analyze your product capabilities, engineering tech stack, and marketing text to build a secure, comprehensive business profile. No lengthy forms or complex codes required.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-usa-blue" />
                <div className="space-y-2.5">
                  <div className="text-[10px] tracking-widest text-[#002868] font-mono font-bold uppercase">
                    2.2. See Your Match &amp; Gap Analysis
                  </div>
                  <h4 className="text-sm font-sans font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="bg-[#EEF2FF] text-usa-blue text-[9px] font-sans px-1.5 py-0.5 rounded uppercase font-bold text-usa-blue">Deep Text Analysis</span>
                  </h4>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    <strong>SamScout</strong> cross-references your profile against active SAM.gov opportunities using Gemma 4. You get an instant percentage match score (e.g., 92% Match). Double-click any contract card to see a precise gap analysis showing exactly what you fulfill and what compliance or tech requirements you still need to build.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-usa-blue" />
                <div className="space-y-2.5">
                  <div className="text-[10px] tracking-widest text-[#002868] font-mono font-bold uppercase">
                    3.3. Continuous Scouting &amp; Alerts
                  </div>
                  <h4 className="text-sm font-sans font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="bg-[#EEF2FF] text-usa-blue text-[9px] font-sans px-1.5 py-0.5 rounded uppercase font-bold text-usa-blue">Premium Tier Feature</span>
                  </h4>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    Lock in your target criteria and let <strong>SamScout</strong> run on autopilot. The moment a new software or infrastructure contract hits the federal registry that perfectly matches your team's capability, you'll be the first to receive an instant email or Slack alert so you can submit your bid ahead of the competition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
