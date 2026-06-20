import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// List of opportunities from SAM.gov payload
const OPPORTUNITIES = [
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

// Lazy Gemini Initialization & Call Helper
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    genAiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// 1. API Endpoint: Download opportunities as a CSV file
app.get("/api/csv", (req, res) => {
  try {
    // Generate simple compliant CSV content escape commas
    const headers = ["Title", "Notice ID", "Solicitation Number", "Agency/Department", "Posted Date", "Type", "NAICS Code", "SAM.gov Link"];
    const rows = OPPORTUNITIES.map((opp) => {
      return [
        `"${opp.title.replace(/"/g, '""')}"`,
        `"${opp.noticeId}"`,
        `"${opp.solicitationNumber}"`,
        `"${opp.fullParentPathName.replace(/"/g, '""')}"`,
        `"${opp.postedDate}"`,
        `"${opp.type}"`,
        `"${opp.naicsCode}"`,
        `"${opp.uiLink}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=sam_opportunities.csv");
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error("CSV generation failed:", error);
    res.status(500).json({ error: "Failed to generate CSV file" });
  }
});

// 2. API Endpoint: Analyze company capability from URL and match against pre-seeded SAM.gov list
app.post("/api/analyze", async (req, res) => {
  const { companyUrl } = req.body;
  if (!companyUrl) {
    return res.status(400).json({ error: "Company URL is required" });
  }

  // Generate an automated dynamic fallback if Gemini API is not configured or fails
  const mockAnalysis = generateMockAnalysis(companyUrl);

  try {
    const api_key = process.env.GEMINI_API_KEY;
    if (!api_key) {
      console.warn("GEMINI_API_KEY is missing. Using local model simulator.");
      return res.json(mockAnalysis);
    }

    const ai = getGenAI();
    const contractsSummary = OPPORTUNITIES.map(o => `NoticeId: ${o.noticeId}\nTitle: ${o.title}\nSolicitation: ${o.solicitationNumber}\nAgency: ${o.fullParentPathName}\nNAICS: ${o.naicsCode}`).join("\n\n");

    const prompt = `Analyze the following website or company domain name: "${companyUrl}".
Conduct a prediction of their company profile, capabilities, and tech stack based on their domain/URL:
1. Inferred Company Name from URL.
2. Inferred Overview capability summary of what they do.
3. Industry sectors they operate in.
4. For each of the following 5 live Government Contracts, calculate a match score (0-100%) indicating how well their company fits the requirement. Map reasons for existing overlap, critical gaps, and recommendations to win:

Contracts context:
${contractsSummary}

5. For each of the contracts, generate a tailored multi-part high-quality Federal RFP Proposal Draft containing:
- executiveSummary: tailored bid narrative.
- technicalApproach: details about methodology, work division, tech stack.
- pastPerformanceReference: a simulated previous project relevant to the company and the contract.
- complianceChecklist: key regulations and artifacts needed.

Formulate your response strictly as JSON that adheres to this schema:
{
  "companyName": "Inferred Name",
  "summary": "Capability Overview",
  "industries": ["Industry 1", "Industry 2"],
  "matches": [
    {
      "noticeId": "noticeId_string",
      "score": 92,
      "overlap": ["matching strength 1", "matching strength 2"],
      "gaps": ["missing item 1", "missing item 2"],
      "recommendations": ["step 1", "step 2"]
    }
  ],
  "proposalDrafts": {
    "noticeId_string": {
      "executiveSummary": "executive summary text here",
      "technicalApproach": "technical approach description here",
      "pastPerformanceReference": "past performance reference here",
      "complianceChecklist": ["requirement 1", "requirement 2"]
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["companyName", "summary", "industries", "matches", "proposalDrafts"],
          properties: {
            companyName: { type: Type.STRING },
            summary: { type: Type.STRING },
            industries: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["noticeId", "score", "overlap", "gaps", "recommendations"],
                properties: {
                  noticeId: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  overlap: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            proposalDrafts: {
              type: Type.OBJECT,
              description: "Mapping of noticeIds to standard Proposal responses"
            }
          }
        }
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("No response body text received from Gemini API");
    }

    const jsonResult = JSON.parse(bodyText.trim());
    return res.json(jsonResult);
  } catch (error: any) {
    console.error("Gemini API call failed, falling back to dynamic simulated analysis.", error.message);
    return res.json(mockAnalysis);
  }
});

// Local match simulator in case of missing keys or unexpected rate limits
function generateMockAnalysis(companyUrl: string) {
  // Infer a name from URL
  let name = "Enterprise Solutions";
  try {
    const cleanUrl = companyUrl.replace(/^(https?:\/\/)?(www\.)?/, "");
    const parts = cleanUrl.split(".");
    if (parts.length > 0) {
      name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + " Corp";
    }
  } catch (e) {
    // Keep default
  }

  // Detect capability based on containing keywords
  const lowerUrl = companyUrl.toLowerCase();
  let type = "IT & Professional Services";
  let description = "A modern technology consultant and solutions provider optimizing enterprise business workflows and engineering delivery infrastructure.";
  let industries = ["Technology", "Software Engineering", "Management Consulting"];

  if (lowerUrl.includes("security") || lowerUrl.includes("defense") || lowerUrl.includes("lock")) {
    type = "Facility Security & Protective Services";
    description = "A specialized physical security firm providing high-grade caretaker, access control, guard forces, and hazard containment facilities.";
    industries = ["Security Service", "Facilities Maintenance", "Safety Compliance"];
  } else if (lowerUrl.includes("shipping") || lowerUrl.includes("cargo") || lowerUrl.includes("port") || lowerUrl.includes("logistics")) {
    type = "Logistics, Shipping & Supply Chain Operations";
    description = "Global cargo networks and storage providers offering advanced temperature-controlled warehousing, shipment staging, and military-grade crates.";
    industries = ["Maritime Shipping", "Supply Chain", "Heavy Warehousing"];
  } else if (lowerUrl.includes("medical") || lowerUrl.includes("bio") || lowerUrl.includes("chem") || lowerUrl.includes("lab") || lowerUrl.includes("science")) {
    type = "Laboratory Instrumentation & Calibration Services";
    description = "Scientific manufacturing partners validating and maintaining custom chromatography, spectrometry, and gas analyzer units for naval docks.";
    industries = ["Analytical Chemistry", "Naval Research Labs", "Precision Instruments"];
  }

  // Map simulated matching scores relative to company specialization
  const matches = OPPORTUNITIES.map((opp) => {
    let score = 30; // base score
    let overlap: string[] = [];
    let gaps: string[] = [];
    let recommendations: string[] = [];

    if (opp.noticeId === "f675cd80663f4306a5d5374a80d60ab8") { // GOW-MAC Analyzer
      if (type.includes("Laboratory") || type.includes("IT")) {
        score = type.includes("Laboratory") ? 94 : 45;
        overlap = ["Naval Dockyard calibration familiarity", "Instrument diagnostics standard operating procedures"];
        gaps = ["Navy maritime contract registers", "GOW-MAC manufacturing license partnership"];
        recommendations = ["Request calibration certificate blueprints", "Secure a subcontractor letter of endorsement"];
      } else {
        score = 12;
        overlap = ["Equipment logistical receipt routines"];
        gaps = ["Chemical analyzer hardware expertise", "Naval site clearance"];
        recommendations = ["Partner with an instrumentation vendor", "Establish analytical validation standards"];
      }
    } else if (opp.noticeId === "edf327f8ac7049f4a361389e3e34ca8c") { // Security Services
      if (type.includes("Security")) {
        score = 92;
        overlap = ["Active HUBZone qualification", "Job Corps center physical protection experience", "Caretaker staffing directories"];
        gaps = ["Gainesville county certified security license registrations"];
        recommendations = ["Register fast-path state agency clearances", "Pre-commit caretaker managers"];
      } else {
        score = 25;
        overlap = ["Basic corporate headquarters access monitoring"];
        gaps = ["Large-scale personnel caretaker rosters", "Job Corps center safety protocol clearance"];
        recommendations = ["Subcontract Gainesville hub zone security consultants to satisfy the primary quota"];
      }
    } else if (opp.noticeId === "dc7183e7aab342788a9dff786e444f8a") { // Base Life Support Panama
      if (type.includes("Logistics") || type.includes("Security") || type.includes("IT")) {
        score = type.includes("Logistics") ? 88 : 58;
        overlap = ["Central America logistical hub credentials", "Base sustenance procurement pipelines"];
        gaps = ["Panama direct corporate licensing", "Military base security passes"];
        recommendations = ["Obtain Cristobal Colon local operating permit", "Deploy bi-lingual deployment force officers"];
      } else {
        score = 28;
        overlap = ["Standard corporate facility support schedules"];
        gaps = ["Panama international deployments", "Military theater facility logistics"];
        recommendations = ["Build a joint venture consortium with Central-American engineering firms"];
      }
    } else if (opp.noticeId === "b9d0ecdbad264ff4a301649e05fdf09f") { // Cap Screws
      if (type.includes("Shipping") || type.includes("Logistics")) {
        score = 86;
        overlap = ["ISO 9001 certified shipping routines", "Defense Logistics Agency supply pipeline integration"];
        gaps = ["Total Small Business Set-Aside certified status confirmation"];
        recommendations = ["Affix full SAM.gov Small Business profile", "Establish quick ship supply buffers"];
      } else {
        score = 18;
        overlap = ["General industrial support procurement capability"];
        gaps = ["Direct metallurgical stock reserves", "Portsmouth Naval shipyard shipping routes"];
        recommendations = ["Subcontract to qualified small business steel manufacturers"];
      }
    } else if (opp.noticeId === "b2a8023dd5ae4f2bbf60d5861c9e656a") { // Shipping and Storage
      if (type.includes("Shipping") || type.includes("Logistics")) {
        score = 96;
        overlap = ["DLA Aviation Philadelphia direct routes", "Heavy container warehousing", "Custom military crate fabrication"];
        gaps = ["Pre-clearance authorization for Navy Aviation depot spaces"];
        recommendations = ["Request fast-pass Aviation logistics access", "Verify empty storage square-footage metrics"];
      } else {
        score = 20;
        overlap = ["Parcel shipping channels and standard contracts"];
        gaps = ["Aviation-grade heavy containers", "Philadelphia logistics hub connections"];
        recommendations = ["Secure standard freight logistics brokers to handle physical layout and routing"];
      }
    }

    // TAILORED DRAFT PROPOSALS
    const proposalDrafts: { [noticeId: string]: any } = {};
    OPPORTUNITIES.forEach((o) => {
      proposalDrafts[o.noticeId] = {
        executiveSummary: `Tailored solicitation proposal response for ${name} to support the Federal Contract mandate: ${o.title}. Leveraging our robust capabilities in ${type}, we offer a high-reliability, thoroughly compliant operational approach ensuring success for ${o.fullParentPathName}.`,
        technicalApproach: `Our custom Technical Approach details exact execution strategies. For ${o.title}, we partition tasks to satisfy the ${o.solicitationNumber} criteria. We will deploy certified project managers, establish daily progress trackers, secure key compliance gates, and execute specialized delivery routines as specified by the contract.`,
        pastPerformanceReference: `Project Alpha-Gov: Handled a high-profile municipal initiative with a scope resembling ${o.title}. The project completed ahead of schedule, with a 100% compliance rating and verified quality-assurance validations, generating a direct saving of over 15% for the client.`,
        complianceChecklist: [
          "Security Cleared Personnel Verification",
          "SAM.gov Active UEI Status Confirmation",
          "HUBZone or SBA Set-Aside Certifications (if applicable)",
          "Specific NAICS Code Regulatory Match Verification",
          "Port of Entry / Delivery Logistics Certifications"
        ]
      };
    });

    return {
      noticeId: opp.noticeId,
      score,
      overlap,
      gaps,
      recommendations,
      proposalDrafts
    };
  });

  // Tailored Proposal Draft structure mapping for the response
  const proposalDraftsMapped: { [key: string]: any } = {};
  matches.forEach(m => {
    // extract proposalDraft mapping for readability
    Object.assign(proposalDraftsMapped, m.proposalDrafts);
  });

  const finalMatches = matches.map(({ proposalDrafts, ...rest }) => rest);

  return {
    companyName: name,
    summary: description,
    industries,
    matches: finalMatches,
    proposalDrafts: proposalDraftsMapped
  };
}

// 3. Mount Vite client/assets endpoints
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
