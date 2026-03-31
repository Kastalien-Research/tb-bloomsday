# Thoughtbox Specs Inventory

> Updated: 2026-03-30
> Status: Active inventory for the gateway fork

## Active Specs

| ID | Title | Role |
|----|-------|------|
| `SPEC-CORE-002` | Code Mode Thoughtbox | Defines the gateway-first code-mode architecture |
| `SPEC-GW-011` | Gateway Schema Surfacing | Defines how upstream tool metadata and schemas reach code mode |
| `code-mode/target-state` | Hosted Alignment Target State | Defines the desired end-state of the repo after gateway alignment |

## Active Runtime Milestones

1. **Minimal proof**
   - Connect Thoughtbox to an in-repo hosted HTTP MCP fixture
   - Discover upstream tools
   - Return them from `thoughtbox_search`
   - Call one successfully through `thoughtbox_execute`

2. **Useful V1 gateway**
   - Load multiple hosted upstreams from `thoughtbox.gateway.json`
   - Keep an in-memory unified catalog
   - Expose refresh/list/search/call from code mode
   - Handle unavailable upstreams without collapsing the whole surface

## Dormant Areas

The following areas are not active sources of truth for this fork, even if historical files still exist elsewhere in the repo:

- observability / observatory
- notebook and Srcbook features
- self-improvement loop work
- hub-first orchestration product work
- recursive language model work
- Beads-driven workflow state

## Notes

- `old-specs/` is archival only.
- Any document not listed above should be treated as reference material, not implementation guidance, unless it is explicitly reactivated.
