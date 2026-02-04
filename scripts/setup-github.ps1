param(
  [Parameter(Mandatory=$true)]
  [string]$RemoteUrl,

  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

function Assert-Git {
  $git = Get-Command git -ErrorAction SilentlyContinue
  if (-not $git) {
    throw "Git no está instalado o no está en el PATH. Instala 'Git for Windows' y vuelve a ejecutar este script."
  }
}

Assert-Git

if (-not (Test-Path ".git")) {
  git init | Out-Null
}

# Configurar rama principal
git checkout -B $Branch | Out-Null

# Asegurar .gitignore exista
if (-not (Test-Path ".gitignore")) {
  "" | Out-File -Encoding utf8 ".gitignore"
}

# Commit inicial
git add -A
try {
  git commit -m "Initial commit" | Out-Null
} catch {
  # Si no hay cambios para commitear, ignorar
}

# Configurar remote
$existing = (git remote) 2>$null
if ($existing -match "origin") {
  git remote set-url origin $RemoteUrl | Out-Null
} else {
  git remote add origin $RemoteUrl | Out-Null
}

git push -u origin $Branch

Write-Host "✅ Listo. Repo conectado y push realizado a $RemoteUrl" -ForegroundColor Green

