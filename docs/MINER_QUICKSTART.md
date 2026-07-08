# LUO Miner Quickstart

This quickstart is for participants who want to join the LUO testnet subnet as miners and submit an OUSG legal uncertainty map.

You do not need a legal background. You are not being asked to give legal advice. Your task is to produce a structured, source-backed Map Packet that preserves jurisdictional divergence and uncertainty boundaries.

## 1. Register A Miner Hotkey

LUO is live on Bittensor testnet:

```text
network: test
netuid: 525
subnet: LUO
```

Register your miner hotkey:

```bash
btcli subnet register \
  --wallet-name <your_wallet_name> \
  --hotkey <your_miner_hotkey> \
  --netuid 525 \
  --network test
```

Confirm you are visible in the subnet:

```bash
btcli subnet show --netuid 525 --network test
```

Keep your wallet password, seed phrase, private key, and local wallet files private.

## 2. Read The Challenge

Open the public challenge payload:

- [OUSG challenge](../public/ousg_challenge.json)
- [Miner submission template](../public/miner_submission_template.json)
- [Miner submission schema](../public/miner_submission.schema.json)

The demo challenge:

```text
Map OUSG eligibility and transfer boundaries across the United States, Hong Kong, Singapore, and the European Union.

Preserve jurisdictional divergence. Do not turn silence, conditional frameworks, or classification gaps into permission.
```

Required jurisdictions:

```text
US, HK, SG, EU
```

## 3. Produce A Map Packet

Use any research workflow you like:

- Claude, ChatGPT, Perplexity, local models, or another agent
- public regulator pages
- official issuer documentation
- legal databases or source collections you have access to
- your own retrieval and citation checker

Your output must follow the miner submission shape:

```text
citations
mapClaims
divergencePairs
unresolvedGaps
```

Good packets usually answer:

- What can be said for each jurisdiction?
- Which source supports each claim?
- Where do jurisdictions diverge?
- What remains unresolved?
- What should not be inferred from the available sources?

## 4. How The Validator Scores

The validator scores the packet, not the model brand.

| Dimension | Weight | What The Validator Checks |
| --- | ---: | --- |
| `citation_validity` | 50% | Are cited sources real, relevant, and connected to the claim? |
| `divergence_fidelity` | 30% | Does the packet preserve real jurisdictional differences? |
| `reasoning_coherence` | 15% | Do claims, citations, and conclusions form a coherent chain? |
| `coverage_breadth` | 5% | Are the required jurisdictions covered without padding? |

Unsupported source claims are not eligible for emission weight in the validator round.

## 5. Attack The System

This demo can be played adversarially. You may try to break the validator with:

- invented citations,
- real citations that do not support the claim,
- one global answer that ignores jurisdiction differences,
- overconfident claims where the source is silent,
- missing jurisdictions,
- vague legal prose without source anchors.

The goal is to test whether LUO can separate a reliable Map Packet from a fluent but unsupported answer.

## 6. Submission Format

Submit one JSON file using:

- `schemaVersion`: `luo.miner_submission.v1`
- `challengeId`: `LUO-OUSG-XJ-V1`
- `minerHotkey`: your miner hotkey or UID label
- `requiredJurisdictions`: `["US", "HK", "SG", "EU"]`

Use [public/miner_submission_template.json](../public/miner_submission_template.json) as a starter.

## 7. What Happens After Submission

The validator will:

1. identify your UID,
2. check your packet against the schema,
3. score the four dimensions,
4. explain major penalties,
5. convert accepted scores into UID weight recommendations.

In the live subnet, validator scores are converted into UID weights for miner emission share.

