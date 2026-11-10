$ErrorActionPreference = "Stop"

# This script helps initialize the ideas directory for the idea-refine skill on Windows PowerShell.
$IdeasDir = "docs/ideas"

if (-not (Test-Path $IdeasDir)) {
    New-Item -ItemType Directory -Force -Path $IdeasDir | Out-Null
    [Console]::Error.WriteLine("Created directory: $IdeasDir")
} else {
    [Console]::Error.WriteLine("Directory already exists: $IdeasDir")
}

Write-Output "{`"status`": `"ready`", `"directory`": `"$IdeasDir`"}"
