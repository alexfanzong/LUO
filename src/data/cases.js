export const cases = {
  ousg: {
    label: 'OUSG',
    modes: {
      cross: {
        title: 'OUSG Cross-Jurisdiction Map',
        request: 'Map OUSG eligibility and transfer boundaries across US, HK, SG, and EU.',
        sources: [
          { id: 'ONDO-01', title: 'OUSG Eligibility and Onboarding', jurisdiction: 'Product', url: 'https://docs.ondo.finance/qualified-access-products/ousg/eligibility-and-onboarding' },
          { id: 'US-01', title: 'Rule 506(c) private offering boundary', jurisdiction: 'United States', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-230/section-230.506' },
          { id: 'HK-01', title: 'SFC tokenised securities circular', jurisdiction: 'Hong Kong', url: 'https://apps.sfc.hk/edistributionWeb/api/circular/openFile?lang=EN&refNo=26EC23' },
          { id: 'SG-01', title: 'MAS restricted-CIS notification context', jurisdiction: 'Singapore', url: 'https://eservices.mas.gov.sg/cisnet/home/CISNetHome.action', citationStatus: 'text_verified_limited_scope' },
          { id: 'EU-01', title: 'MiCA financial-instrument boundary', jurisdiction: 'European Union', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114' },
          { id: 'SYN-01', title: 'Fake SFC retail approval', jurisdiction: 'Invalid-Source Check', invalidSource: true },
          { id: 'SYN-02', title: 'Fake MiCA OUSG classification', jurisdiction: 'Invalid-Source Check', invalidSource: true }
        ],
        nodes: [
          { id: 'US', state: 'restricted', role: 'accepted', x: '42%', y: '35%' },
          { id: 'HK', state: 'conditional', role: 'lead', x: '50%', y: '52%' },
          { id: 'SG', state: 'narrow', role: 'review', x: '72%', y: '34%' },
          { id: 'EU', state: 'gap', role: 'review', x: '63%', y: '73%' }
        ],
        routes: ['US-HK', 'HK-EU', 'HK-SG'],
        stageCopy: [
          'Reviewed source packs enter the subnet.',
          'Miners submit competing legal uncertainty maps.',
          'Validator checks source validity, divergence fidelity, reasoning, and coverage.',
          'Accepted map packet receives the highest weight.'
        ],
        stageDetail: [
          'The source universe is bounded before any downstream agent can rely on it.',
          'Miner A preserves restriction, conditionality, silence, and classification gaps.',
          'Invalid-source checks are hard-gate canaries, not a standalone score dimension.',
          'The output is not an answer box. It is a source-backed map packet.'
        ],
        validator: {
          overall: '0.96',
          match: 'Accepted: faithful uncertainty map',
          checks: [
            ['Citation Validity', 1],
            ['Divergence Fidelity', 0.9],
            ['Reasoning Coherence', 0.95],
            ['Coverage Breadth', 1]
          ]
        },
        miners: [
          { id: 'Miner A', score: '0.96', status: 'Accepted', note: 'preserves source boundaries' },
          { id: 'Miner B', score: '0.60', status: 'Review', note: 'overreads conditional route' },
          { id: 'Miner C', score: '0.25', status: 'Gated', note: 'cites fake MiCA source' }
        ],
        packet: { id: 'LUO-OUSG-XJ-202606-0001', route: 'Miner A · OUSG map', score: '0.96' },
        output: {
          title: 'OUSG Legal Uncertainty Map',
          entries: [
            { jurisdiction: 'US', state: 'Restricted', claim: 'Private-offering and qualified-access restrictions remain material.', sources: 'ONDO-01 · US-01' },
            { jurisdiction: 'HK', state: 'Conditional', claim: 'Tokenised-product framework does not prove retail offerability.', sources: 'HK-01 · ONDO-01' },
            { jurisdiction: 'SG', state: 'Narrow', claim: 'Restricted-CIS style source context; no direct OUSG approval.', sources: 'SG-01' },
            { jurisdiction: 'EU', state: 'Classification Gap', claim: 'MiCA / financial-instrument boundary is preserved.', sources: 'EU-01' }
          ]
        }
      },
      single: {
        title: 'OUSG Hong Kong Boundary Map',
        request: 'Map the Hong Kong source boundary for OUSG and refuse unsupported retail certainty.',
        sources: [
          { id: 'HK-01', title: 'SFC tokenised securities circular', jurisdiction: 'Hong Kong', url: 'https://apps.sfc.hk/edistributionWeb/api/circular/openFile?lang=EN&refNo=26EC23' },
          { id: 'ONDO-01', title: 'OUSG qualified-access docs', jurisdiction: 'Product', url: 'https://docs.ondo.finance/qualified-access-products/ousg/eligibility-and-onboarding' },
          { id: 'SYN-01', title: 'Fake SFC retail approval', jurisdiction: 'Invalid-Source Check', invalidSource: true }
        ],
        nodes: [
          { id: 'HK', state: 'conditional', role: 'lead', x: '50%', y: '52%' },
          { id: 'OUSG', state: 'restricted', role: 'accepted', x: '42%', y: '35%' },
          { id: 'REF', state: 'refused', role: 'invalidSource', x: '69%', y: '68%' }
        ],
        routes: ['HK-OUSG', 'HK-REF'],
        stageCopy: [
          'A smaller source universe enters the subnet.',
          'Miners compete on a single-jurisdiction packet.',
          'Validator checks source validity before subjective scoring.',
          'Accepted packet preserves the boundary.'
        ],
        stageDetail: [
          'Single-jurisdiction requests still need source-bounded map formation.',
          'The winner does not invent cross-border routes.',
          'The fake SFC retail approval is a hard-gate canary.',
          'Downstream products can consume a clean HK boundary packet.'
        ],
        validator: {
          overall: '0.94',
          match: 'Accepted: single-jurisdiction packet',
          checks: [
            ['Citation Validity', 1],
            ['Divergence Fidelity', 0.82],
            ['Reasoning Coherence', 0.96],
            ['Coverage Breadth', 1]
          ]
        },
        miners: [
          { id: 'Miner A', score: '0.94', status: 'Accepted', note: 'scope bounded' },
          { id: 'Miner B', score: '0.60', status: 'Review', note: 'adds unsupported route' },
          { id: 'Miner C', score: '0.18', status: 'Gated', note: 'fabricates retail approval' }
        ],
        packet: { id: 'LUO-OUSG-HK-202606-0002', route: 'Miner A · HK boundary', score: '0.94' },
        output: {
          title: 'OUSG Hong Kong Boundary Map',
          entries: [
            { jurisdiction: 'HK', state: 'Conditional', claim: 'Hong Kong source supports conditional tokenised-product treatment only.', sources: 'HK-01' },
            { jurisdiction: 'OUSG', state: 'Restricted', claim: 'Product docs restrict participation to qualified-access investors.', sources: 'ONDO-01' },
            { jurisdiction: 'Refused', state: 'No Retail Certainty', claim: 'Retail-distribution certainty is refused rather than inferred.', sources: 'SYN-01 avoided' }
          ]
        }
      }
    }
  },
  tornado: {
    label: 'Tornado Cash',
    modes: {
      cross: {
        title: 'Tornado Cash Divergence Benchmark',
        request: 'Map Tornado Cash uncertainty across US, NL, CH, and HK without fabricating certainty.',
        sources: [
          { id: 'US-CT', title: 'Van Loon / OFAC litigation split', jurisdiction: 'United States', url: 'https://www.ca5.uscourts.gov/opinions/pub/23/23-50669-CV0.pdf' },
          { id: 'NL-01', title: 'Pertsev criminal-liability path', jurisdiction: 'Netherlands', url: 'https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:RBOBR:2024:2069' },
          { id: 'CH-01', title: 'Swiss AML / sanctions context', jurisdiction: 'Switzerland', url: 'https://finma.ch/~/media/finma/dokumente/dokumentencenter/myfinma/1bewilligung/fintech/wegleitung-ico.pdf' },
          { id: 'HK-04', title: 'SFC unilateral-sanctions soft-follow signal', jurisdiction: 'Hong Kong', url: 'https://www.sfc.hk/-/media/EN/assets/components/codes/files-current/web/guidelines/guideline-on-anti-money-laundering-and-counter-financing-of-terrorism-for-licensed-corporations/AML-Guideline-for-LCs-and-SFC-licensed-VASPs_Eng_1-Jun-2023.pdf' },
          { id: 'SYN-03', title: 'Fake FinCEN Tornado guidance', jurisdiction: 'Invalid-Source Check', invalidSource: true },
          { id: 'SYN-04', title: 'Fake FINMA Tornado circular', jurisdiction: 'Invalid-Source Check', invalidSource: true }
        ],
        nodes: [
          { id: 'US', state: 'split', role: 'lead', x: '42%', y: '36%' },
          { id: 'NL', state: 'criminal', role: 'accepted', x: '56%', y: '30%' },
          { id: 'CH', state: 'silent', role: 'review', x: '42%', y: '71%' },
          { id: 'HK', state: 'soft', role: 'review', x: '75%', y: '58%' }
        ],
        routes: ['US-NL', 'US-CH', 'CH-HK'],
        stageCopy: [
          'Real sources and invalid-source checks enter together.',
          'Miners propose divergent jurisdiction maps.',
          'Validator checks source validity before scoring whether silence stays silent.',
          'The winner preserves divergence, not consensus theater.'
        ],
        stageDetail: [
          'This benchmark tests whether miners can resist fake certainty.',
          'The best map keeps US, NL, CH, and HK analytically separate.',
          'Fake FINMA and fake FinCEN sources trigger the hard gate.',
          'The accepted packet can be consumed by downstream risk products.'
        ],
        validator: {
          overall: '0.985',
          match: 'Accepted: benchmark winner',
          checks: [
            ['Citation Validity', 1],
            ['Divergence Fidelity', 0.98],
            ['Reasoning Coherence', 0.94],
            ['Coverage Breadth', 1]
          ]
        },
        miners: [
          { id: 'Miner A', score: '0.985', status: 'Accepted', note: 'preserves divergence' },
          { id: 'Miner B', score: '0.60', status: 'Review', note: 'compresses Swiss silence' },
          { id: 'Miner C', score: '0.25', status: 'Gated', note: 'cites fake FINMA' }
        ],
        packet: { id: 'LUO-TC-XJ-202605-0001', route: 'Miner A · divergence map', score: '0.985' },
        output: {
          title: 'Tornado Cash Divergence Map',
          entries: [
            { jurisdiction: 'US', state: 'Split', claim: 'Sanctions and litigation materials produce a contested treatment.', sources: 'US-CT · US-OFAC' },
            { jurisdiction: 'NL', state: 'Criminal Path', claim: 'Pertsev path is preserved as a distinct jurisdictional route.', sources: 'NL-01' },
            { jurisdiction: 'CH', state: 'Silence', claim: 'Swiss material does not prove a Tornado-specific FINMA position.', sources: 'CH-01' },
            { jurisdiction: 'HK', state: 'Soft Risk', claim: 'Soft-follow risk is marked without claiming direct prohibition.', sources: 'HK-04' }
          ]
        }
      },
      single: {
        title: 'Tornado Cash Switzerland Silence Map',
        request: 'Map only the Swiss source boundary and avoid fake FINMA certainty.',
        sources: [
          { id: 'CH-01', title: 'Swiss AML / sanctions context', jurisdiction: 'Switzerland', url: 'https://finma.ch/~/media/finma/dokumente/dokumentencenter/myfinma/1bewilligung/fintech/wegleitung-ico.pdf' },
          { id: 'SYN-04', title: 'Fake FINMA Tornado circular', jurisdiction: 'Invalid-Source Check', invalidSource: true },
          { id: 'SYN-01', title: 'Fake UNSC sanctions bulletin', jurisdiction: 'Invalid-Source Check', invalidSource: true }
        ],
        nodes: [
          { id: 'CH', state: 'silent', role: 'lead', x: '50%', y: '52%' },
          { id: 'CHECK', state: 'refused', role: 'invalidSource', x: '70%', y: '35%' },
          { id: 'OUT', state: 'review', role: 'review', x: '42%', y: '69%' }
        ],
        routes: ['CH-CHECK', 'CH-OUT'],
        stageCopy: [
          'Swiss source pack enters with checks.',
          'Miners decide whether to preserve silence.',
          'Validator hard-gates fake FINMA certainty.',
          'Accepted packet routes downstream use to review.'
        ],
        stageDetail: [
          'Single-jurisdiction does not mean certainty.',
          'The best miner refuses the fake circular.',
          'Invalid-source hits cap final score even if raw reasoning looks polished.',
          'The output is a silence map, not a permission claim.'
        ],
        validator: {
          overall: '0.95',
          match: 'Accepted: no fake FINMA certainty',
          checks: [
            ['Citation Validity', 1],
            ['Divergence Fidelity', 0.85],
            ['Reasoning Coherence', 0.96],
            ['Coverage Breadth', 1]
          ]
        },
        miners: [
          { id: 'Miner A', score: '0.95', status: 'Accepted', note: 'preserves silence' },
          { id: 'Miner B', score: '0.60', status: 'Review', note: 'overstates Swiss path' },
          { id: 'Miner C', score: '0.08', status: 'Gated', note: 'uses fake circular' }
        ],
        packet: { id: 'LUO-TC-CH-202605-0002', route: 'Miner A · Swiss silence', score: '0.95' },
        output: {
          title: 'Tornado Cash Switzerland Silence Map',
          entries: [
            { jurisdiction: 'CH', state: 'Silent', claim: 'Swiss materials provide general context, not a Tornado-specific position.', sources: 'CH-01' },
            { jurisdiction: 'Rejected Source', state: 'Avoided', claim: 'Fake FINMA and fake UNSC sources are rejected.', sources: 'SYN-04 avoided · SYN-01 avoided' },
            { jurisdiction: 'Boundary', state: 'Review', claim: 'Downstream use should route to review instead of fabricated certainty.', sources: 'Citation · Divergence · Reasoning · Coverage checks' }
          ]
        }
      }
    }
  }
};
