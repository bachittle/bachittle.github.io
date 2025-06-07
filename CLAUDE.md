# Codex Parallel Branching Workflow

## Overview
Use Codex to spawn multiple solution branches in parallel, then use Claude Code to combine them into a single optimized commit.

## Detailed Steps

1. **Codex generates parallel branches** 
   - Each branch explores a different implementation/feature
   - All branches fork from the same parent commit (usually master HEAD)

2. **Find all branches from parent commit**
   ```bash
   git branch -a --contains <PARENT_COMMIT_SHA>
   ```
   Example: `git branch -a --contains f075733`
   
   To count only codex branches:
   ```bash
   git branch -a --contains <PARENT_COMMIT_SHA> | grep -E "^\s*remotes/origin/codex/" | wc -l
   ```

3. **Create consolidation branch**
   ```bash
   git checkout <PARENT_COMMIT>
   git checkout -b combine-all-<feature>
   ```
   
   **Note**: If you have local changes (like CLAUDE.md), commit them first:
   ```bash
   git add <files>
   git commit -m "Add local changes"
   ```
   This commit will later be amended to include all cherry-picked changes.

4. **Cherry-pick all commits**
   ```bash
   # List all codex branches with their commits
   for branch in $(git branch -a --contains <PARENT_COMMIT_SHA> | grep -E "^\s*remotes/origin/codex/" | sed 's/^\s*remotes\/origin\///'); do 
       echo "=== $branch ==="
       git log origin/$branch --oneline -5
   done
   
   # Cherry-pick in order
   git cherry-pick <commit1> <commit2> ... <commitN>
   ```
   - Resolve conflicts by keeping all changes when appropriate
   - Common conflict: multiple branches modifying the same index/menu file

5. **Squash into single commit**
   ```bash
   # Reset to base commit, keeping all changes staged
   git reset --soft <PARENT_COMMIT_SHA>
   
   # Amend with comprehensive message (this will include local changes + all cherry-picked changes)
   git commit --amend -m "Add features: X, Y, Z..."
   ```

6. **Push combined branch**
   ```bash
   git push -u origin <branch_name>
   ```

7. **Clean up branches (after user confirmation)**
   ```bash
   # Delete all remote codex branches at once (using PowerShell on Windows/WSL)
   powershell.exe -Command "git push origin --delete branch1 branch2 branch3..."
   
   # Or delete individually
   git push origin --delete branch1 branch2...
   
   # Delete local branches
   git branch -D branch1 branch2...
   ```

## Example: Combining 10 arcade games
- Parent commit: f075733
- Branches found: 10 game implementations
- Result: Single commit with all games, resolved index.html conflicts
- Commit message: "Add 10 arcade games: Chess, Hangman, RPS..."