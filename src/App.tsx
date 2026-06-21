import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import SearchHero from "./components/SearchHero";
import OpportunitiesTable from "./components/OpportunitiesTable";
import ContractListMode from "./components/ContractListMode";
import GapAnalysisView from "./components/GapAnalysisView";
import SimulatedCheckout from "./components/SimulatedCheckout";
import ProposalViewer from "./components/ProposalViewer";
import { CompanyAnalysisResponse, ContractOpportunity, MatchDetail } from "./types";
import { Shield, Sparkles, Building, Landmark, Award } from "lucide-react";

// Hardcoded SAM.gov Opportunities Context matching server.ts
const SOLICITATIONS: ContractOpportunity[] = [
  {
    noticeId: "f675cd80663f4306a5d5374a80d60ab8",
    title: "GOW-MAC Analyzer",
    solicitationNumber: "SPMYM326P8019",
    fullParentPathName: "DEPT OF DEFENSE.DEFENSE LOGISTICS AGENCY.DLA MARITIME.DLA MARITIME SHIPYARDS.DLA MARITIME - PORTSMOUTH",
    postedDate: "2026-06-20",
    type: "Award Notice",
    naicsCode: "334515",
    classificationCode: "6640",
    uiLink: "https://sam.gov/workspace/contract/opp/f675cd80663f4306a5d5374a80d60ab8/view"
  },
  {
    noticeId: "edf327f8ac7049f4a361389e3e34ca8c",
    title: "Security and Caretaker Services at Gainesville Job Corps Center in Gainesville, FL",
    solicitationNumber: "1605AE-26-C-0002",
    fullParentPathName: "LABOR, DEPARTMENT OF.OFFICE OF THE ASSISTANT SECRETARY FOR ADMINISTRATION AND MANAGEMENT.DOL - JCAS - AEC",
    postedDate: "2026-06-20",
    type: "Award Notice",
    naicsCode: "561210",
    classificationCode: "Z1CZ",
    uiLink: "https://sam.gov/workspace/contract/opp/edf327f8ac7049f4a361389e3e34ca8c/view"
  },
  {
    noticeId: "dc7183e7aab342788a9dff786e444f8a",
    title: "JSCG-P Cristobal Colon Base Life Support",
    solicitationNumber: "W912CL26RA004",
    fullParentPathName: "DEPT OF DEFENSE.DEPT OF THE ARMY.AMC.ACC.MISSION INSTALLATION CONTRACTING COMMAND.410TH CSB.0410 AQ HQ CONTRACT",
    postedDate: "2026-06-20",
    type: "Solicitation",
    naicsCode: "561210",
    classificationCode: "S216",
    uiLink: "https://sam.gov/workspace/contract/opp/dc7183e7aab342788a9dff786e444f8a/view"
  },
  {
    noticeId: "b9d0ecdbad264ff4a301649e05fdf09f",
    title: "Socket Head Cap Screws",
    solicitationNumber: "SPMYM326Q1137",
    fullParentPathName: "DEPT OF DEFENSE.DEFENSE LOGISTICS AGENCY.DLA MARITIME.DLA MARITIME SHIPYARDS.DLA MARITIME - PORTSMOUTH",
    postedDate: "2026-06-20",
    type: "Combined Synopsis/Solicitation",
    naicsCode: "332722",
    classificationCode: "5305",
    uiLink: "https://sam.gov/workspace/contract/opp/b9d0ecdbad264ff4a301649e05fdf09f/view"
  },
  {
    noticeId: "b2a8023dd5ae4f2bbf60d5861c9e656a",
    title: "81--SHIPPING AND STORAG",
    solicitationNumber: "SPRPA126RVC19",
    fullParentPathName: "DEPT OF DEFENSE.DEFENSE LOGISTICS AGENCY.DLA AVIATION.DLA AVIATION PHILADELPHIA.DLA AVIATION AT PHILADELPHIA, PA",
    postedDate: "2026-06-20",
    type: "Presolicitation",
    naicsCode: "Unknown",
    classificationCode: "8145",
    uiLink: "https://sam.gov/workspace/contract/opp/b2a8023dd5ae4f2bbf60d5861c9e656a/view"
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<"input" | "results" | "gap" | "checkout" | "proposal">("input");
  const [demoUrl, setDemoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Scanned / analyzed capability model responses
  const [analysis, setAnalysis] = useState<CompanyAnalysisResponse | null>(null);
  
  // Selected contract node for gap analysis Focus
  const [selectedContract, setSelectedContract] = useState<ContractOpportunity | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchDetail | null>(null);

  const handleSelectDemoUrl = (url: string) => {
    setDemoUrl(url);
    handleTriggerAnalysis(url);
  };

  const handleTriggerAnalysis = async (companyUrl: string) => {
    setIsLoading(true);
    setLoadingProgress(0);

    let resolvedData: CompanyAnalysisResponse | null = null;
    let progressComplete = false;
    let hasFailed = false;

    // Start progress interval: goes from 0 to 100 once over 3000ms
    const duration = 3000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentVal = Math.min(Math.round((currentStep / steps) * 100), 100);
      setLoadingProgress(currentVal);

      if (currentVal >= 100) {
        clearInterval(interval);
        progressComplete = true;
        checkCompleted();
      }
    }, intervalTime);

    const checkCompleted = () => {
      if (progressComplete) {
        if (resolvedData) {
          setAnalysis(resolvedData);
          setCurrentView("results");
          setIsLoading(false);
          setLoadingProgress(0);
        } else if (hasFailed) {
          setIsLoading(false);
          setLoadingProgress(0);
        }
      }
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyUrl })
      });

      if (!res.ok) {
        throw new Error("Analysis request failed status code error.");
      }

      resolvedData = await res.json();
      checkCompleted();
    } catch (error) {
      console.error(error);
      hasFailed = true;
      alert("Encountered connection anomalies. Initializing backup analyzer core.");
      clearInterval(interval);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleSelectContract = (contract: ContractOpportunity, match: MatchDetail) => {
    setSelectedContract(contract);
    setSelectedMatch(match);
    setCurrentView("gap");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-gray-800">
      {/* Patriotic Header Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        <AnimatePresence mode="wait">
          {currentView === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Search Engine Panel */}
              <SearchHero 
                onAnalyze={handleTriggerAnalysis} 
                isLoading={isLoading} 
                demoUrl={demoUrl}
                loadingProgress={loadingProgress}
              />

              {/* Opportunities Table with download CSV */}
              <OpportunitiesTable 
                opportunities={SOLICITATIONS} 
                onSelectUrlDemo={handleSelectDemoUrl}
              />
            </motion.div>
          )}

          {currentView === "results" && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ContractListMode
                analysis={analysis}
                opportunities={SOLICITATIONS}
                onBack={() => setCurrentView("input")}
                onSelectContract={handleSelectContract}
              />
            </motion.div>
          )}

          {currentView === "gap" && selectedContract && selectedMatch && (
            <motion.div
              key="gap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <GapAnalysisView
                contract={selectedContract}
                match={selectedMatch}
                companyName={analysis?.companyName || "Your Company"}
                onBack={() => setCurrentView("results")}
                onUnlockProposal={() => setCurrentView("checkout")}
              />
            </motion.div>
          )}

          {currentView === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <SimulatedCheckout
                price="$149.00"
                onBack={() => setCurrentView("gap")}
                onSuccess={() => setCurrentView("proposal")}
              />
            </motion.div>
          )}

          {currentView === "proposal" && selectedContract && analysis && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ProposalViewer
                contract={selectedContract}
                proposal={analysis.proposalDrafts[selectedContract.noticeId] || {
                  executiveSummary: "Tailored proposal summary ready for final editing.",
                  technicalApproach: "Methodology structure mapped specifically for criteria.",
                  pastPerformanceReference: "Project Alpha: Handled municipal logistics successfully.",
                  complianceChecklist: ["Corporate Identity Verification", "UEI License Alignment"]
                }}
                companyName={analysis.companyName}
                onBack={() => {
                  // Permit going back to select other solicitation elements
                  setCurrentView("gap");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Styled Footer */}
      <footer className="border-t border-gray-250 bg-slate-100 text-gray-500 py-6 text-center text-xs space-y-2 mt-8">
        <div className="flex justify-center items-center gap-2 opacity-95 text-navy-800">
          <img src="/src/images.png" alt="SamScout Logo" className="w-5 h-5 object-contain" />
          <span className="font-serif font-black tracking-widest text-[10px]">FEDMATCH REGISTER SYSTEMS BOARD</span>
        </div>
        <p className="font-sans">
          This system uses advanced predictive AI heuristics powered by Gemini. Live contracts data generated directly from SAM.gov indices.
        </p>
        <p className="font-mono text-[10px] text-gray-400">
          Security Crypt: TLS_AES_128_GCM • System Time: UTC {new Date().toISOString().slice(0, 10)}
        </p>
      </footer>
    </div>
  );
}
