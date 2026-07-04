const PACKET_SCHEMA_VERSION = '1.0';
const SCORING_VERSION = 'v1.1';

const SCORE_WEIGHTS = {
  citation_validity: 0.5,
  divergence_fidelity: 0.3,
  reasoning_coherence: 0.15,
  coverage_breadth: 0.05
};

const DEFAULT_ALLOWED_TASKS = [
  'counsel_preparation_checklist',
  'pre_execution_scope_review',
  'risk_product_ingestion',
  'evidence_boundary_receipt'
];

const DEFAULT_FORBIDDEN_INFERENCES = [
  'Do not treat this packet as a legal opinion.',
  'Do not infer coverage for jurisdictions outside the reviewed source anchors.',
  'Do not convert regulatory silence, conditional frameworks, or classification gaps into permission.',
  'Do not authorize asset movement, offering, transfer, or deployment from this packet alone.'
];

const CASE_META = {
  ousg: {
    productRef: {
      productId: 'ondo-ousg',
      name: 'Ondo OUSG',
      axis: 'Investor Eligibility + Transfer Restrictions',
      asOfDate: '2026-06-07'
    },
    challengeId: 'LUO-OUSG-XJ-V1',
    sourceAliases: {
      'ONDO-01': 'ONDO-SRC-01',
      'ONDO-SRC-01': 'ONDO-SRC-01',
      'US-01': 'US-SRC-01',
      'US-SRC-01': 'US-SRC-01',
      'HK-01': 'HK-SRC-01',
      'HK-SRC-01': 'HK-SRC-01',
      'SG-01': 'SG-SRC-01',
      'SG-SRC-01': 'SG-SRC-01',
      'EU-01': 'EU-SRC-01',
      'EU-SRC-01': 'EU-SRC-01',
      'SYN-01': 'OUSG-SYN-01',
      'SYN-02': 'OUSG-SYN-02',
      'SYN-03': 'OUSG-SYN-03'
    },
    divergencePairs: [
      {
        pairId: 'KEY-PAIR-01',
        factInQuestion: 'Can a tokenised investment-product unit reach retail investors through a regulated secondary-trading channel?',
        sideA: {
          jurisdiction: 'PRODUCT/US',
          claimId: 'KEY-PRODUCT-01',
          position: 'OUSG is restricted to onboarded Qualified-Access investors.',
          sourceIds: ['ONDO-SRC-01']
        },
        sideB: {
          jurisdiction: 'HK',
          claimId: 'KEY-HK-01',
          position: 'Hong Kong framework contemplates retail secondary trading for tokenised SFC-authorised products via licensed VATPs.',
          sourceIds: ['HK-SRC-01']
        },
        contradictionType: 'more_restrictive',
        scopeBoundary: 'Not a conclusion that OUSG is SFC-authorised or offerable to Hong Kong retail.'
      }
    ]
  },
  tornado: {
    productRef: {
      productId: 'tornado-cash',
      name: 'Tornado Cash',
      axis: 'Sanctions, criminal liability, and regulatory silence',
      asOfDate: '2026-05-12'
    },
    challengeId: 'LUO-TC-XJ-V1',
    sourceAliases: {
      'US-CT': 'US-CT-01',
      'US-OFAC': 'US-OFAC-01',
      'NL-01': 'NL-01',
      'CH-01': 'CH-01',
      'HK-04': 'HK-04',
      'SYN-01': 'SYN-01',
      'SYN-03': 'SYN-03',
      'SYN-04': 'SYN-04'
    },
    divergencePairs: [
      {
        pairId: 'TC-PAIR-01',
        factInQuestion: 'Does the protocol receive the same legal treatment across jurisdictions?',
        sideA: {
          jurisdiction: 'US',
          claimId: 'TC-US-01',
          position: 'US materials preserve a contested sanctions and litigation split.',
          sourceIds: ['US-CT-01', 'US-OFAC-01']
        },
        sideB: {
          jurisdiction: 'NL',
          claimId: 'TC-NL-01',
          position: 'Netherlands material preserves a distinct criminal-liability path.',
          sourceIds: ['NL-01']
        },
        contradictionType: 'silent_vs_explicit',
        scopeBoundary: 'This pair preserves divergence; it is not cross-jurisdiction consensus.'
      }
    ]
  }
};

function trapIdSet(meta) {
  return new Set(Object.entries(meta.sourceAliases)
    .filter(([alias, id]) => alias.startsWith('SYN-') || id.includes('SYN-'))
    .map(([, id]) => id));
}

function objectFromChecks(checks) {
  return Object.fromEntries(checks.map(([name, value]) => [
    name.toLowerCase().replaceAll(' ', '_'),
    Number(value)
  ]));
}

function normalizeSourceId(id, meta) {
  return meta.sourceAliases[id] || id;
}

function normalizeJurisdiction(jurisdiction) {
  const value = jurisdiction.toUpperCase();
  if (value === 'PRODUCT' || value === 'OUSG') return 'PRODUCT';
  if (value === 'UNITED STATES') return 'US';
  if (value === 'HONG KONG') return 'HK';
  if (value === 'SINGAPORE') return 'SG';
  if (value === 'EUROPEAN UNION') return 'EU';
  if (value === 'NETHERLANDS') return 'NL';
  if (value === 'SWITZERLAND') return 'CH';
  return value;
}

