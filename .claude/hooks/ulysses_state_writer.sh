#!/usr/bin/env bash
# PostToolUse: maintain Ulysses surprise state without depending on Beads.
set -uo pipefail

ulysses_state_dir="${CLAUDE_PROJECT_DIR:-.}/.claude/state/ulysses"
session_file="$ulysses_state_dir/session.json"
mkdir -p "$ulysses_state_dir"

input_json=$(cat)
tool_name=$(echo "$input_json" | jq -r '.tool_name // empty' 2>/dev/null)
command=$(echo "$input_json" | jq -r '.tool_input.command // empty' 2>/dev/null)
stdout=$(echo "$input_json" | jq -r '.tool_response.stdout // empty' 2>/dev/null)
exit_code=$(echo "$input_json" | jq -r '.tool_response.exit_code // 0' 2>/dev/null)

ensure_session_file() {
  if [[ ! -f "$session_file" ]]; then
    jq -n '{surprise_count: 0, updated_at: null}' > "$session_file"
  fi
}

log_error() {
  local message="$1"
  local error_log="${CLAUDE_PROJECT_DIR:-.}/.claude/state/hook-errors.jsonl"
  printf '{"ts":"%s","hook":"ulysses_state_writer","error":"%s"}\n' \
    "$(date -u +%FT%TZ)" "$message" >> "$error_log"
}

if [[ "$tool_name" == "Bash" ]]; then
  is_failure=false

  if [[ "$exit_code" != "0" ]]; then
    if [[ "$command" != *"git status"* && "$command" != *"git diff"* \
       && "$command" != *"git log"* && "$command" != *"--help"* \
       && "$command" != *"trash "* ]]; then
      is_failure=true
    fi
  fi

  if [[ "$command" == *"vitest"* && "$stdout" == *"FAIL"* ]]; then
    is_failure=true
  fi

  if [[ "$command" == *"supabase"* && "$command" == *"reset"* && "$exit_code" != "0" ]]; then
    is_failure=true
  fi

  if [[ "$is_failure" == "true" ]]; then
    ensure_session_file
    (
      flock -x 200
      tmp=$(mktemp)
      old_count=$(jq -r '.surprise_count // 0' "$session_file" 2>/dev/null || echo 0)
      new_count=$((old_count + 1))
      if jq --argjson c "$new_count" --arg ts "$(date -u +%FT%TZ)" \
          '.surprise_count = $c | .updated_at = $ts' "$session_file" > "$tmp" 2>/dev/null; then
        mv "$tmp" "$session_file"
      else
        rm -f "$tmp"
        log_error "jq failed updating surprise_count"
      fi

      if [[ "$new_count" -ge 2 ]]; then
        touch "$ulysses_state_dir/reflect-required"
      fi
    ) 200>"$session_file.lock"
  fi

  if [[ "$command" == *"ulysses"* && "$command" == *"reflect"* ]] \
     || [[ "$command" == *"thoughtbox_gateway"* && "$command" == *"reflect"* ]]; then
    rm -f "$ulysses_state_dir/reflect-required"
    if [[ -f "$session_file" ]]; then
      (
        flock -x 200
        tmp=$(mktemp)
        if jq --arg ts "$(date -u +%FT%TZ)" '.surprise_count = 0 | .updated_at = $ts' \
            "$session_file" > "$tmp" 2>/dev/null; then
          mv "$tmp" "$session_file"
        else
          rm -f "$tmp"
          log_error "jq failed resetting surprise_count on reflect"
        fi
      ) 200>"$session_file.lock"
    fi
  fi
fi

exit 0
