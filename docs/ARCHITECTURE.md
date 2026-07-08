# LUO Protocol Overview

Legal Uncertainty Oracle (LUO) is an evidence-layer protocol for producing validator-scored legal uncertainty maps.

It is not a general legal chatbot, and it is not a leaderboard for the best legal AI. LUO evaluates a submitted Map Packet for a concrete question, source boundary, and jurisdiction scope.

LUO is registered on Bittensor testnet as netuid 525. The current public architecture separates the on-chain settlement layer from the off-chain evidence workflow.

## Design Principle

Final legal judgment is bespoke. The evidence layer can be standardized.

LUO standardizes:

- the challenge shape,
- the submission schema,
- source grounding,
- jurisdictional divergence,
- unresolved-gap reporting,
- validator scoring,
- packet output for downstream systems.

LUO does not standardize or replace the final legal opinion.

## Core Loop

```text
Question
  -> reviewed source boundary
  -> compact miner challenge
  -> schema-bound miner submission
  -> validator-scored Map Packet
  -> UID weight output
```

The chain does not store the full validation materials. The chain stores the subnet, registered hotkeys, and validator weights. The evidence workflow remains off-chain so the validation surface can rotate safely.

## 1. Reviewed Source Boundary

Each round begins with a bounded source base and a challenge manifest. The source base is treated as reviewed input for the validator round, not as an open data dump.

This allows miners to compete on retrieval, interpretation, and packet quality while keeping the validation target checkable.

## 2. Miner Submission

Miners submit structured packets, not free-form answers.

A miner packet can include:

- mapped jurisdictions,
- source-backed claims,
- divergence pairs,
- unresolved gaps,
- confidence boundaries,
- citations,
- downstream-use limits.

Miners may use their own models, retrieval systems, citation checkers, and domain-specific workflows. The validator only accepts what survives source-bound review.

## 3. Candidate Sources

Production LUO can allow miners to surface candidate sources.

Candidate sources should be evaluated before they affect the reviewed source base. A useful review process checks source authenticity, date, jurisdiction, relevance, and whether the cited text actually supports the submitted claim.

This gives miners room to contribute discovery and freshness without letting unreviewed material control the map.

## 4. Validator Scoring

The public demo exposes the scoring philosophy:

- citation validity,
- divergence fidelity,
- reasoning coherence,
- coverage breadth.

Unsupported source claims are not eligible for emission weight in the validator round.

The public protocol describes the output shape and scoring philosophy. Production evaluation data and live validation sets should remain separate from public documentation.

## 5. Incentive And Emission Model

LUO does not define a fixed bounty per answer.

Miners compete for subnet emission through UID weights. Validators score Map Packets and convert those scores into weights. This rewards repeatable packet quality over one-off prose: source freshness, jurisdiction-specific retrieval, citation binding, divergence preservation, and stable schema output.

The economic target is not a single legal memo. The target is continuous map maintenance for legal domains where the source landscape changes.

## 6. Why Validators Do Not Self-Answer

A validator could generate a single map, but that would collapse LUO into one supplier.

LUO separates production from scoring:

- the owner defines the subnet direction and public protocol,
- miners monitor sources and produce Map Packets,
- validators compare submissions and settle UID weights,
- downstream users review accepted packets rather than trusting free-form model output.

This makes legal uncertainty mapping contestable and refreshable. It also lets different miners compete on source pipelines, models, retrieval strategies, and domain expertise.

## 7. Rotating Validation

LUO should not rely on a fixed public test set.

The public layer can describe the challenge format, packet schema, and scoring philosophy. The live validation layer can rotate questions, jurisdiction combinations, source manifests, and validation checks across rounds.

This lets miners build durable advantages around evidence pipelines, source review, and citation discipline without making a single round memorisable.

## 8. Map Packet Output

The accepted packet is the commodity LUO produces.

Downstream systems should consume the accepted Map Packet, not a free-form legal answer. A packet can support review dashboards, compliance preflight, agent execution constraints, audit trails, and counsel-facing source review.

## Scope

LUO is strongest in high-uncertainty legal domains:

- Web3 and tokenized assets,
- AI governance,
- RWA distribution,
- sanctions-sensitive products,
- custody and market-entry questions,
- cross-border compliance.

These domains change quickly, differ across jurisdictions, and often do not have a single stable public answer.
