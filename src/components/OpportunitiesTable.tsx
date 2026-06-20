import React from "react";
import { Download, FileSpreadsheet, ExternalLink, ArrowRight, Award } from "lucide-react";
import { ContractOpportunity } from "../types";

interface Props {
  opportunities: ContractOpportunity[];
  onSelectUrlDemo: (url: string) => void;
}

export default function OpportunitiesTable({ opportunities, onSelectUrlDemo }: Props) {
  const handleDownloadCsv = () => {
    // Initiate browser download from Express API endpoint
    window.open("/api/csv", "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8">
      {/* Table Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-serif font-semibold text-usa-blue flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-usa-red shrink-0" />
            Federal Solicitations &amp; Awards
          </h3>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Current system contracts loaded from active SAM.gov federal registry indexes.
          </p>
        </div>
        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-1.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold uppercase tracking-wider py-2 px-4 rounded transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV
        </button>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-xs text-gray-500 font-sans">
          <span className="font-bold text-usa-blue">💡 Testing Guidance:</span> Click a scenario to scan capabilities and map active contracts:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectUrlDemo("https://guardforce-tactical.com")}
            className="text-[10px] font-sans font-bold uppercase tracking-wide bg-white hover:bg-slate-50 text-usa-blue border border-gray-200 px-3 py-1 rounded shadow-sm transition cursor-pointer"
          >
            🔒 guardforce-tactical.com
          </button>
          <button
            onClick={() => onSelectUrlDemo("https://maritime-cargo.org")}
            className="text-[10px] font-sans font-bold uppercase tracking-wide bg-white hover:bg-slate-50 text-usa-blue border border-gray-200 px-3 py-1 rounded shadow-sm transition cursor-pointer"
          >
            🚢 maritime-cargo.org
          </button>
          <button
            onClick={() => onSelectUrlDemo("https://naval-labs.org")}
            className="text-[10px] font-sans font-bold uppercase tracking-wide bg-white hover:bg-slate-50 text-usa-blue border border-gray-200 px-3 py-1 rounded shadow-sm transition cursor-pointer"
          >
            🔬 naval-labs.org
          </button>
        </div>
      </div>

      {/* Grid view/table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-100 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <th className="p-3 pl-4">Notice ID / Code</th>
              <th className="p-3 col-span-2">Sought Solicitation &amp; Award Title</th>
              <th className="p-3">Department / Office</th>
              <th className="p-3">Authority / Type</th>
              <th className="p-3 text-right pr-4">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {opportunities.map((opp) => (
              <tr key={opp.noticeId} className="hover:bg-slate-50/55 transition text-gray-700">
                <td className="p-3 pl-4 whitespace-nowrap">
                  <span className="font-mono bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                    {opp.noticeId.slice(0, 8)}...
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono">{opp.solicitationNumber}</div>
                </td>
                <td className="p-3 min-w-[200px] max-w-[320px]">
                  <div className="font-serif font-bold text-gray-900 line-clamp-1">{opp.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>NAICS: <strong className="font-semibold text-gray-600">{opp.naicsCode}</strong></span>
                    <span>•</span>
                    <span>Class Code: <strong className="font-semibold text-gray-600">{opp.classificationCode}</strong></span>
                  </div>
                </td>
                <td className="p-3 max-w-[180px]">
                  <div className="text-[11px] font-medium text-gray-600 truncate uppercase" title={opp.fullParentPathName}>
                    {opp.fullParentPathName.split(".").slice(-2).join(" • ") || opp.fullParentPathName}
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className="inline-block bg-navy-50/80 text-navy-800 border border-navy-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    {opp.type}
                  </span>
                </td>
                <td className="p-3 text-right pr-4 whitespace-nowrap">
                  <a
                    href={opp.uiLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-usa-blue hover:text-red-650 hover:underline text-[11px] font-semibold"
                  >
                    View SAM
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 p-3 text-center border-t border-gray-100">
        <p className="text-[11px] text-gray-500 font-mono">
          Showing 5 of 28,181 opportunities parsed from SAM.gov Software Development search.
        </p>
      </div>
    </div>
  );
}