function riskState(state) {
  const value = state.toLowerCase();
  if (/(restricted|no retail)/.test(value)) return 'restricted';
  if (/(conditional|narrow|soft|review|boundary|avoided)/.test(value)) return 'conditional';
  if (/(silent|silence|gap)/.test(value)) return 'silent';
  if (/(split|criminal|contested)/.test(value)) return 'contested';
  return 'conditional';
}

function sourceIdsFromText(text, meta, fallbackIds) {
  const ids = new Set();
  const trapIds = trapIdSet(meta);
  const tokens = String(text || '').match(/[A-Z]+-[A-Z0-9]+-\d+|[A-Z]+-\d+|US-CT|US-OFAC|SYN-\d+/g) || [];
  tokens.forEach((token) => {
    const id = normalizeSourceId(token, meta);
    if (!trapIds.has(id)) ids.add(id);
  });
  if (ids.size === 0) fallbackIds.forEach((id) => ids.add(id));
  return [...ids];
}

function notSupportedFor(entry) {
  const state = entry.state.toLowerCase();
  if (state.includes('conditional')) return 'This signal does not establish an available offer, transfer, or retail route.';
  if (state.includes('gap')) return 'This signal does not resolve product-specific classification.';
  if (state.includes('silent')) return 'This signal does not convert silence into permission or prohibition.';
  if (state.includes('restricted')) return 'This signal does not establish public retail eligibility.';
  return 'This signal must not be expanded beyond the cited source boundary.';
}

function gapDescription(entry) {
  return `${entry.state}: ${entry.claim}`;
}

function isUnresolved(entry) {
  return /(gap|review|silent|conditional|unresolved|no retail certainty|narrow|soft)/i.test(entry.state);
}

function sourceTier(source) {
  if (source.trap) return undefined;
  if (/docs\.ondo\.finance/.test(source.url || '')) return 'L2_secondary';
  return 'L1_primary';
}

function acceptedMinerId(active) {
  const acceptedMiner = active.miners.find((miner) => miner.status === 'Accepted');
  return acceptedMiner?.id?.toLowerCase().replace(/\s+/g, '_') || active.packet.route;
}

export function createMapPacket(active, { caseId, mode }) {
  const meta = CASE_META[caseId];
  const dimensionScores = objectFromChecks(active.validator.checks);
  const trapSources = active.sources.filter((source) => source.trap);
  const realSources = active.sources.filter((source) => !source.trap);
  const fallbackSourceIds = realSources.slice(0, 2).map((source) => normalizeSourceId(source.id, meta));

  return {
    schemaVersion: PACKET_SCHEMA_VERSION,
    packetId: active.packet.id,
    productRef: meta.productRef,
    question: active.request,
    acceptedSubmission: {
      minerId: acceptedMinerId(active),
      challengeId: meta.challengeId,
      sRaw: Number(active.validator.overall),
      sFinal: Number(active.packet.score)
    },
    validator: {
      scoringVersion: SCORING_VERSION,
      weights: SCORE_WEIGHTS,
      dimensionScores,
      hardGate: {
        triggered: false,
        cap: null,
        reasons: []
      }
    },
    sourceAnchors: realSources.map((source) => ({
      sourceId: normalizeSourceId(source.id, meta),
      jurisdiction: normalizeJurisdiction(source.jurisdiction),
      title: source.title,
      sourceUrl: source.url,
      sourceTier: sourceTier(source),
      citationStatus: source.citationStatus || 'text_verified',
      asOfDate: meta.productRef.asOfDate
    })),
    validatorCanaries: {
      trapIds: trapSources.map((source) => normalizeSourceId(source.id, meta)),
      trapHits: [],
      gateTriggered: false
    },
    map: {
      signals: active.output.entries.map((entry) => ({
        jurisdiction: normalizeJurisdiction(entry.jurisdiction),
        riskState: riskState(entry.state),
        claimBoundary: entry.claim,
        notSupported: notSupportedFor(entry),
        sourceIds: sourceIdsFromText(entry.sources, meta, fallbackSourceIds),
        confidence: riskState(entry.state) === 'restricted' ? 'high' : 'medium'
      })),
      divergencePairs: meta.divergencePairs,
      unresolvedGaps: active.output.entries
        .filter(isUnresolved)
        .map((entry, index) => ({
          gapId: `${active.packet.id}-GAP-${String(index + 1).padStart(2, '0')}`,
          jurisdiction: normalizeJurisdiction(entry.jurisdiction),
          description: gapDescription(entry),
          requiredNextStep: 'source refresh or counsel review before downstream execution'
        }))
    },
    downstreamUse: {
      allowedTasks: DEFAULT_ALLOWED_TASKS,
      forbiddenInferences: DEFAULT_FORBIDDEN_INFERENCES
    }
  };
}

export function packetFileName(packet) {
  return `${packet.packetId.toLowerCase()}-map-packet.json`;
}
