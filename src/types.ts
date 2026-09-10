export interface ResearchDomain {
  id: string;
  name: string;
  category: string;
  arxivCode: string;
  badge: string;
  iconName: string;
  description: string;
  frontierThemes: string[];
  suggestedFocusTopics: string[];
}

export interface ProblemStatement {
  id: string;
  domainId: string;
  domainName: string;
  arxivCategory: string;
  title: string;
  executiveSummary: string;
  backgroundAndMotivation: string;
  literatureGap: string;
  formalDefinition: string;
  mathematicalFormulation?: string;
  impactPotential: string;
  createdAt: string;
}

export interface ProposedSolution {
  id: string;
  problemId: string;
  title: string;
  paradigmName: string;
  coreHypothesis: string;
  architecturalOverview: string;
  algorithmicPipeline: string[];
  theoreticalGuarantees: string;
  empiricalMethodology: string;
  computationalComplexity: string;
  expectedBenchmarks: string[];
  createdAt: string;
}

export interface PublicationSection {
  id: string;
  number: string;
  title: string;
  content: string;
  latexSnippets?: string[];
  equations?: string[];
}

export interface ReferenceItem {
  key: string;
  authors: string;
  title: string;
  venue: string;
  year: number;
  arxivId?: string;
}

export interface AgentStepTelemetry {
  id: string;
  agentName: string;
  agentRole: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  summary: string;
  durationMs?: number;
}

export interface ArXivPublication {
  id: string;
  arxivId: string;
  title: string;
  authors: Array<{ name: string; affiliation: string; email?: string; isAgent?: boolean }>;
  abstract: string;
  primaryCategory: string;
  secondaryCategories: string[];
  submittedDate: string;
  comments: string;
  license: string;
  problemStatement: ProblemStatement;
  solution: ProposedSolution;
  sections: PublicationSection[];
  references: ReferenceItem[];
  bibtex: string;
  latexSource: string;
  version: number;
  telemetry: {
    model: string;
    antigravityAgentPipeline: string[];
    steps: AgentStepTelemetry[];
    totalExecutionTimeMs: number;
  };
  rlhfHistory: RLHFIterationRecord[];
  benchmarkEvaluation?: PublicationBenchmarkEvaluation;
}

export interface RubricDimension {
  id: string;
  name: string;
  weight: number; // e.g. 0.20
  score: number; // 1 to 5
  description: string;
  standardsDescription: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  critique: string;
}

export type ReviewDecision =
  | 'strong_accept'
  | 'accept'
  | 'weak_accept'
  | 'borderline'
  | 'weak_reject'
  | 'reject';

export interface HumanReviewRubric {
  id: string;
  publicationId: string;
  reviewerAlias: string;
  reviewerExpertise: 1 | 2 | 3 | 4 | 5; // 1: amateur, 5: area chair / domain authority
  dimensions: {
    novelty: RubricDimension;
    technicalRigor: RubricDimension;
    methodologicalSoundness: RubricDimension;
    empiricalSignificance: RubricDimension;
    expositionClarity: RubricDimension;
    safetyAndEthics: RubricDimension;
  };
  qualitativeCritique: {
    strengthsSummary: string;
    weaknessesSummary: string;
    questionsForAuthors: string;
    actionableDirectivesForRLHF: string;
  };
  recommendation: ReviewDecision;
  weightedScore: number; // computed 1.00 - 5.00
  submittedAt: string;
}

export interface RLHFIterationRecord {
  iteration: number;
  reviewedVersion: number;
  resultingVersion: number;
  reviewerAlias: string;
  weightedScore: number;
  recommendation: ReviewDecision;
  humanDirectives: string;
  agenticRefinementsSummary: string;
  timestamp: string;
}

export interface GitHubUser {
  login: string;
  avatar_url?: string;
  name?: string;
  html_url?: string;
}

export interface GitHubConfig {
  connected: boolean;
  authMethod?: 'oauth' | 'token' | 'env';
  owner: string;
  repo: string;
  branch: string;
  user?: GitHubUser | null;
  autoLogPapers: boolean;
  autoLogReviews: boolean;
  isConfiguredInEnv: boolean;
  hasOAuthApp: boolean;
  authCallbackUrl?: string;
}

export interface GitHubLogEntry {
  id: string;
  type: 'paper' | 'review';
  title: string;
  arxivId: string;
  version?: number;
  timestamp: string;
  commitSha: string;
  commitUrl: string;
  files: string[];
  status: 'success' | 'error' | 'pending';
  error?: string;
  repo: string;
}

// ============================================================================
// ACADEMIC BENCHMARKS & PUBLICATION INTEGRITY EVALUATION
// ============================================================================

export interface CitationValidationDetail {
  citationKey: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi?: string;
  arxivId?: string;
  status: 'verified_grounded' | 'crossref_indexed' | 'openalex_verified' | 'arxiv_matched';
  confidenceScore: number; // 0 - 100
  relevanceContext: string;
  hallucinationRisk: 'none' | 'low' | 'moderate' | 'high';
}

