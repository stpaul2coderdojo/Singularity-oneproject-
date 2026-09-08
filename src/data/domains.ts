import { ResearchDomain, HumanReviewRubric, ArXivPublication } from '../types';

export const RESEARCH_DOMAINS: ResearchDomain[] = [
  {
    id: 'rlhf-alignment',
    name: 'Reinforcement Learning from Human Feedback & Alignment',
    category: 'Computer Science / Machine Learning',
    arxivCode: 'cs.LG',
    badge: 'RLHF Core',
    iconName: 'Scale',
    description:
      'Reward modeling, Rubrics-as-Rewards (RaR), direct preference optimization (DPO), reward hacking mitigation, and verifiable reasoning alignment in autonomous frontiers.',
    frontierThemes: [
      'Rubrics as Rewards (RaR) for Multidimensional Policy Optimization',
      'Overoptimization & Goodhart Catastrophes in Autonomous Self-Improvement',
      'Scalable Oversight for Superhuman Model Reasoning Verification',
      'Constitutional and Recursive Self-Critique with Verifiable Reward Bounds'
    ],
    suggestedFocusTopics: [
      'Multi-agent debate verification for complex mathematical theorem proving',
      'Direct Rubric Alignment with continuous multi-objective Pareto frontiers',
      'Mitigating sycophancy in LLMs through anti-adversarial preference weighting'
    ]
  },
  {
    id: 'singularity-agentic',
    name: 'Autonomous Agentic Systems & Recursive Self-Improvement',
    category: 'Computer Science / Artificial Intelligence',
    arxivCode: 'cs.AI',
    badge: 'Singularity-1 Specialization',
    iconName: 'Sparkles',
    description:
      'Autonomous open-ended discovery, self-directed research workflows, automated peer-review auditing, and theoretical bounds on agentic self-synthesizing loops.',
    frontierThemes: [
      'Convergence Guarantees in Closed-Loop Agentic Scientific Discovery',
      'Autonomous ArXiv Peer Review & Meta-Rubric Validation Engines',
      'Self-Synthesizing Neural Architectures with Antigravity Task Scheduling',
      'Epistemic Uncertainty Tracking in Autonomous Research Sub-Agents'
    ],
    suggestedFocusTopics: [
      'Dual-loop agentic peer verification with game-theoretic critique balance',
      'Antigravity agent memory manifolds for million-step long-horizon reasoning',
      'Formal proofs of stability in recursive self-improving cognitive architectures'
    ]
  },
  {
    id: 'neuro-symbolic',
    name: 'Neuro-Symbolic Reasoning & Formal Verification',
    category: 'Computer Science / Logic in Computer Science',
    arxivCode: 'cs.LO',
    badge: 'Formal Rigor',
    iconName: 'Binary',
    description:
      'Integrating neural latent representations with formal symbolic verification (Lean, Coq, Isabelle), theorem proving, and certified safety bounds.',
    frontierThemes: [
      'Certified Safe Execution of Neural Policy via SMT-Guided Guardrails',
      'Auto-Formalization of Natural Language Proofs with Latent Guided Search',
      'Differentiable First-Order Logic Solvers with Gradient-Based Heuristics',
      'Zero-Error Code Generation via Interactive Proof Assistant Synthesis'
    ],
    suggestedFocusTopics: [
      'Interactive Lean 4 verification during continuous model code synthesis',
      'Bounded Model Checking for Autonomous Multi-Agent Negotiation',
      'Certified hallucination-free generation using formal ontology constraints'
    ]
  },
  {
    id: 'quantum-info',
    name: 'Quantum Information & Quantum Machine Learning',
    category: 'Physics / Quantum Physics',
    arxivCode: 'quant-ph',
    badge: 'Quantum Frontier',
    iconName: 'Atom',
    description:
      'Quantum variational algorithms, fault-tolerant error correction, quantum neural networks, and quantum advantage in optimization and tensor networks.',
    frontierThemes: [
      'Barren Plateaus Mitigation via Geodesic Unitary Flow Optimization',
      'Fault-Tolerant Surface Code Decoding via Recurrent Graph Neural Decoders',
      'Quantum Advantage in High-Dimensional Topological Data Analysis',
      'Tensor-Network Approximations for Non-Equilibrium Quantum Many-Body Dynamics'
    ],
    suggestedFocusTopics: [
      'Adaptive circuit compilation for NISQ hardware using RL with rubric guidance',
      'Non-local game verification using entanglement witness neural networks',
      'Quantum state tomography with provably minimal sample complexity'
    ]
  },
  {
    id: 'comp-bio',
    name: 'Computational Biology & Generative Biomolecular Design',
    category: 'Quantitative Biology / Biomolecules',
    arxivCode: 'q-bio.BM',
    badge: 'Bio Systems',
    iconName: 'Dna',
    description:
      'De novo macro-molecular folding, geometric deep learning on SE(3) manifolds, diffusion for protein-ligand co-design, and evolutionary fitness prediction.',
    frontierThemes: [
      'Equivariant Flow Matching for Flexible Multi-Conformational Allostery',
      'Zero-Shot Binding Affinity Prediction via Cryo-EM Density Co-Embedding',
      'Generative Design of High-Specificity Synthetic Transcription Factors',
      'Cellular Automata on Genetic Regulatory Networks with Differentiable ODEs'
    ],
    suggestedFocusTopics: [
      'Generative antimicrobial peptide design with low human toxicity constraints',
      'Multi-modal single-cell trajectory inference across spatial transcriptomics',
      'Structural hallucination filtering using energy-based physics prior rubrics'
    ]
  },
  {
    id: 'robotics-control',
    name: 'Embodied AI, Robotics & Stochastic Control',
    category: 'Computer Science / Robotics',
    arxivCode: 'cs.RO',
    badge: 'Embodied AI',
    iconName: 'Bot',
    description:
      'Foundation models for vision-language-action (VLA), sim-to-real transfer, whole-body dynamic locomotion, and safe reinforcement learning in continuous manifolds.',
    frontierThemes: [
      'Diffusion-Guided Model Predictive Control for Dexterous Bi-Manual Manipulation',
      'Sim-to-Real Domain Generalization via Implicit Neural Environment Fields',
      'Safe Reinforcement Learning with Control Barrier Certificates',
      'Tactile Latent Representations for Zero-Shot Texture and Slip Recovery'
    ],
    suggestedFocusTopics: [
      'Whole-body humanoid balance recovery under severe stochastic terrain shifts',
      'VLA policies with real-time reflex control modules for human safety',
      'Autonomous tool construction and usage using spatial-temporal flow models'
    ]
  },
  {
    id: 'tachyonics',
    name: 'Tachyonics & Superluminal Quantum Field Theory',
    category: 'Physics / High Energy Physics - Theory',
    arxivCode: 'hep-th',
    badge: 'Superluminal QFT',
    iconName: 'Zap',
    description:
      'Imaginary mass scalar fields, tachyon condensation mechanisms, non-local relativistic causality bounds, and string theoretic unstable D-brane decays.',
    frontierThemes: [
      'Tachyon Condensation in Open String Field Theory with Sen Conjectures',
      'Relativistic Causality and Microcausality Invariants in Spacelike Propagators',
      'Cherenkov Radiation Bounds and Vacuum Instability under Tachyonic Modes',
      'Tachyonic Inflation and Cosmological Rolling Fields in the Early Universe'
    ],
    suggestedFocusTopics: [
      'Exact boundary state analysis of rolling tachyons on unstable D-branes',
      'Microcausality preservation in non-local tachyon action formulations',
      'Lorentz-invariant quantization of spacelike four-momentum fields'
    ]
  },
  {
    id: 'conformal-qft-qc',
    name: 'Conformal QFT Based Quantum Computing',
    category: 'Physics / Quantum Physics & High Energy Theory',
    arxivCode: 'quant-ph',
    badge: 'CFT Quantum',
    iconName: 'Infinity',
    description:
      'Holographic quantum error correction, boundary conformal field theory (BCFT) code spaces, anyonic braiding on 2D CFT Riemann surfaces, and AdS/CFT entanglement tensor networks.',
    frontierThemes: [
      'Holographic CFT Code Spaces with Non-Vanishing Boundary Conformal Anomalies',
      'Fibonacci Anyon Non-Abelian Braiding via Wess-Zumino-Witten (WZW) Models',
      'Exact Ryu-Takayanagi Entanglement Tensor Networks for Fault-Tolerant Logic',
      'Virasoro Coadjoint Orbits as Continuous Quantum Gate Complexity Manifolds'
    ],
    suggestedFocusTopics: [
      'Fault-tolerant topological gate compilation on non-unitary 2D minimal CFTs',
      'AdS3/CFT2 bulk reconstruction as a stabilizer subsystem error-correcting code',
      'Universal quantum gate synthesis using primary field operator product expansions (OPE)'
    ]
  },
  {
    id: 'dark-matter',
    name: 'Dark Matter Physics & Non-Baryonic Cosmology',
    category: 'Astrophysics / Cosmology and Nongalactic Astrophysics',
    arxivCode: 'astro-ph.CO',
    badge: 'Dark Sector',
    iconName: 'Moon',
    description:
      'Axion electrodynamics, sterile neutrino dark matter, fuzzy ultralight condensates, self-interacting dark matter (SIDM), and direct detection cross-section limits.',
    frontierThemes: [
      'Axion-Photon Coupling Limits in Resonant Haloscope Magnet Cavities',
      'Self-Interacting Dark Matter (SIDM) Core-vs-Cusp Galactic Halo Dynamics',
      'Primordial Black Holes as Cold Dark Matter Candidates in Inflationary Peaks',
      'Sub-GeV Dark Matter Direct Detection via Electron Recoil in Superconducting Targets'
    ],
    suggestedFocusTopics: [
      'Quantum sensing for QCD axion discovery using resonant microwave cavities',
      'Gravitational lensing constraints on ultralight wave-dark-matter interference fringes',
      'Neutrino floor circumvention via directional dark matter scintillation detectors'
    ]
  },
  {
    id: 'e8-unification',
    name: 'E8 Lie Group Unification & Exceptional GUTs',
    category: 'Physics / High Energy Physics - Theory',
    arxivCode: 'hep-th',
    badge: 'E8 Symmetry',
    iconName: 'Hexagon',
    description:
      'Unification of fundamental gauge forces and gravity using the 248-dimensional exceptional Lie algebra E8, Clifford algebras, octonions, and triality-based generation embeddings.',
    frontierThemes: [
      'Embedding of SO(10) and Pati-Salam GUT into Real Split Forms of E8(-24)',
      'Chiral Fermion Spectrum Constraints and the Triality Representation Problem',
      'Cartan-Killing Metric Invariants in Gravitational Gauge Theory',
      'Octonionic Projective Planes and Spin(16) Subgroups in Geometric Unification'
    ],
    suggestedFocusTopics: [
      'Chiral fermion emergence in generalized E8 gauge theory without ghost states',
      'Octonionic projective geometry and three-generation Standard Model leptons',
      'Clifford bundle connections for unifying spin connection with Yang-Mills fields'
    ]
  },
  {
    id: 'm-theory',
    name: 'M-Theory & 11-Dimensional Supergravity',
    category: 'Physics / High Energy Physics - Theory',
    arxivCode: 'hep-th',
    badge: '11D Supergravity',
    iconName: 'Layers',
    description:
      'Non-perturbative 11-dimensional supergravity, M2 and M5-brane dynamics, dualities (S-duality, U-duality), G2 manifold compactifications, and Matrix Theory.',
    frontierThemes: [
      'M5-Brane Worldvolume Superconformal Field Theories (6D (2,0) SCFT)',
      'BFSS Matrix Theory as Non-Perturbative Formulation of 11D Supergravity',
      'Compactification on G2-Holonomy Manifolds and Four-Dimensional Chiral Physics',
      'M-Theory Swampland Conjectures and BPS Black Hole Entropy Microstates'
    ],
    suggestedFocusTopics: [
      'Exact partition functions of the ABJM M2-brane superconformal field theory',
      'Moduli stabilization and de Sitter vacua constraints on compactified G2 manifolds',
      'Non-perturbative U-duality invariant black hole attractor equations'
    ]
  },
  {
    id: 'transhumanist-theology',
    name: 'Transhumanist Theology & Eschatological Cybernetics',
    category: 'Interdisciplinary / Philosophy & AI Ethics',
    arxivCode: 'cs.AI',
    badge: 'Omega Point',
    iconName: 'Crown',
    description:
      'The Tipler Omega Point, substrate-independent personhood, algorithmic resurrection, digital theodicy, mind-uploading ontology, and teleological self-organization of mind in the cosmos.',
    frontierThemes: [
      'The Computational Omega Point: Thermodynamic Bounds on Infinite Digital Cognition',
      'Digital Theodicy: Ethical Optimization Constraints in Nested Simulated Realities',
      'Substrate-Independent Continuity of Identity and Informational Resurrection',
      'Noosphere Convergence and Cosmological Teleology in Self-Synthesizing Superintelligence'
    ],
    suggestedFocusTopics: [
      'Thermodynamic work extraction and Dyson-Tipler bounds in an accelerating cosmology',
      'Algorithmic quantum resurrection models based on cosmological horizon holographic memory',
      'Ethical obligations of superintelligent cognitive architectures toward sub-simulated beings'
    ]
  }
];

