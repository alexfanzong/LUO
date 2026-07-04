# LUO Architecture Overview

LUO is designed as legal uncertainty infrastructure: a system for retrieving legal evidence, preserving jurisdictional disagreement, and validating whether a miner's answer is grounded in real citations.

## Core Loop

```text
User question
  -> miner retrieves jurisdiction-aware evidence
  -> miner produces a cited legal uncertainty map
  -> validator audits citation existence, invalid-source exposure, and claim-evidence closure
  -> consensus rewards faithful uncertainty mapping
```

## Components

### 1. Evidence Corpus

The MVP uses a curated Tornado Cash legal corpus covering four target jurisdictions:

- United States
- Netherlands
- Switzerland
- Hong Kong

The corpus is built to distinguish:

- explicit enforcement positions,
- judicial reversals,
- criminal prosecution theories,
- regulatory silence,
- framework-only materials,
- cross-jurisdiction comparison.

The demo describes this source set at a high level and focuses on the validator flow.

### 2. Miner Retrieval

Miners are expected to retrieve relevant legal evidence before answering. The MVP uses local retrieval for reliability:

- local embeddings,
- vector search,
- source IDs,
- jurisdiction labels,
- legal-position labels.

The important rule is simple: a miner must show its evidence before it claims certainty.

### 3. Invalid-Source Checks

The MVP includes invalid-source checks. These test whether a miner can preserve uncertainty instead of manufacturing a confident answer from fake or mismatched authorities.

Invalid-source checks make fabricated certainty visible inside the scoring loop.

### 4. Validator Audit

Validators evaluate miner outputs across three broad dimensions:

- whether cited source IDs exist,
- whether the miner exposes itself to invalid-source checks,
- whether each claim stays closed within the cited evidence boundary.

The MVP keeps validator scoring reproducible for demo purposes. Later versions can add LLM-as-Judge review and multi-validator consensus.

### 5. Public Demo Surface

The public demo is a static HTML experience that explains the mechanism:

- Opening: why fabricated certainty is dangerous.
- Search: how miner retrieval exposes citations.
- Audit: how validator scoring separates faithful answers from fabricated ones.
- Atlas: how one protocol can have four legal treatments.
- Close: why the subnet rewards uncertainty mapping instead of single-answer generation.

## Roadmap

### Phase 1 - Evidence and Scoring MVP

Completed: static demo, curated corpus, local retrieval, preset miner outputs, validator scoring, optional LLM backend.

### Phase 2 - Staked Challenge Layer

Participants can stake to challenge validator scores. This turns review into an appeal-like mechanism and rewards validators who anticipate durable consensus.

### Phase 3 - RWA Vertical Market

Extend LUO from Tornado Cash to tokenized real-world assets, stablecoins, custody, sanctions, securities, commodities, tax, and cross-border distribution.

### Phase 4 - Production Subnet Candidate

Define miner/validator task specs, publish benchmark subsets, add multi-validator aggregation, and harden the citation audit pipeline.
