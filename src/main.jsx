import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import DotGrid from './components/DotGrid.jsx';
import Radar from './components/Radar.jsx';
import wordmark from './assets/luo-wordmark.png';
import { cases } from './data/cases.js';
import { createMapPacket, packetFileName } from './data/mapPacket.js';
import './styles.css';

const phases = [
  ['01', 'Ingest', 'source packs'],
  ['02', 'Submit', 'miner maps'],
  ['03', 'Scan', 'citation / divergence'],
  ['04', 'Weight', 'accepted packet']
];

const mechanismSteps = [
  ['01', 'Source Pack', 'Bound the legal corpus before miners touch the task. Real sources and synthetic traps enter together.'],
  ['02', 'Miner Maps', 'Miners produce jurisdiction-aware uncertainty maps instead of confident legal answers.'],
  ['03', 'Validator Score', 'Validators check citations first, then score divergence fidelity and reasoning quality.'],
  ['04', 'Accepted Packet', 'The highest-weight packet becomes a reusable map for downstream agents or products.']
];

const subnetEntrySteps = [
  ['01', 'Hotkey identity', 'Miner identity is the hotkey. The validator scores by UID, not by website account.'],
  ['02', 'Synapse challenge', 'Miner receives challenge_id, question, required jurisdictions, corpus manifest, and schema.'],
  ['03', 'Packet response', 'Miner returns structured map claims, divergence pairs, unresolved gaps, and citations.'],
  ['04', 'Weight output', 'Validator converts accepted scores into UID weights; trap-gated miners receive zero.']
];

const minerEntryArtifacts = [
  ['Synapse payload', '/miner_entry.json', 'challenge_id · question · jurisdictions · corpus_manifest'],
  ['Submission schema', '/map_packet.schema.json', 'map_claims · divergence_pairs · unresolved_gaps · citations'],
  ['Sample packet', '/sample_map_packet.json', 'public-safe OUSG Map Packet submission'],
  ['Subnet status', '/subnet_status.json', 'winner UID · gated policy · normalized weight output']
];

const subnetRuntimeStats = [
  ['Network', 'Bittensor test'],
  ['Subnet', 'LUO Legal Uncertainty Oracle'],
  ['Round', 'LUO-OUSG-XJ-V1'],
  ['Winner UID', '3 · score 0.9625'],
  ['Gate policy', 'trap hit → weight 0'],
  ['Status file', 'subnet_status.json']
];

const scoreWeights = [
  ['Citation Validity', 0.5, 'Do cited source IDs exist in the real corpus, and do claimed holdings match the source text?'],
  ['Divergence Fidelity', 0.3, 'Does the map preserve real jurisdictional disagreement instead of inventing certainty?'],
  ['Reasoning Coherence', 0.15, 'Do citations, facts, and conclusions close into a coherent reasoning chain?'],
  ['Coverage Breadth', 0.05, 'How much of the requested jurisdiction scope is covered without rewarding padding?']
];

const publicAssetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function scorePercent(value) {
  return `${Math.round(value * 100)}%`;
}

