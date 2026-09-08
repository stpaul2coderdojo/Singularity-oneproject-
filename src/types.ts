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