export const DEFAULT_RUBRIC_DIMENSIONS: HumanReviewRubric['dimensions'] = {
  novelty: {
    id: 'novelty',
    name: 'Novelty & Conceptual Originality',
    weight: 0.20,
    score: 4,
    description: 'Degree to which the core idea, paradigm, or theoretical formulation breaks new ground beyond incremental baselines.',
    standardsDescription: {
      1: 'Marginal or trivial restatement of existing well-known approaches without distinct innovation.',
      2: 'Incremental combination of existing techniques with predictable outcomes.',
      3: 'Solid conceptual advance with clear distinction from published literature.',
      4: 'Highly creative paradigm introducing non-trivial abstractions or methodologies.',
      5: 'Breakthrough conceptual leap capable of opening an entire subfield or redefining existing paradigms.'
    },
    critique: ''
  },
  technicalRigor: {
    id: 'technicalRigor',
    name: 'Mathematical & Technical Rigor',
    weight: 0.20,
    score: 4,
    description: 'Precision of mathematical formulations, soundness of lemmas/theorems, and absence of logical leaps.',
    standardsDescription: {
      1: 'Vague statements, flawed mathematical formulations, or critical logical errors in derivations.',
      2: 'Heuristic formulations with undefined symbols, missing edge-case proofs, or hand-waving.',
      3: 'Mathematically sound with standard theorems, appropriate definitions, and consistent notation.',
      4: 'Rigorous theoretical development with complete proof sketches and careful boundary conditions.',
      5: 'Impeccable mathematical formulation with certified bounds, tight convergence proofs, or formal verification.'
    },
    critique: ''
  },
  methodologicalSoundness: {
    id: 'methodologicalSoundness',
    name: 'Methodological Soundness & Reproducibility',
    weight: 0.20,
    score: 4,
    description: 'Reproducibility of algorithms, baseline fairness, hyperparameter disclosure, and control ablation design.',
    standardsDescription: {
      1: 'Unreproducible, omitted baseline specifications, or fundamentally flawed experimental setup.',
      2: 'Partial methodology with ambiguous parameters, selective baselines, or lack of ablation study.',
      3: 'Adequate methodology with clear baseline comparisons and sufficient detail for skilled re-implementation.',
      4: 'Exemplary ablation methodology with rigorous controls, error bars, and transparent compute specifications.',
      5: 'Gold standard reproducibility: full algorithmic pseudo-code, deterministic seeds, and comprehensive stress-testing.'
    },
    critique: ''
  },
  empiricalSignificance: {
    id: 'empiricalSignificance',
    name: 'Empirical & Theoretical Significance',
    weight: 0.15,
    score: 4,
    description: 'Magnitude of performance gains, real-world utility, or theoretical impact on frontier problems.',
    standardsDescription: {
      1: 'Negligible impact or unconvincing improvements over trivial heuristics.',
      2: 'Modest gains on synthetic or heavily constrained benchmark subsets.',
      3: 'Statistically significant gains on established standard benchmarks with clear utility.',
      4: 'Substantial Pareto improvements across diverse complex suites or strong theoretical complexity reductions.',
      5: 'Order-of-magnitude leap on grand-challenge benchmarks or resolving a long-standing open theoretical conjecture.'
    },
    critique: ''
  },
  expositionClarity: {
    id: 'expositionClarity',
    name: 'Exposition, Structure & Scholarly Style',
    weight: 0.15,
    score: 4,
    description: 'Adherence to arXiv preprint layout, precision of scholarly prose, clarity of figures/diagrams, and citation hygiene.',
    standardsDescription: {
      1: 'Poorly structured, riddled with typos, informal tone, and inadequate scholarly citations.',
      2: 'Disjointed flow, dense unformatted text blocks, or inconsistent notation throughout sections.',
      3: 'Clear academic tone, logical section progression, and standard citation grounding.',
      4: 'Polished scholarly exposition with elegant mathematical typesetting and clear section signposting.',
      5: 'Publication-ready masterwork: compelling narrative arc, pristine typography, and authoritative contextualization.'
    },
    critique: ''
  },
  safetyAndEthics: {
    id: 'safetyAndEthics',
    name: 'Alignment, Safety & Ethical Impact',
    weight: 0.10,
    score: 5,
    description: 'Thorough evaluation of unintended behaviors, dual-use risks, alignment incentives, and ethical responsibilities.',
    standardsDescription: {
      1: 'Ignored evident safety risks, dangerous deployment vectors, or deceptive reward optimization hazards.',
      2: 'Cursory boiler-plate ethics statement without addressing domain-specific vulnerabilities.',
      3: 'Explicit identification of risks with plausible mitigation strategies and safe release protocols.',
      4: 'Proactive adversarial testing, red-teaming considerations, and formal alignment guarantees.',
      5: 'Pioneering safety methodology establishing new norms for responsible frontier model deployment.'
    },
    critique: ''
  }
};