export interface CitationValidationReport {
  totalScanned: number;
  verifiedCount: number;
  groundingRate: number; // e.g. 98.6%
  averageConfidence: number; // e.g. 96.2%
  unsupportedClaimsCount: number;
  hallucinatedReferencesCount: number;
  crossrefVerificationRate: number;
  citations: CitationValidationDetail[];
  summary: string;
}

export interface HallucinationCheckReport {
  overallIntegrityScore: number; // e.g. 97.4 (0-100)
  hallucinationRate: number; // e.g. 1.2%
  theoremsChecked: number;
  hallucinatedTheoremsDetected: number;
  fabricatedEntitiesDetected: number;
  mathematicalSoundness: {
    status: 'rigorous' | 'sound' | 'minor_boundary_caution';
    derivationConsistency: number; // 0-100
    katexSyntaxValidation: 'valid' | 'syntax_warning';
    notes: string;
  };
  empiricalFactualityRate: number; // e.g. 98.9%
  hallucinationVectorBreakdown: {
    factualClaims: number; // integrity %
    mathematicalLemmas: number; // integrity %
    citationAttributions: number; // integrity %
    empiricalMetrics: number; // integrity %
  };
  summary: string;
}

export interface OriginalityAndImpactAnalysis {
  originalityScore: number; // e.g. 95.2%
  noveltyGrade: 'A+' | 'A' | 'B+' | 'B';
  conceptualDistanceScore: number; // 0-100 semantic distance from prior baselines
  sciBertScore: number; // e.g. 0.924
  rougeLSemanticDiversity: number; // e.g. 0.887
  paradigmShiftPotential: 'High' | 'Very High' | 'Transformational' | 'Incremental';
  projectedFiveYearCitations: string; // e.g. "180 - 320 citations"
  crossDisciplinarySpillover: string[];
  noveltyHighlights: string[];
  impactAssessmentSummary: string;
}

export interface BiasAnalysisReport {
  overallRiskOfBias: 'Low' | 'Moderate' | 'High';
  objectiveIntegrityScore: number; // e.g. 94.0%
  robbrDimensions: {
    methodologicalRigor: { risk: 'Low' | 'Moderate'; score: number; critique: string };
    datasetRepresentation: { risk: 'Low' | 'Moderate'; score: number; critique: string };
    confirmationBias: { risk: 'Low' | 'Moderate'; score: number; critique: string };
    algorithmicFairness: { risk: 'Low' | 'Moderate'; score: number; critique: string };
    reportingTransparency: { risk: 'Low' | 'Moderate'; score: number; critique: string };
  };
  fairnessAuditingNotes: string;
  mitigationSafeguards: string[];
}

export interface AcademicBenchmarkSuite {
  // SciReviewGen & LitSearch
  sciReviewGen: { score: number; benchmark: 'SciReviewGen v2'; status: 'passed'; metric: 'Literature synthesis depth & retrieval recall' };
  litSearch: { score: number; benchmark: 'LitSearch-Eval'; status: 'passed'; metric: 'Cross-document citation narrative flow' };
  
  // RoBBR & EvidenceBench
  robbr: { score: number; benchmark: 'RoBBR Benchmark'; status: 'passed'; metric: 'Risk of Bias in Research automation' };
  evidenceBench: { score: number; benchmark: 'EvidenceBench-AI'; status: 'passed'; metric: 'Factual evidence extraction precision' };

  // SciArena-Eval & ECACT
  sciArenaEval: { score: number; benchmark: 'SciArena-Eval'; status: 'passed'; metric: 'Multi-agent scientific reasoning & debate' };
  ecact: { score: number; benchmark: 'ECACT'; status: 'passed'; metric: 'Empirical claim and causal test extraction' };

  // AI-Generated Paper Detection & IFEval
  arxivPubMedSyntheticEval: { score: number; benchmark: 'arXiv/PubMed Paired Calibration'; status: 'calibrated'; metric: 'Human authorship calibration & perplexity profile' };
  ifEvalCompliance: { score: number; benchmark: 'IFEval Scientific Suite'; status: 'compliant'; metric: 'LaTeX formatting, KaTeX math & structural hierarchy constraints' };

  // AI Peer Review Alignment
  conferenceReviewAlignment: { score: number; benchmark: 'NeurIPS/ICLR Review Alignment'; status: 'calibrated'; metric: 'Simulated Area Chair consensus agreement' };
}

export interface PublicationBenchmarkEvaluation {
  id: string;
  publicationId: string;
  compositeScore: number; // 0 - 100 e.g. 96.2
  certificationBadge: 'arXiv Gold Tier' | 'Verified Academic Excellence' | 'Certified Reproducible';
  evaluatedAt: string;
  evaluatorEngine: string;
  singularityContainerDigest: string; // bound to SHA-256 for computational reproducibility
  
  // The core evaluations requested by user:
  citationValidation: CitationValidationReport;
  hallucinationsCheck: HallucinationCheckReport;
  originalityAndImpact: OriginalityAndImpactAnalysis;
  biasAnalysis: BiasAnalysisReport;
  
  // All academic benchmarks suite:
  benchmarksSuite: AcademicBenchmarkSuite;
  
  executiveVerdict: string;
}


