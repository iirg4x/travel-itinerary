# Switzerland Itinerary — GitHub Pages deploy helper
# Run this from inside the pwa/ folder. Requires: git installed, gh CLI optional.
#
# Usage:  .\deploy.ps1 -RepoName switzerland-trip -GitHubUser yourname
#
# What it does:
#  1. Initializes a git repo in this folder if there isn't one already
#  2. Stages and commits everything
#  3. Adds the GitHub remote (or uses existing)
#  4. Pushes to main
#  5. Prints the GitHub Pages URL you'll need to visit on your iPhone

param(
  [Parameter(Mandatory=$true)] [string]$RepoName,
  [Parameter(Mandatory=$true)] [string]$GitHubUser,
  [string]$Branch = 'main',
  [string]$CommitMessage = 'Deploy Switzerland itinerary PWA'
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host 'git is not installed or not in PATH. Install Git for Windows first: https://git-scm.com/download/win' -ForegroundColor Red
  exit 1
}

# Sanity check — make sure we're in the pwa folder
if (-not (Test-Path './index.html') -or -not (Test-Path './service-worker.js')) {
  Write-Host 'Run this from inside the pwa/ folder (index.html + service-worker.js must be present).' -ForegroundColor Red
  exit 1
}

# Init repo
if (-not (Test-Path '.git')) {
  Write-Host 'Initializing git repo...' -ForegroundColor Cyan
  git init -b $Branch | Out-Null
} else {
  Write-Host 'Existing git repo detected — using it.' -ForegroundColor Yellow
}

# Stage + commit
git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Host 'No changes to commit.' -ForegroundColor Yellow
} else {
  git commit -m $CommitMessage | Out-Null
  Write-Host 'Committed.' -ForegroundColor Green
}

# Configure remote
$remoteUrl = "https://github.com/$GitHubUser/$RepoName.git"
$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote) {
  git remote add origin $remoteUrl
  Write-Host "Remote 'origin' set to $remoteUrl" -ForegroundColor Cyan
} elseif ($existingRemote -ne $remoteUrl) {
  Write-Host "Existing remote: $existingRemote" -ForegroundColor Yellow
  Write-Host "Expected:        $remoteUrl" -ForegroundColor Yellow
  Write-Host "Update with: git remote set-url origin $remoteUrl" -ForegroundColor Yellow
}

# Push
Write-Host "Pushing to $Branch... (you'll be prompted for GitHub credentials)" -ForegroundColor Cyan
git push -u origin $Branch

Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host ' DONE!' -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green
Write-Host ''
Write-Host "Next: enable GitHub Pages"
Write-Host "  1. Open: https://github.com/$GitHubUser/$RepoName/settings/pages"
Write-Host "  2. Source: Deploy from a branch -> Branch: $Branch / (root) -> Save"
Write-Host "  3. Wait ~30s, then open this URL on your iPhone (in Safari):"
Write-Host ""
Write-Host "       https://$GitHubUser.github.io/$RepoName/" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Tap Share -> Add to Home Screen. Done."
Write-Host ''
