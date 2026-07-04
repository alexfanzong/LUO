<a id="readme-top"></a>

<div align="center">

<img src="public/luo-wordmark.png" alt="LUO logo" width="160">

# LUO Subnet Demo

**Bittensor testnet subnet runtime for validator-scored legal uncertainty maps.**

[View Demo](https://alexfanzong.github.io/LUO-subnet-demo/) ·
[Miner Entry Contract](public/miner_entry.json) ·
[Subnet Status](public/subnet_status.json) ·
[Map Packet Schema](public/map_packet.schema.json)

</div>

---

## What LUO Is

LUO is a public demo of a Bittensor-style subnet runtime where miners produce source-bound legal uncertainty maps and validators convert accepted submissions into UID weights.

LUO does not reward the most confident legal answer. It rewards map packets that preserve evidence boundaries, jurisdictional divergence, and unresolved gaps.

The current public runtime narrative is:

```text
Hotkey identity
  -> Synapse challenge
  -> schema-bound Map Packet response
  -> validator score
  -> hard-gated weight output
```

The flagship public challenge is `LUO-OUSG-XJ-V1`, an OUSG cross-jurisdiction map across the United States, Hong Kong, Singapore, and the European Union.

## Miner Entry

Miners join by hotkey identity. They receive a compact challenge payload, not the validator's full private corpus.

The public challenge shape includes:

```json
{
  "challenge_id": "LUO-OUSG-XJ-V1",
  "question": "Map OUSG eligibility and transfer boundaries...",
  "required_jurisdictions": ["US", "HK", "SG", "EU"],
  "corpus_manifest": {
    "manifest_id": "validator-private-ousg-manifest",
    "schema_uri": "/map_packet.schema.json",
    "as_of_date": "2026-06-07",
    "corpus_hash_commitment": "<validator_private_hash_commitment>"
  }
}
```

Miner responses must be schema-bound Map Packet submissions. The public schema and a small sample packet live at:

- [public/map_packet.schema.json](public/map_packet.schema.json)
- [public/sample_map_packet.json](public/sample_map_packet.json)
- [public/miner_entry.json](public/miner_entry.json)
- [public/subnet_status.json](public/subnet_status.json)

## Validator Scoring

The public demo uses LUO scoring `v1.1`:

| Dimension | Weight | Meaning |
| --- | ---: | --- |
| `citation_validity` | 0.50 | Cited source IDs exist and support the claimed legal boundary. |
| `divergence_fidelity` | 0.30 | The packet preserves real jurisdictional disagreement instead of flattening it. |
| `reasoning_coherence` | 0.15 | Claims, source anchors, and conclusions form a coherent reasoning chain. |
| `coverage_breadth` | 0.05 | Required jurisdictions are covered without rewarding padding. |

Hard gate:

```text
fake source / missing source / synthetic trap hit / mismatched source
  -> zero emission weight
```

The demo status file exposes the public-safe runtime result:

```text
Round: LUO-OUSG-XJ-V1
Winner UID: 3
Winner score: 0.9625
Gate policy: trap hit -> weight 0
```

## Public vs Private Boundary

This repository is the public demonstration surface. It contains:

- React + Vite frontend
- `public/luo_hero.html`
- `public/luo_dots.js` as a read-only hero data file
- public-safe miner entry contract
- public-safe subnet status
- public Map Packet schema
- public sample packet
- historical ideathon docs and demo assets

This repository must not contain:

- production corpus files
- synthetic trap files
- answer keys
- validator scoring internals
- benchmark outputs with hidden evidence
- wallet, hotkey, seed phrase, private key, test TAO, API key, or `.env` files
- screenshots, raw agent state, or unpublished private notes

The production corpus, synthetic traps, answer keys, validator internals, benchmark outputs, and deployment notes stay validator-private.

## Local Development

Install dependencies:

```bash
npm install
```

Run the demo:

```bash
npm run dev -- --port 5177
```

Build the static frontend:

```bash
npm run build
```

The Vite build uses relative asset paths so the generated static bundle can be served from a GitHub Pages project path.

## Repository Structure

```text
.
├── index.html
├── package.json
├── public/
│   ├── luo_hero.html
│   ├── luo_dots.js
│   ├── miner_entry.json
│   ├── subnet_status.json
│   ├── map_packet.schema.json
│   └── sample_map_packet.json
├── src/
│   ├── components/
│   ├── data/
│   ├── assets/
│   ├── main.jsx
│   └── styles.css
├── docs/
├── pitch_demo_terminal/
└── submission_assets/
```

## Status

This repo is public-safe demonstration code. It is not legal advice and does not publish validator-private evaluation assets.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
