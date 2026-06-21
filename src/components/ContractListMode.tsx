import React, { useState } from "react";
import { ArrowLeft, RefreshCw, FileText, Globe, CheckCircle, AlertTriangle, XCircle, Search, Mail } from "lucide-react";
import { CompanyAnalysisResponse, ContractOpportunity, MatchDetail } from "../types";

interface Props {
  analysis: CompanyAnalysisResponse;
  opportunities: ContractOpportunity[];
  onBack: () => void;
  onSelectContract: (contract: ContractOpportunity, match: MatchDetail) => void;
}

export default function ContractListMode({ analysis, opportunities, onBack, onSelectContract }: Props) {
  const [editedEmails, setEditedEmails] = useState<Record<string, string>>({});
  const [oppsWithActiveNotif, setOppsWithActiveNotif] = useState<Record<string, string>>({});
  const [globalEmail, setGlobalEmail] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  // Join opportunity objects with match scores
  const matchedData = opportunities.map(opp => {
    const match = analysis.matches.find(m => m.noticeId === opp.noticeId) || {
      noticeId: opp.noticeId,
      score: 15,
      overlap: ["General service matching"],
      gaps: ["Detailed specifications overlap required"],
      recommendations: ["Perform general capability development"]
    };
    return { opp, match };
  }).sort((a, b) => b.match.score - a.match.score);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "bg-emerald-50 text-emerald-800 border-emerald-200", ring: "ring-emerald-500", text: "text-emerald-600", dot: "bg-emerald-500" };
    if (score >= 50) return { bg: "bg-amber-50 text-amber-800 border-amber-200", ring: "ring-amber-500", text: "text-amber-600", dot: "bg-amber-500" };
    return { bg: "bg-rose-50 text-rose-800 border-rose-200", ring: "ring-rose-500", text: "text-rose-600", dot: "bg-rose-500" };
  };

  return (
    <div className="space-y-6">
      {/* Back navigation & Company Header summary */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-sans text-usa-blue hover:text-red-700 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to URL Entry
        </button>
        <span className="text-xs font-mono text-gray-500">
          Source Analysis Domain • Calculated by Gemini AI
        </span>
      </div>

      {/* Corporate Capability Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 relative overflow-hidden">
        {/* Subtle accent line on left */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-usa-blue" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 pl-2">
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-usa-blue tracking-widest font-sans flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-usa-red" /> Corporate Capabilities Profile
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-950">
              {analysis.companyName}
            </h2>
            <p className="text-sm text-gray-500 font-sans max-w-2xl font-normal leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-1.5 bg-gray-50 border border-gray-200 px-4 py-3 rounded text-xs font-sans min-w-[200px]">
            <span className="text-gray-400 font-semibold border-b border-gray-200 pb-1 uppercase tracking-wide text-[10px]">
              Assessed Industry sectors
            </span>
            {analysis.industries.map((ind, i) => (
              <span key={i} className="text-gray-700 flex items-center gap-1.5 font-medium font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-usa-red" />
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-serif text-usa-blue font-bold tracking-tight">
          FEDERAL BIDS MATRIX ANALYSIS
        </h3>
        <p className="text-xs text-gray-500 font-sans mt-0.5">
          👉 <strong className="font-semibold text-usa-blue">Double-click on any contract card</strong> (or click 'Deep Gap Analysis') to view gaps and generate custom templates.
        </p>
      </div>

      {/* Global Email Alert Signup Box */}
      <div className="bg-[#002868] text-white rounded-lg border border-navy-800 shadow-md p-5 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#D4AF37]" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 pl-2">
          <div className="space-y-1">
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              Federal Bid Notification Alerts
            </h4>
            <p className="text-xs text-slate-200 max-w-xl">
              Stay updated on new matching government contracts. Enter your email below to subscribe to custom automated matching reports.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {isSignedUp ? (
              <div className="flex items-center gap-2 bg-[#001233] px-4 py-2.5 rounded border border-emerald-500/30 text-emerald-400 font-sans text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed successfully with <strong className="font-mono text-white font-semibold">{globalEmail}</strong>!</span>
                <button
                  onClick={() => setIsSignedUp(false)}
                  className="text-slate-400 hover:text-white underline font-semibold cursor-pointer ml-2 text-[10px] uppercase font-sans"
                >
                  Change
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!globalEmail.trim() || !globalEmail.includes("@")) {
                    alert("Please enter a valid email address.");
                    return;
                  }
                  setIsSignedUp(true);
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={globalEmail}
                  onChange={(e) => setGlobalEmail(e.target.value)}
                  className="bg-[#001233] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] w-full sm:w-64 font-sans font-medium"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#BF0A30] hover:bg-red-700 active:scale-95 text-white font-sans text-xs font-bold uppercase tracking-wider px-4 py-2 rounded shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* The Matched list */}
      <div className="space-y-4">
        {matchedData.map(({ opp, match }) => {
          const style = getScoreColor(match.score);
          const leftBorderColor = match.score >= 80 ? "border-l-usa-blue" : match.score >= 50 ? "border-l-gray-300" : "border-l-gray-200 opacity-80";
          return (
            <div
              key={opp.noticeId}
              onDoubleClick={() => onSelectContract(opp, match)}
              className={`bg-white rounded border border-gray-200 border-l-4 ${leftBorderColor} shadow-sm hover:shadow transition-all duration-200 cursor-pointer select-none group`}
              title="Double click to perform deep analysis"
            >
              <div className="p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
                {/* Contract Core Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#EEF2FF] text-[#002868] text-[10px] font-sans font-bold px-2 py-0.5 rounded">
                      {match.score}% MATCH
                    </span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-mono">
                      ID: {opp.noticeId.slice(0, 8)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Posted: {opp.postedDate}</span>
                  </div>

                  <h4 className="text-base font-bold text-gray-950 group-hover:text-usa-blue transition-colors line-clamp-1">
                    {opp.title}
                  </h4>

                  <p className="text-xs text-gray-500 font-sans font-normal uppercase truncate max-w-2xl">
                    Dept: {opp.fullParentPathName.split(".").slice(-2).join(" • ") || opp.fullParentPathName}
                  </p>
                </div>

                {/* Score & Call to Action side */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-right font-sans hidden sm:block">
                    <div className="text-[9px] uppercase tracking-wider text-gray-400">Class Code</div>
                    <div className="text-xs font-bold text-gray-700">{opp.classificationCode}</div>
                  </div>

                  <button
                    onClick={() => onSelectContract(opp, match)}
                    className="bg-usa-blue hover:bg-usa-blue/90 uppercase tracking-widest text-[10px] text-white font-sans font-bold py-2 px-3.5 rounded transition cursor-pointer"
                  >
                    Deep Gap Analysis
                  </button>
                </div>
              </div>

              {/* Collapsed capability overlap snippet view to make cards detailed */}
              <div className={`bg-slate-50/50 px-5 py-2.5 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 font-sans ${match.score >= 80 ? "rounded-b" : ""}`}>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-gray-700">Overlap Profile:</span>
                  <span className="text-gray-500 truncate max-w-[200px] md:max-w-[400px]">
                    {match.overlap[0] || "Found capabilities fit specification matches."}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-gray-700 font-sans">Required:</span>
                  <span className="text-gray-500 truncate max-w-[200px] md:max-w-[400px]">
                    {match.recommendations[0] || "Address primary registration standards."}
                  </span>
                </div>
              </div>

              {/* Interactive Email Subscription alert bar if under 80% match */}
              {match.score < 80 && (
                oppsWithActiveNotif[opp.noticeId] ? (
                  <div className="bg-emerald-50/40 border-t border-emerald-100 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-800 font-sans rounded-b">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Email alert activated for <strong className="font-semibold text-emerald-950 font-mono">{oppsWithActiveNotif[opp.noticeId]}</strong>. We'll send you better matching targets as they post!
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOppsWithActiveNotif(prev => {
                          const copy = { ...prev };
                          delete copy[opp.noticeId];
                          return copy;
                        });
                      }}
                      className="text-gray-400 hover:text-gray-650 font-bold px-2 py-1 text-[10px] uppercase font-sans cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="bg-indigo-50/40 border-t border-[#EEF2FF] px-5 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-gray-700 font-sans rounded-b">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-usa-blue shrink-0 animate-pulse" />
                      <span>
                        Fit is less than 80%. Subscribe to email alerts for contracts that match your capabilities statement better.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="email"
                        placeholder="Configure alert email"
                        value={editedEmails[opp.noticeId] !== undefined ? editedEmails[opp.noticeId] : "MarkDVek@gmail.com"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditedEmails(prev => ({ ...prev, [opp.noticeId]: val }));
                        }}
                        className="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-usa-blue w-full md:w-44 font-medium"
                      />
                      <button
                        onClick={() => {
                          const parsedEmail = editedEmails[opp.noticeId] !== undefined ? editedEmails[opp.noticeId] : "MarkDVek@gmail.com";
                          if (!parsedEmail.trim() || !parsedEmail.includes("@")) {
                            alert("Please enter a valid email address.");
                            return;
                          }
                          setOppsWithActiveNotif(prev => ({ ...prev, [opp.noticeId]: parsedEmail.trim() }));
                        }}
                        className="bg-usa-blue hover:bg-usa-blue/90 text-[10px] font-sans font-bold uppercase tracking-wider text-white px-3 py-1.5 rounded transition shrink-0 cursor-pointer"
                      >
                        Set Alert
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
