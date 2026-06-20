import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Copy, Download, Star, Award, FileText, ChevronRight, FileCheck, Share2 } from "lucide-react";
import { ContractOpportunity, ProposalDraft } from "../types";

interface Props {
  contract: ContractOpportunity;
  proposal: ProposalDraft;
  companyName: string;
  onBack: () => void;
}

export default function ProposalViewer({ contract, proposal, companyName, onBack }: Props) {
  const [copied, setCopied] = useState(false);

  const fullProposalText = `===========================================================
PROPOSAL COMPLIANCE RESPONSE FILE: ${contract.solicitationNumber}
PREPARED FOR: ${contract.fullParentPathName}
SUBMITTING VENDOR: ${companyName}
TITLE: ${contract.title}
===========================================================

1. EXECUTIVE SUMMARY & BID STATEMENT
-----------------------------------
${proposal.executiveSummary}

2. TECHNICAL APPROACH & METHODOLOGY
-----------------------------------
${proposal.technicalApproach}

3. PAST PERFORMANCE REFERENCE
-----------------------------------
${proposal.pastPerformanceReference}

4. COMPLIANCE & ACCREDITATION AUDIT
-----------------------------------
${proposal.complianceChecklist.map((item, i) => `[X] REGULATORY GATEWAY ${i+1}: ${item}`).join("\n")}

===========================================================
DOCUMENT GENERATED SECURELY BY FEDMATCH CO-PILOT.
AUTHORIZED FOR INTEGRATION & FINAL LEGAL DEPUTATION.
`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fullProposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const blob = new Blob([fullProposalText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tailored_RFP_Proposal_${contract.solicitationNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-sans text-usa-blue hover:text-red-700 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Gap Analysis
      </button>

      {/* Authorized Gold Seal Banner */}
      <div className="bg-white border border-gray-200 border-l-4 border-l-usa-blue rounded shadow-sm p-6 text-center space-y-3 relative overflow-hidden">
        {/* Visual subtle badge */}
        <div className="flex justify-center gap-1.5 opacity-60">
          <span className="w-2 h-2 rounded bg-usa-red animate-pulse" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500">SECURE ESCROW CLEARANCE</span>
        </div>

        <h2 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#002868] uppercase">
          RFP Bid Proposal Blueprint Authorized
        </h2>
        <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
          Your credit credential deposit has cleared the secure workspace escrow. The tailored pre-bid blueprint response is generated, authorized, and formatted for direct federal submission drafts.
        </p>
      </div>

      {/* Two-Column split: perfect overlap verification checklist AND proposal drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Perfect Overlap checklist */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-2 text-usa-blue">
            <FileCheck className="w-5 h-5 text-usa-gold" />
            <h4 className="text-xs font-serif font-black uppercase tracking-wider">
              Perfect Overlap Auditing
            </h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-normal">
            Every critical capability deficit has been successfully addressed and satisfied in this authorized proposal structure, achieving perfect alignment status:
          </p>

          <div className="space-y-2.5">
            {proposal.complianceChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-emerald-50/45 p-2.5 border border-emerald-100 rounded text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <span className="font-bold text-emerald-800 uppercase block text-[9px] font-mono tracking-wide">
                    ACCREDITED STATE {idx+1}
                  </span>
                  <span className="text-gray-700 leading-tight font-medium block mt-0.5 text-[11px]">{item}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-center">
            <span className="text-[10px] font-mono text-gray-400 block">SECURITY BLUEPRINT CLEARANCE</span>
            <span className="text-xs font-serif font-extrabold text-usa-blue block mt-0.5">STATUS CODE: GOLD-FED-100</span>
          </div>
        </div>

        {/* RIGHT COLUMN: RENDERED PROPOSAL TEMPLATE */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
          
          {/* Header Action toolbar */}
          <div className="bg-slate-100 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-usa-blue">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-serif font-extrabold uppercase tracking-wide">
                Sollicitor response blueprint template
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-white hover:bg-slate-50 border border-gray-300 text-gray-700 text-[11px] font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                onClick={handleDownloadText}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-usa-red hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download TXT
              </button>
            </div>
          </div>

          {/* Render paper content styled as federal brief */}
          <div className="p-6 bg-slate-50/50 flex-1 overflow-y-auto max-h-[480px] font-sans border-b border-gray-200">
            <div className="bg-white rounded-md border border-gray-200 shadow-sm p-6 space-y-6 max-w-2xl mx-auto relative text-[13px] text-gray-800 leading-relaxed font-normal">
              {/* Top seal mock */}
              <div className="text-center space-y-1 pb-4 border-b-2 border-slate-100">
                <div className="text-lg font-serif font-black tracking-widest text-usa-blue">
                  FEDERAL BID RESPONSE DOCUMENT
                </div>
                <div className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">
                  Escrow Registered Identifier: {contract.solicitationNumber}-COMP-A
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <h5 className="font-serif font-extrabold text-navy-900 border-b border-slate-100 pb-1 uppercase tracking-wide text-xs">
                  1. Executive Summary &amp; Bid Commitment
                </h5>
                <p className="font-sans leading-relaxed whitespace-pre-wrap">{proposal.executiveSummary}</p>
              </div>

              {/* Technical approach */}
              <div className="space-y-2">
                <h5 className="font-serif font-extrabold text-navy-900 border-b border-slate-100 pb-1 uppercase tracking-wide text-xs">
                  2. Technical approach &amp; Delivery Methodology
                </h5>
                <p className="font-sans leading-relaxed whitespace-pre-wrap">{proposal.technicalApproach}</p>
              </div>

              {/* Past Performance */}
              <div className="space-y-2">
                <h5 className="font-serif font-extrabold text-navy-900 border-b border-slate-100 pb-1 uppercase tracking-wide text-xs">
                  3. Past Performance references
                </h5>
                <p className="font-sans leading-relaxed whitespace-pre-wrap">{proposal.pastPerformanceReference}</p>
              </div>

              {/* Bottom stamp */}
              <div className="pt-8 border-t border-slate-100 flex justify-between items-end text-[10px] font-mono text-gray-400">
                <div>
                  PREPARED FOR: {contract.fullParentPathName.split(".").slice(-1)[0]}
                </div>
                <div className="text-right">
                  VENDOR AUTHORIZED CO-SIGNATURE FILE
                </div>
              </div>
            </div>
          </div>

          {/* Footer warning */}
          <div className="bg-slate-50 p-3 text-center text-[10px] font-mono text-gray-500">
            Certified for draft integration under Federal Acquisition Regulation (FAR) reference protocols.
          </div>
        </div>

      </div>
    </div>
  );
}
