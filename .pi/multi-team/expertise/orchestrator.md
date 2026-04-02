# orchestrator — Expertise

*This file is maintained by the orchestrator agent. It grows over sessions.*

---

## 2026-04-01 — Marketplace Deployment Attempt #1

### Confirmed [HOT]
- **Transport**: StreamableHTTP via Express is correct. Confirmed from dedalus-refs source.
- **Auth headers**: Bearer → apiKey, x-dedalus-api-key → apiKey. Our auth.ts matches exactly.
- **Build system**: Dedalus bundles with bun on their platform.
- **Runtime**: node >=18.0.0.
- **manifest.json is required**: DXT v0.2 format at repo root. Was missing — caused the first build failure. Now added at `manifest.json`. Entry point: `dist/index.js`.
- **Build passes locally**: `pnpm build:local` clean, `vitest run` 436/436 passing as of this session.

### Decisions [HOT]
- **Server-list discovery**: Using public Marketplace catalog API (`https://www.dedaluslabs.ai/api/marketplace`), filtering `tags.auth.none === true`, using slugs as `mcp_servers` values. Not yet confirmed correct but proceeding — will be validated by live deployment.
- **DEDALUS_API_KEY is optional at server level**: Auth arrives per-request via Bearer header from the caller. Server-side env var is a fallback only.
- **Supabase not required for core gateway**: Only needed if `THOUGHTBOX_STORAGE=supabase`. Default is filesystem.

### Watch Out For [HOT]
- **ESM vs CJS**: Our `package.json` has `"type": "module"`. Both Dedalus reference servers use `"type": "commonjs"`. Bun builds locally succeed with ESM, but Dedalus's runtime may expect CJS output. This is the next likely failure point if the manifest.json fix isn't sufficient.
- **manifest.json entry_point**: Points to `dist/index.js`. The `dist/` directory is built output — Dedalus's platform must run `build` before `start`, or the entry point won't exist. Confirm their platform runs the build step.

### Stepping Stones [HOT]
- **Missing manifest.json** → build failed immediately after "Bundling with bun" with no error message → added manifest.json → retry pending. If next attempt fails at same point, ESM/CJS is the next hypothesis.

### Open Questions
- Does the next deployment attempt succeed now that manifest.json is present?
- If it fails: is it the ESM/CJS mismatch?
- Once deployed: do slugs from the public catalog API work as `mcp_servers` values at runtime?
