import React from "react";
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, Compass, Star, ChevronRight, FileCheck, DollarSign, Award, Target, Landmark } from "lucide-react";
import { ContractOpportunity, MatchDetail } from "../types";

interface Props {
  contract: ContractOpportunity;
  match: MatchDetail;
  companyName: string;
  onBack: () => void;
  onUnlockProposal: () => void;
}

export default function GapAnalysisView({ contract, match, companyName, onBack, onUnlockProposal }: Props) {
  const isHighMatch = match.score >= 80;
  const satisfiesRequired = match.score >= 50;

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-sans text-usa-blue hover:text-red-700 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bid Matrix
        </button>
        <div className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-gray-500">
          SOLICITATION REFERENCE: {contract.solicitationNumber}
        </div>
      </div>

      {/* Contract Detail Header Banner */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="p-6 bg-white relative border-b border-gray-150">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60">
            <span className="w-2 h-2 rounded-full bg-usa-red" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500">SECURE BIDDER FILE</span>
          </div>
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-[#EEF2FF] text-usa-blue text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {contract.type}
              </span>
              <span className="text-gray-400 text-[11px] font-mono">DLA Registry ID: {contract.noticeId.slice(0, 16)}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-serif font-black text-usa-blue max-w-4xl tracking-tight leading-tight">
              {contract.title}
            </h2>

            <div className="pt-1 text-xs text-gray-500 font-sans flex flex-wrap gap-x-6 gap-y-2 items-center">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-gray-700">
                <Landmark className="w-3.5 h-3.5 text-usa-blue" />
                {contract.fullParentPathName.split(".").slice(-2).join(" • ") || contract.fullParentPathName}
              </span>
              <span className="text-gray-300">•</span>
              <span>NAICS Standard: <strong className="font-semibold text-gray-700">{contract.naicsCode || "N/A"}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Class: <strong className="font-semibold text-gray-700">{contract.classificationCode || "N/A"}</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic match diagnostic bar */}
        <div className="bg-gray-50/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              {/* Score label badge */}
              <div className={`px-3 py-1.5 rounded text-xs font-sans font-bold border ${isHighMatch ? "bg-emerald-50 border-emerald-200 text-emerald-800" : satisfiesRequired ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                {match.score}% MATCH MATCH
              </div>
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-gray-900 uppercase">
                {companyName} Matching Diagnostic
              </h3>
              <p className="text-xs text-gray-500 max-w-xl">
                {isHighMatch 
                  ? "Outstanding capabilities overlap. Highly recommended to pursue this solicitation." 
                  : satisfiesRequired 
                    ? "Feasible overlap present. Subcontracting or target development is recommended to proceed safely." 
                    : "Severe requirements alignment deficit. Extensive facility and certification gaps identified."}
              </p>
            </div>
          </div>

          <div className="w-full md:w-64 bg-gray-200 rounded h-2 overflow-hidden border border-gray-300">
            <div 
              className={`h-full transition-all duration-1000 ${isHighMatch ? "bg-emerald-500" : satisfiesRequired ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${match.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Diagnostic Report: Overlaps vs Gaps */}
      <h3 className="text-base font-serif font-bold text-usa-blue tracking-tight uppercase border-b border-gray-200 pb-1 flex items-center gap-2">
        <Target className="w-4 h-4 text-usa-red" />
        Pre-bidding Requirement Analysis &amp; Overlap
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Existing Overlap Box - What is Present */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-emerald-700">
            <CheckCircle className="w-5.5 h-5.5" />
            <h4 className="text-sm font-serif font-bold uppercase tracking-wide">
              Existing Overlaps ({isHighMatch ? "Strong" : "Moderate"})
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            Current systems, personnel experience, and functional structures scanned from your site that fulfill the criteria:
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700 font-sans">
            {match.overlap.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-emerald-50/40 p-2.5 border border-emerald-100 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
            {match.overlap.length === 0 && (
              <li className="text-gray-400 italic font-sans py-2 text-center">No explicit overlaps matched from static analysis.</li>
            )}
          </ul>
        </div>

        {/* Critical Gaps Box - What is Missing */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-usa-red">
            <AlertTriangle className="w-5.5 h-5.5" />
            <h4 className="text-sm font-serif font-bold uppercase tracking-wide">
              Identified Critical Gaps
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            Regulatory hurdles, equipment, facility clearances, or specialized staffing profiles currently unrepresented:
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700 font-sans">
            {match.gaps.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-red-50/45 p-2.5 border border-red-100 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-usa-red shrink-0 mt-1.5" />
                <span className="font-semibold text-gray-800">{item}</span>
              </li>
            ))}
            {match.gaps.length === 0 && (
              <li className="text-gray-400 italic font-sans py-2 text-center">No major structural gaps diagnosed. Perfect alignment.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Action / Recommendations Checklist Box */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-150 pb-2 text-usa-blue">
          <Lightbulb className="w-5.5 h-5.5 text-usa-gold fill-usa-gold/15" />
          <h4 className="text-sm font-serif font-bold uppercase tracking-wide">
            Federal Advisory Recommendations &amp; Build-out Steps
          </h4>
        </div>
        <p className="text-xs text-gray-500">
          Prioritized sequence to satisfy non-compliant gaps and achieve perfect alignment status:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {match.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-250 p-3 rounded">
              <div className="w-6 h-6 rounded bg-usa-blue text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-900 block font-serif">Action Priority {idx + 1}</span>
                <span className="text-xs text-gray-600 font-sans leading-relaxed">{rec}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFP Response and Custom Proposal Package Section (Sales hook leading to credit card flow!) */}
      <div className="bg-usa-blue text-white rounded p-6 md:p-8 relative overflow-hidden">
        {/* Visual offset line */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-usa-red" />

        <div className="max-w-3xl space-y-5 relative z-10 pl-2">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-widest text-usa-gold">
            <FileCheck className="w-3.5 h-3.5" /> RFP PROPOSAL SUITE &amp; COMPLIANCE BLUEPRINT
          </div>

          <h3 className="text-xl md:text-2xl font-serif font-black tracking-tight leading-tight">
            Acquire Full Bidding Packet &amp; Draft Proposal response
          </h3>

          <p className="text-xs md:text-sm text-gray-350 leading-relaxed font-sans font-light">
            Skip weeks of manual template drafting. Secure a complete tailored solicitation proposal response package including:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-sans font-medium text-gray-200">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-usa-red" /> Customized Government Cover Letter
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-usa-red" /> Structured Technical Approach Methodology
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-usa-red" /> Relevant Past Performance Case Study Draft
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-usa-red" /> FAR &amp; SAM.gov Bidding Compliance Checklist
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-white font-serif">
              <span className="text-xs text-gray-400 font-sans">Total Advisory Price:</span>
              <span className="text-2xl font-black text-white flex items-center">
                <DollarSign className="w-5 h-5 -mr-1 text-usa-red" />
                149
              </span>
              <span className="text-xs text-gray-400 font-sans ml-1">USD (Pre-bid discount)</span>
            </div>

            <button
              onClick={onUnlockProposal}
              className="bg-usa-red hover:bg-[#A30022] text-white font-sans text-xs font-bold uppercase tracking-widest py-3 px-6 rounded transition duration-200 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              Get Custom RFP Bid Package
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