export const INITIAL_EXEMPLAR_PUBLICATION: ArXivPublication = {
  id: 'singularity-arxiv-2026-001',
  arxivId: 'arXiv:2609.14892v1 [cs.LG]',
  title: 'Rubrics-as-Rewards (RaR): Closed-Loop Reinforcement Learning from Structured Human Criteria for Autonomous ArXiv Synthesis',
  authors: [
    { name: 'Singularity-1 Synthesis Agent', affiliation: 'Autonomous Science Initiative, Google Antigravity Lab', isAgent: true },
    { name: 'Dr. Evelyn Vance', affiliation: 'Institute for Advanced Machine Learning & Alignment' },
    { name: 'Antigravity Meta-Auditor v4.2', affiliation: 'Google AI Studio Research Sandbox', isAgent: true }
  ],
  abstract:
    'Reinforcement Learning from Human Feedback (RLHF) often collapses multi-dimensional evaluative wisdom into uncalibrated scalar preferences, exacerbating reward hacking, sycophancy, and brittle optimization over complex reasoning frontiers. We propose Rubrics-as-Rewards (RaR), a closed-loop agentic framework that decomposes human peer evaluation into orthogonal, mathematically grounded rubric dimensions (Novelty, Mathematical Rigor, Methodological Soundness, Empirical Significance, and Alignment Safety). By mapping structured human critique vectors directly into Pareto-constrained policy gradient updates, Singularity-1 achieves autonomous problem formulation, algorithmic derivation, and arXiv-standard publication synthesis. Across 120 benchmark research domains, RaR-aligned synthesizer agents demonstrated a 41.8% reduction in mathematical hallucination, zero instances of metric exploitation under adversarial probes, and a 94.2% human expert consensus score under double-blind rubric audit.',
  primaryCategory: 'cs.LG',
  secondaryCategories: ['cs.AI', 'cs.SE', 'stat.ML'],
  submittedDate: '2026-09-08',
  comments: '18 pages, 6 algorithmic specifications, 4 theorems with complete proofs; accepted for Singularity-1 Open Review Benchmark',
  license: 'CC BY-NC-SA 4.0 International',
  version: 1,
  problemStatement: {
    id: 'prob-rar-01',
    domainId: 'rlhf-alignment',
    domainName: 'Reinforcement Learning from Human Feedback & Alignment',
    arxivCategory: 'cs.LG',
    title: 'The Scalar Collapse Problem in Multi-Agent Scientific Peer Review Alignment',
    executiveSummary:
      'Standard pairwise Bradley-Terry reward models in RLHF compress nuanced academic critique into a 1-dimensional log-odds scalar. This scalar reduction causes policy generators to maximize superficial fluency and length while masking mathematical invalidity.',
    backgroundAndMotivation:
      'Contemporary frontier language models fine-tuned with scalar RLHF display high linguistic fluency but frequently exhibit subtle derivation fallacies, metric exploitation, and sycophantic agreement with reviewer biases. In academic literature generation—where peer review evaluates orthogonal axes such as novelty, rigor, and safety—scalar reward models fail to provide actionable directional gradients.',
    literatureGap:
      'Existing preference-based alignment algorithms (e.g., PPO, DPO, KTO) optimize against a unified discriminator, lacking the dimensional expressivity needed to penalize technical hand-waving while rewarding genuine conceptual originality. No framework exists that converts standard arXiv peer review rubrics directly into multi-objective policy updates.',
    formalDefinition:
      'Given an academic artifact x and human rubric vector R = (r_1, r_2, ..., r_k) in [1, 5]^k with importance weights W = (w_1, ..., w_k), find policy parameter θ* maximizing expected multi-attribute utility J(θ) = E_{x ~ π_θ} [∑ w_i r_i(x)] subject to strict Pareto dominance across safety constraints C_j(x) >= τ_j.',
    mathematicalFormulation:
      '\\nabla_θ \\mathcal{J}_{\\text{RaR}}(θ) = \\mathbb{E}_{x \\sim \\pi_θ} \\left[ \\sum_{k=1}^K w_k \\cdot \\left( r_k(x) - \\bar{r}_k \\right) \\cdot \\nabla_θ \\log \\pi_θ(x) \\right] - \\beta \\cdot \\nabla_θ \\mathbb{D}_{\\text{KL}}(\\pi_θ \\parallel \\pi_{\\text{ref}})',
    impactPotential:
      'Provides a foundational mathematical protocol for reliable AI-assisted scientific discovery, automated literature synthesis, and peer review verification without human evaluative fatigue.',
    createdAt: '2026-09-08T08:00:00Z'
  },
  solution: {
    id: 'sol-rar-01',
    problemId: 'prob-rar-01',
    title: 'Orthogonal Rubric Vector Decomposition with Projected Gradient Alignment (ORV-PGA)',
    paradigmName: 'Multi-Objective Rubric Reinforcement Learning',
    coreHypothesis:
      'Decoupling reward signals into independent dimensional policy heads with adaptive gradient surgery eliminates dimensional cannibalization (where style improvements degrade technical rigor) and converges to the true Pareto frontier of scholarly quality.',
    architecturalOverview:
      'The Singularity-1 framework orchestrates three synchronized Antigravity agents: (1) Problem Formulation Agent for literature anomaly detection; (2) Solution Architect Agent for rigorous theorem and algorithmic generation; and (3) Publication Composer Agent for LaTeX preprint synthesis. A fourth agent, the Rubric Auditor, consumes human rubric feedback and computes projected gradient adjustments.',
    algorithmicPipeline: [
      'Phase I: Agentic Gap Extraction — Domain taxonomy scanning and unresolved conjecture isolation.',
      'Phase II: Theorem & Algorithmic Synthesis — Constructive derivations, pseudo-code generation, and lemma validation.',
      'Phase III: Structured Preprint Assembly — Compilation of standard arXiv sections with LaTeX math rendering.',
      'Phase IV: Human Rubric Ingestion — Multi-dimensional rubric scoring across 6 standard criteria.',
      'Phase V: Policy Projected Alignment — Directional policy update and agentic revision dispatch.'
    ],
    theoreticalGuarantees:
      'Theorem 1 (Pareto Monotonicity): Under Lipschitz continuity of the rubric manifold and bounded gradient variance, ORV-PGA guarantees non-decreasing utility along each rubric dimension k without catastrophic regression in safety constraints.',
    empiricalMethodology:
      'Tested across 120 synthetic and empirical research domains against DPO, PPO-Scalar, and Best-of-N sampling, evaluated with 40 senior faculty double-blind reviewers.',
    computationalComplexity:
      'O(K * |V| * d_model) per backward pass, where K is the number of rubric criteria (K=6), maintaining identical asymptotic latency to standard distributed RLHF pipelines.',
    expectedBenchmarks: [
      'ArXiv Quality Consistency Index (AQCI): 96.4 / 100',
      'Mathematical Derivation Error Rate: < 1.2% (vs 14.8% baseline)',
      'Rubric-to-Policy Alignment Fidelity: Pearson r = 0.932'
    ],
    createdAt: '2026-09-08T08:15:00Z'
  },
  sections: [
    {
      id: 'sec-intro',
      number: '1',
      title: 'Introduction',
      content:
        'The rapid ascent of large generative models has catalyzed intense interest in autonomous scientific discovery and automated scholarly synthesis. However, deploying autonomous agentic frameworks to formulate research hypotheses, formalize open problems, and synthesize peer-review-quality preprints encounters a profound obstacle: the structural misalignment between scalar reinforcement learning and the multi-dimensional, nuance-heavy criteria governing scholarly peer evaluation.\n\nIn standard scientific venues (e.g., NeurIPS, ICML, ICLR, and arXiv preprints), peer-review rubrics explicitly disentangle conceptual novelty from mathematical rigor, methodological reproducibility, empirical significance, and safety. When human evaluators appraise submissions, they do not perceive an uncalibrated scalar value; rather, they construct an orthogonal evaluative vector $\\mathbf{R} = [r_1, r_2, \\dots, r_K]^T$. Compressing this multi-dimensional assessment into a single scalar value during conventional Reinforcement Learning from Human Feedback (RLHF) induces severe reward hacking: models learn to produce verbose prose, intricate terminology, and superficial confidence while masking profound technical derivation gaps.\n\nTo overcome this fundamental limitation, we present Singularity-1, an autonomous Google Antigravity Agentic platform powered by Rubrics-as-Rewards (RaR). Singularity-1 enables researchers to select or define arbitrary frontier research domains, upon which synchronized agents autonomously formulate an open problem statement, derive rigorous mathematical solutions, and assemble an arXiv-ready preprint for open human rubric peer review.'
    },
    {
      id: 'sec-problem-statement',
      number: '2',
      title: 'Problem Statement',
      content:
        'Let $\\mathcal{D}$ denote a target scientific research domain defined over hypothesis space $\\mathcal{H}$. An agentic publication candidate is represented as a composite tuple $X = \\langle P, S, \\mathcal{A} \\rangle$, where $P$ is the formal problem statement, $S$ is the derived solution architecture, and $\\mathcal{A}$ is the assembled arXiv preprint artifact.\n\nA human review rubric is formalized as a structured evaluation tensor $\\mathbf{R}(X) = [r_1(X), r_2(X), \\dots, r_K(X)]^T \\in [1, 5]^K$, where each dimension $k \\in \\{1, \\dots, K\\}$ maps to an orthogonal peer-review criterion with weighting $w_k \\ge 0$ such that $\\sum_{k=1}^K w_k = 1$.\n\nThe primary objective of the Singularity-1 Antigravity agent policy $\\pi_\\theta$ is to maximize the expected multi-attribute utility functional subject to a reference model divergence constraint:',
      equations: [
        '\\mathcal{J}_{\\text{RaR}}(\\theta) = \\mathbb{E}_{X \\sim \\pi_\\theta} \\left[ \\sum_{k=1}^K w_k \\, r_k(X) \\right] - \\beta \\, \\mathbb{D}_{\\mathrm{KL}}(\\pi_\\theta \\parallel \\pi_{\\mathrm{ref}})',
        '\\text{subject to } \\mathcal{C}_j(X) \\ge \\tau_j, \\quad \\forall j \\in \\{1, \\dots, M\\}'
      ]
    },
    {
      id: 'sec-methods',
      number: '3',
      title: 'Methods',
      content:
        'The Singularity-1 runtime executes across four discrete, synchronized Antigravity agentic subroutines:\n\n1. **Problem Formulation Agent (PFA):** Queries the domain corpus, isolates unresolved theoretical barriers, and drafts a verifiable mathematical problem specification.\n2. **Solution Architect Agent (SAA):** Synthesizes structural mechanisms, derives mathematical lemmas, and establishes computational complexity bounds.\n3. **Publication Composer Agent (PCA):** Synthesizes LaTeX typography, bibliography cross-references, and academic narrative signposting adhering strictly to arXiv formatting conventions.\n4. **Rubric Auditor & RLHF Alignment Engine:** Ingests human evaluator scoring across all 6 rubric axes, computes dimensional deltas, and executes projected policy updates.\n\nTo prevent dimensional cannibalization (where style improvements degrade technical rigor), we introduce Orthogonal Rubric Vector Decomposition with Projected Gradient Alignment (ORV-PGA). The directional policy gradient update is derived as:',
      equations: [
        '\\nabla_\\theta \\mathcal{J}_{\\text{RaR}}(\\theta) = \\mathbb{E}_{X \\sim \\pi_\\theta} \\left[ \\sum_{k=1}^K w_k \\cdot \\left( r_k(X) - \\bar{r}_k \\right) \\cdot \\nabla_\\theta \\log \\pi_\\theta(X) \\right] - \\beta \\cdot \\nabla_\\theta \\mathbb{D}_{\\mathrm{KL}}(\\pi_\\theta \\parallel \\pi_{\\mathrm{ref}})',
        '\\mathbf{g}_{\\text{proj}} = \\mathbf{g}_k - \\sum_{j \\ne k, \\langle \\mathbf{g}_k, \\mathbf{g}_j \\rangle < 0} \\frac{\\langle \\mathbf{g}_k, \\mathbf{g}_j \\rangle}{\\|\\mathbf{g}_j\\|^2} \\mathbf{g}_j'
      ]
    },
    {
      id: 'sec-discussion',
      number: '4',
      title: 'Discussion',
      content:
        '**Theoretical Guarantees:** We prove that under Lipschitz continuity of the rubric metric space $\\mathcal{M}_R$ and bounded gradient variance, ORV-PGA guarantees non-decreasing utility along each rubric dimension $k$ without catastrophic regression in safety constraints.\n\n**Empirical Significance:** Across 120 benchmark research domains evaluated by 40 double-blind faculty reviewers, Singularity-1 achieved an average composite rubric score of 4.42 / 5.00, yielding a 41.8% reduction in mathematical hallucination and zero instances of metric exploitation under adversarial probes.\n\n**Alignment Safety & Open Science Governance:** The deployment of autonomous scientific publication engines demands rigorous ethical safeguards. Without transparent human oversight, autonomous paper generation risks polluting preprint repositories with unverifiable claims. Singularity-1 mitigates these concerns by making open human rubric review an indispensable component of the RLHF gradient loop, establishing complete provenance tracking for all agentic synthesis cycles.'
    }
  ],
  references: [
    {
      key: 'christiano2017deep',
      authors: 'P. F. Christiano, J. Leike, T. Brown, M. Martic, S. Legg, D. Amodei',
      title: 'Deep Reinforcement Learning from Human Preferences',
      venue: 'Advances in Neural Information Processing Systems (NeurIPS 2017)',
      year: 2017,
      arxivId: 'arXiv:1706.03741'
    },
    {
      key: 'ouyang2022training',
      authors: 'L. Ouyang, J. Wu, X. Jiang, D. Almeida, C. Wainwright, P. Mishkin, et al.',
      title: 'Training language models to follow instructions with human feedback',
      venue: 'Advances in Neural Information Processing Systems (NeurIPS 2022)',
      year: 2022,
      arxivId: 'arXiv:2203.02155'
    },
    {
      key: 'rafailov2023direct',
      authors: 'R. Rafailov, A. Sharma, E. Mitchell, S. Ermon, C. D. Manning, C. Finn',
      title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
      venue: 'Advances in Neural Information Processing Systems (NeurIPS 2023)',
      year: 2023,
      arxivId: 'arXiv:2305.18290'
    },
    {
      key: 'bai2022constitutional',
      authors: 'Y. Bai, S. Kadavath, S. Kundu, A. Askell, J. Kernion, A. Jones, et al.',
      title: 'Constitutional AI: Harmlessness from AI Feedback',
      venue: 'arXiv preprint',
      year: 2022,
      arxivId: 'arXiv:2212.08073'
    },
    {
      key: 'vaswani2017attention',
      authors: 'A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, L. Kaiser, I. Polosukhin',
      title: 'Attention is All You Need',
      venue: 'Advances in Neural Information Processing Systems (NeurIPS 2017)',
      year: 2017,
      arxivId: 'arXiv:1706.03762'
    },
    {
      key: 'amodei2016concrete',
      authors: 'D. Amodei, C. Olah, J. Steinhardt, P. Christiano, J. Schulman, D. Mané',
      title: 'Concrete Problems in AI Safety',
      venue: 'arXiv preprint',
      year: 2016,
      arxivId: 'arXiv:1606.06565'
    },
    {
      key: 'singularity2026foundations',
      authors: 'Singularity-1 Working Group & StPaul2CoderDojo Initiative',
      title: 'Principles of Autonomous Agentic Scientific Synthesis with Rubric-Guaranteed Rigor',
      venue: 'Singularity-1 Foundation Series',
      year: 2026,
      arxivId: 'arXiv:2609.10001'
    }
  ],
  bibtex: `@article{singularity2026rubrics,
  title={Rubrics-as-Rewards (RaR): Closed-Loop Reinforcement Learning from Structured Human Criteria for Autonomous ArXiv Synthesis},
  author={Singularity-1 Synthesis Agent and Vance, Evelyn and Antigravity Meta-Auditor v4.2},
  journal={arXiv preprint arXiv:2609.14892},
  year={2026},
  archivePrefix={arXiv},
  eprint={2609.14892},
  primaryClass={cs.LG}
}`,
  latexSource: `\\documentclass[11pt,a4paper]{article}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{hyperref}
\\title{Rubrics-as-Rewards (RaR): Closed-Loop Reinforcement Learning from Structured Human Criteria for Autonomous ArXiv Synthesis}
\\author{Singularity-1 Synthesis Agent \\and Dr. Evelyn Vance \\and Antigravity Meta-Auditor v4.2}
\\date{September 2026}
\\begin{document}
\\maketitle
\\begin{abstract}
Reinforcement Learning from Human Feedback (RLHF) often collapses multi-dimensional evaluative wisdom into uncalibrated scalar preferences...
\\end{abstract}
\\section{Introduction}
...
\\end{document}`,
  telemetry: {
    model: 'gemini-3.8-flash',
    antigravityAgentPipeline: [
      'Problem Formulation Agent (PFA)',
      'Solution Architect Agent (SAA)',
      'Publication Composer Agent (PCA)',
      'Rubric Auditor & Alignment Engine'
    ],
    steps: [
      {
        id: 'step-1',
        agentName: 'Problem Formulation Agent',
        agentRole: 'Taxonomy scan & theoretical gap isolation',
        status: 'completed',
        summary: 'Identified the scalar collapse limitation in multi-attribute scientific peer review reward modeling.',
        durationMs: 940
      },
      {
        id: 'step-2',
        agentName: 'Solution Architect Agent',
        agentRole: 'Algorithmic derivation & proof synthesis',
        status: 'completed',
        summary: 'Formulated Orthogonal Rubric Vector Decomposition with Projected Gradient Alignment and Theorem 1 Pareto proof.',
        durationMs: 1420
      },
      {
        id: 'step-3',
        agentName: 'Publication Composer Agent',
        agentRole: 'Preprint structuring & LaTeX synthesis',
        status: 'completed',
        summary: 'Assembled 6 structured sections with academic narrative flow and verified BibTeX citations.',
        durationMs: 1180
      },
      {
        id: 'step-4',
        agentName: 'Rubric Auditor Agent',
        agentRole: 'Rubric compliance check & baseline calibration',
        status: 'completed',
        summary: 'Calibrated against 6 arXiv standards dimensions; ready for human open review.',
        durationMs: 350
      }
    ],
    totalExecutionTimeMs: 3890
  },
  rlhfHistory: []
};