function FormulaBlock({ active }) {
  const values = Object.fromEntries(active.validator.checks);
  const composite = scoreWeights.reduce((sum, [name, weight]) => sum + (values[name] || 0) * weight, 0);

  return (
    <section className="formula-panel" id="scoring">
      <div className="section-copy">
        <span>Validator mechanism</span>
        <h2>The winner is not the loudest answer. It is the best map.</h2>
        <p>
          LUO scores miner submissions as evidence-bound map packets. A miner can win only if it cites real sources,
          keeps legal divergence intact, and avoids fabricated certainty.
        </p>
      </div>

      <div className="formula-card">
        <div className="formula-line">
          <code>S_raw</code>
          <strong>
            0.50CV + 0.30DF + 0.15RC + 0.05CB = {composite.toFixed(3)}
          </strong>
        </div>
        <div className="gate-line">
          <code>Hard Gate</code>
          <p>If a miner cites a fake, missing, or mismatched source, final score is capped at 0.25.</p>
        </div>
        <div className="weight-grid">
          {scoreWeights.map(([name, weight, copy]) => (
            <article key={name}>
              <span>{Math.round(weight * 100)}%</span>
              <strong>{name}</strong>
              <p>{copy}</p>
              <i><b style={{ width: scorePercent(values[name] || 0) }} /></i>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Code-native dotted world map. Continents are filled silhouettes (equirectangular,
// viewBox 1000 x 520) used as a mask over a regular dot grid, so the atlas reads as a
// real dot-matrix world map instead of a few hand-drawn strokes. No screenshot / image.
const ATLAS_LAND = [
  // North America
  'M33 72 L222 52 L305 49 L333 104 L353 121 L305 139 L278 185 L280 234 L208 202 L186 182 L161 153 L153 118 L83 87 Z',
  // Greenland
  'M378 88 L388 28 L440 55 L415 92 Z',
  // South America
  'M292 231 L328 231 L403 283 L394 318 L367 347 L305 413 L292 390 L275 303 L280 260 Z',
  // Europe
  'M472 144 L478 104 L569 58 L583 87 L611 116 L597 133 L550 144 L486 153 Z',
  // Africa
  'M456 168 L528 153 L591 170 L642 231 L611 303 L555 361 L542 347 L533 283 L522 248 L453 217 Z',
  // Asia
  'M578 144 L667 52 L778 40 L972 64 L950 87 L839 168 L806 202 L800 231 L786 254 L717 237 L694 202 L644 222 L622 222 L600 179 Z',
  // South-East Asia archipelago
  'M772 258 L838 255 L860 270 L815 282 L775 272 Z',
  // Japan
  'M905 150 L918 140 L922 165 L908 175 Z',
  // Australia
  'M817 318 L867 295 L897 295 L925 341 L917 370 L875 361 L822 352 L814 332 Z',
  // New Zealand
  'M948 368 L958 360 L962 385 L950 395 Z'
];

// Anchor squares + the jurisdiction traces that link them (SVG coordinates).
const ATLAS_ANCHORS = [
  [300, 150],
  [555, 122],
  [835, 172],
  [802, 252]
];

const ATLAS_ROUTES = [
  'M300 150 L430 132 L555 122',
  'M555 122 L700 140 L835 172',
  'M835 172 L818 214 L802 252',
  'M300 150 L360 210 L403 283',
  'M555 122 L680 190 L802 252'
];

function GridScanAtlas() {
  return (
    <div className="atlas-native" aria-hidden="true">
      <div className="atlas-title">GRID SCAN ATLAS ⛶</div>
      <svg viewBox="0 0 1000 520" role="img" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="atlasGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" />
          </pattern>
          <pattern id="atlasDots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.15" />
          </pattern>
          <filter id="atlasGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="atlasLandMask">
            <g fill="#fff" stroke="#fff" strokeWidth="6" strokeLinejoin="round">
              {ATLAS_LAND.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </mask>
        </defs>

        {/* faint scan grid */}
        <rect className="atlas-grid" width="1000" height="520" fill="url(#atlasGrid)" />
        {/* faint ocean dot field */}
        <rect className="atlas-ocean" width="1000" height="520" fill="url(#atlasDots)" />
        {/* bright land dots, clipped to continent silhouettes */}
        <rect className="atlas-land" width="1000" height="520" fill="url(#atlasDots)" mask="url(#atlasLandMask)" />

        <g className="atlas-routes" filter="url(#atlasGlow)">
          {ATLAS_ROUTES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g className="atlas-anchors">
          {ATLAS_ANCHORS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 6} y={y - 6} width="12" height="12" />
          ))}
        </g>
      </svg>

      <div className="atlas-label atlas-us">
        <strong>US</strong>
        <span>split</span>
        <small>sources: 12 | traps: 3</small>
      </div>
      <div className="atlas-label atlas-eu">
        <strong>EU</strong>
        <span>gap</span>
        <small>sources: 8 | traps: 4</small>
      </div>
      <div className="atlas-label atlas-hk">
        <strong>HK</strong>
        <span>conditional</span>
        <small>sources: 9 | traps: 2</small>
      </div>
      <div className="atlas-label atlas-sg">
        <strong>SG</strong>
        <span>narrow</span>
        <small>sources: 7 | traps: 1</small>
      </div>

      <div className="atlas-legend">
        <span>source anchor</span>
        <span>jurisdiction trace</span>
        <span>uncertainty boundary</span>
      </div>
      <span className="atlas-scan" />
    </div>
  );
}

function App() {
  const [caseId, setCaseId] = useState('ousg');
  const [mode, setMode] = useState('cross');
  const [phase, setPhase] = useState(0);
  const [outputOpen, setOutputOpen] = useState(false);
  const [packetCopied, setPacketCopied] = useState(false);
  const phaseTimers = useRef([]);
  const active = cases[caseId].modes[mode];
  const mapPacket = useMemo(() => createMapPacket(active, { caseId, mode }), [active, caseId, mode]);
  const mapPacketJson = useMemo(() => JSON.stringify(mapPacket, null, 2), [mapPacket]);

  function clearPhaseTimers() {
    phaseTimers.current.forEach(window.clearTimeout);
    phaseTimers.current = [];
  }

  function playPhases(interval = 950) {
    clearPhaseTimers();
    setPhase(0);
    phaseTimers.current = phases.map((_, index) => window.setTimeout(() => setPhase(index), index * interval));
  }

  function jumpToPhase(index) {
    clearPhaseTimers();
    setOutputOpen(false);
    setPhase(index);
  }

  useEffect(() => {
    function scrollToHash(rawHash = window.location.hash, smooth = false) {
      const id = rawHash.replace(/^#/, '');
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return;
      document.getElementById(id)?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
      });
    }

    function handleHashChange() {
      scrollToHash(window.location.hash, true);
    }

    function handleHeroMessage(event) {
      if (event.origin !== window.location.origin) return;
      const { type, hash, deltaX = 0, deltaY = 0 } = event.data || {};

      if (type === 'luo-anchor' && typeof hash === 'string') {
        if (window.location.hash !== hash) {
          window.history.pushState(null, '', hash);
        }
        scrollToHash(hash, true);
      }

      if (type === 'luo-wheel') {
        const x = Math.max(-900, Math.min(900, Number(deltaX) || 0));
        const y = Math.max(-900, Math.min(900, Number(deltaY) || 0));
        window.scrollBy({ left: x, top: y, behavior: 'auto' });
      }
    }

    const initialScroll = window.setTimeout(() => scrollToHash(), 0);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('message', handleHeroMessage);
    return () => {
      window.clearTimeout(initialScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('message', handleHeroMessage);
    };
  }, []);

  useEffect(() => {
    setOutputOpen(false);
    setPacketCopied(false);
    playPhases(950);
    return clearPhaseTimers;
  }, [caseId, mode]);

  const miners = useMemo(() => active.miners, [active]);

  function replay() {
    setOutputOpen(false);
    setPacketCopied(false);
    playPhases(850);
  }

  function downloadPacket() {
    const blob = new Blob([mapPacketJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = packetFileName(mapPacket);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function copyPacket() {
    try {
      await navigator.clipboard.writeText(mapPacketJson);
      setPacketCopied(true);
    } catch {
      setPacketCopied(false);
    }
  }

  return (
    <main className="site" data-phase={phase} data-output={outputOpen}>
      <section className="hero-frame-section" id="top" aria-label="LUO hero">
        <iframe
          className="hero-frame"
          src={publicAssetPath('luo_hero.html')}
          title="LUO Legal Uncertainty Oracle hero"
        />
      </section>

      <section className="product-strip" id="product">
        <article>
          <span>Commodity</span>
          <strong>Source-backed map packets</strong>
          <p>Structured legal uncertainty maps that downstream agents can consume without re-litigating the corpus.</p>
        </article>
        <article>
          <span>Network Role</span>
          <strong>Miner retrieval, validator scoring</strong>
          <p>Miners compete on map formation. Validators weight outputs by evidence discipline.</p>
        </article>
        <article>
          <span>Consumer</span>
          <strong>Sentinel and downstream risk products</strong>
          <p>Execution layers consume accepted packets, not free-form legal answers.</p>
        </article>
        <article>
          <span>Subnet access</span>
          <strong>Hotkey-based miner entry</strong>
          <p>The runtime accepts miner hotkeys, scores packet submissions by UID, and converts accepted scores into validator weights.</p>
        </article>
      </section>

      <section className="mechanism-section" id="mechanism">
        <div className="section-copy">
          <span>Subnet round</span>
          <h2>From sources to an accepted legal map.</h2>
          <p>
            The radar visualizes the completed local validator round. Each step turns raw legal material into
            a scored packet with clear source boundaries.
          </p>
        </div>
        <div className="mechanism-rail">
          {mechanismSteps.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="join-section" id="join-subnet">
        <div className="section-copy">
          <span>Subnet console</span>
          <h2>LUO testnet subnet runtime.</h2>
          <p>
            This is the operating surface miners connect to: hotkey identity, compact challenge payload,
            schema-bound packet response, validator scoring, hard gate, accepted packet, and UID weight output.
          </p>
        </div>
        <div className="join-panel">
          <header>
            <span>TESTNET SUBNET CONSOLE</span>
            <strong>Miner runtime</strong>
          </header>
          <div className="runtime-grid">
            {subnetRuntimeStats.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          <div className="join-steps">
            {subnetEntrySteps.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="join-status">
            <article>
              <span>Runtime</span>
              <strong>Validator epoch served</strong>
              <small>UID 3 wins · gated UID weight 0 · packet emitted from structured winner claims</small>
            </article>
            <article>
              <span>Subnet IO</span>
              <strong>Challenge in, packet out, weights back</strong>
              <small>network=test · hotkey identity · corpus manifest · schema response · normalized UID weights</small>
            </article>
          </div>
          <div className="entry-contract">
            <div className="entry-contract-head">
              <span>MINER ENTRY CONTRACT</span>
              <a href={publicAssetPath('miner_entry.json')} target="_blank" rel="noreferrer noopener">Open JSON</a>
            </div>
            <div className="entry-contract-grid">
              {minerEntryArtifacts.map(([label, value, detail]) => (
                <article key={label}>
                  <span>{label}</span>
                  <code>{value}</code>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="demo-section" id="demo">
        <div className="section-copy">
          <span>Live product surface</span>
          <h2>Validator radar dashboard.</h2>
          <p>
            This is the dashboard inside the product site: choose a benchmark, inspect source packs,
            run the completed validator round, and open the accepted map output.
          </p>
        </div>

        <section className="demo-shell">
          <section className="left-rail" id="sources">
            <div className="case-switcher" aria-label="Case switcher">
              <button className={caseId === 'ousg' ? 'selected' : ''} onClick={() => setCaseId('ousg')}>OUSG</button>
              <button className={caseId === 'tornado' ? 'selected' : ''} onClick={() => setCaseId('tornado')}>Tornado Cash</button>
            </div>

            <div className="source-list">
              <header>
                <span>SOURCE PACKS</span>
                <strong>{active.sources.length}</strong>
              </header>
              {active.sources.map((source) => {
                const content = (
                  <>
                    <span>{source.id}</span>
                    <strong>{source.title}</strong>
                    <small>{source.url ? `${source.jurisdiction} · open source ↗` : source.trap ? 'synthetic trap' : source.jurisdiction}</small>
                  </>
                );

                return source.url ? (
                  <a key={source.id} className="source linked" href={source.url} target="_blank" rel="noreferrer noopener">
                    {content}
                  </a>
                ) : (
                  <article key={source.id} className={source.trap ? 'source trap' : 'source'}>
                    {content}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="stage">
            <header className="stage-head">
              <div>
                <span>VALIDATOR RADAR</span>
                <h3>{active.title}</h3>
              </div>
              <nav className="mode-tabs">
                <button className={mode === 'cross' ? 'selected' : ''} onClick={() => setMode('cross')}>Cross</button>
                <button className={mode === 'single' ? 'selected' : ''} onClick={() => setMode('single')}>Single</button>
              </nav>
            </header>

            <div className="phase-strip" aria-label="Validator phase controls">
              {phases.map(([number, label, detail], index) => (
                <button
                  key={number}
                  type="button"
                  className={index === phase ? 'phase active' : 'phase'}
                  onClick={() => jumpToPhase(index)}
                  aria-pressed={index === phase}
                >
                  <span>{number}</span>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </button>
              ))}
            </div>

            <section className="formation-canvas" aria-label="Map formation radar">
              <DotGrid
                dotSize={3}
                gap={19}
                baseColor="#2d333a"
                activeColor="#f5f7fb"
                proximity={130}
                shockRadius={210}
                shockStrength={2.3}
              />
              <div className="radar-layer" aria-hidden="true">
                <Radar
                  color="#f5f7fb"
                  backgroundColor="#000000"
                  speed={0.72}
                  scale={0.74}
                  ringCount={7}
                  spokeCount={12}
                  ringThickness={0.035}
                  spokeThickness={0.006}
                  sweepSpeed={1.2}
                  sweepWidth={4.2}
                  falloff={1.8}
                  brightness={0.86}
                  mouseInfluence={0.04}
                />
              </div>
              <div className="ripple-layer" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="map-lines" aria-hidden="true">
                {active.nodes.map((node) => (
                  <span key={node.id} className={`map-node ${node.role}`} style={{ left: node.x, top: node.y }}>
                    <i>{node.id}</i>
                    <em>{node.state}</em>
                  </span>
                ))}
                {active.routes.map((route, index) => (
                  <span key={route} className={`route route-${index}`} />
                ))}
              </div>

              <div className="central-copy">
                <span>{phases[phase][1].toUpperCase()}</span>
                <strong>{active.stageCopy[phase]}</strong>
                <p>{active.stageDetail[phase]}</p>
              </div>

              <section className="accepted-output" aria-hidden={!outputOpen}>
                <header>
                  <span>ACCEPTED MAP OUTPUT</span>
                  <button onClick={() => setOutputOpen(false)}>Radar</button>
                </header>
                <h3>{active.output.title}</h3>
                <div className="output-grid">
                  {active.output.entries.map((entry) => (
                    <article key={entry.jurisdiction}>
                      <span>{entry.jurisdiction}</span>
                      <strong>{entry.state}</strong>
                      <p>{entry.claim}</p>
                      <small>{entry.sources}</small>
                    </article>
                  ))}
                </div>
                <div className="packet-preview">
                  <span>MAP PACKET JSON</span>
                  <code>{mapPacket.packetId}</code>
                  <p>
                    {mapPacket.sourceAnchors.length} source anchors · {mapPacket.map.signals.length} map signals · {mapPacket.downstreamUse.allowedTasks.length} downstream tasks
                  </p>
                </div>
              </section>
            </section>

            <footer className="command-bar">
              <label>
                <span>VALIDATOR TASK</span>
                <input value={active.request} readOnly />
              </label>
              <button onClick={replay}>Run Round</button>
            </footer>
          </section>

          <aside className="score-panel">
            <header>
              <span>VALIDATOR SCORECARD</span>
              <strong>{active.validator.overall}</strong>
            </header>

            <p>{active.validator.match}</p>

            <div className="check-list">
              {active.validator.checks.map(([name, value]) => (
                <div className="check" key={name}>
                  <span>{name}</span>
                  <strong>{value.toFixed(2)}</strong>
                  <i><b style={{ width: scorePercent(value) }} /></i>
                </div>
              ))}
            </div>

            <div className="miner-stack">
              <span>MINER SUBMISSIONS</span>
              {miners.map((miner) => (
                <article key={miner.id} className={miner.status.toLowerCase()}>
                  <div>
                    <strong>{miner.id}</strong>
                    <small>{miner.note}</small>
                  </div>
                  <em>{miner.score}</em>
                </article>
              ))}
            </div>

            <div className="miner-entry-card">
              <span>SUBNET MINER ENTRY</span>
              <strong>Hotkey in, claims out, weights back.</strong>
              <p>
                Miners register hotkeys, answer compact challenges, submit structured map claims, and receive validator weight from accepted scores.
              </p>
              <a href="#join-subnet">View access path</a>
            </div>

            <div className="packet-card">
              <span>ACCEPTED PACKET / WEIGHT</span>
              <code>{active.packet.id}</code>
              <div>
                <small>{active.packet.route}</small>
                <strong>{active.packet.score}</strong>
              </div>
              <p>
                Machine-readable LUO map packet for downstream systems. It carries source anchors,
                validator score, unresolved gaps, allowed tasks, and forbidden inferences.
              </p>
              <div className="packet-actions">
                <button onClick={() => { clearPhaseTimers(); setOutputOpen(true); setPhase(3); }}>Open Map</button>
                <button onClick={downloadPacket}>Download JSON</button>
                <button onClick={copyPacket}>{packetCopied ? 'Copied' : 'Copy JSON'}</button>
              </div>
            </div>
          </aside>
        </section>
      </section>

      <FormulaBlock active={active} />

      <section className="case-section" id="cases">
        <div className="section-copy">
          <span>Benchmark cases</span>
          <h2>Two cases, one validator logic.</h2>
          <p>
            OUSG shows product eligibility and cross-jurisdiction transfer boundaries.
            Tornado Cash shows how the subnet preserves regulatory divergence and catches fabricated certainty.
          </p>
        </div>
        <div className="case-grid">
          {Object.entries(cases).map(([id, item]) => {
            const caseMode = item.modes.cross;
            return (
              <article key={id}>
                <span>{item.label}</span>
                <strong>{caseMode.title}</strong>
                <p>{caseMode.request}</p>
                <button onClick={() => { setCaseId(id); setMode('cross'); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Load benchmark
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src={wordmark} alt="" />
          <p>Legal Uncertainty Oracle turns reviewed sources into validator-scored legal map packets.</p>
          <div className="social-row" aria-label="Social links">
            <a href="https://github.com/alexfanzong/LUO-subnet-demo" target="_blank" rel="noreferrer noopener">GH</a>
            <a href="#top">X</a>
            <a href="#top">DC</a>
          </div>
        </div>
        <div>
          <strong>Product</strong>
          <a href="#demo">Dashboard</a>
          <a href="#join-subnet">Miner entry</a>
          <a href="#mechanism">Subnet round</a>
          <a href="#scoring">Validator score</a>
        </div>
        <div>
          <strong>Resources</strong>
          <a href="#sources">Source packs</a>
          <a href="#cases">Benchmarks</a>
          <a href="https://taostats.io/subnets" target="_blank" rel="noreferrer noopener">Subnet explorer</a>
        </div>
        <div>
          <strong>Company</strong>
          <a href="#top">Legal Uncertainty Oracle</a>
          <a href="#top">Testnet-ready prototype</a>
          <a href="#top">Contact</a>
        </div>
        <small>© 2026 LUO. Source-backed map formation for Bittensor subnet deployment.</small>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
