#!/usr/bin/env bash
# Stop: Landing-the-plane reminder.
# Warns if work isn't committed/pushed.
set -uo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"

input_json=$(cat)

# ── Prevent infinite loop ─────────────────────────────────────────
stop_hook_active=$(echo "$input_json" | jq -r '.stop_hook_active // false' 2>/dev/null)
if [[ "$stop_hook_active" == "true" ]]; then
  exit 0
fi

issues=""

# ── Check 1: Uncommitted changes ─────────────────────────────────
uncommitted=$(git -C "$project_dir" status --porcelain 2>/dev/null | grep -cv '^??')                                                    
uncommitted=${uncommitted:-0}        
if [[ "$uncommitted" -gt 0 ]]; then
  issues+="$uncommitted uncommitted files. "
fi

# ── Check 2: Unpushed commits ────────────────────────────────────
unpushed=$(git -C "$project_dir" log --oneline "@{push}..HEAD" 2>/dev/null | wc -l | tr -d ' ')
if [[ "$unpushed" -gt 0 ]]; then
  issues+="$unpushed unpushed commits. "
fi

# ── Decision ──────────────────────────────────────────────────────
if [[ -n "$issues" ]]; then
  echo "WARNING: Work not landed: ${issues}Commit and push before stopping." >&2
fi

exit 0
