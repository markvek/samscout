export interface ContractOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  fullParentPathName: string;
  postedDate: string;
  type: string;
  naicsCode: string;
  classificationCode: string;
  uiLink: string;
}

export interface MatchDetail {
  noticeId: string;
  score: number;
  overlap: string[];
  gaps: string[];
  recommendations: string[];
}

export interface ProposalDraft {
  executiveSummary: string;
  technicalApproach: string;
  pastPerformanceReference: string;
  complianceChecklist: string[];
}

export interface CompanyAnalysisResponse {
  companyName: string;
  summary: string;
  industries: string[];
  matches: MatchDetail[];
  proposalDrafts: { [noticeId: string]: ProposalDraft };
}

export interface CreditCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}
