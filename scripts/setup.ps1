param(
    [Parameter(Position = 0)]
    [ValidateSet("setup", "check", "build", "up", "down", "logs", "clean", "prod")]
    [string]$Command = "build"
)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

$Compose = if ($env:COMPOSE) { $env:COMPOSE } else { "docker compose" }
$ComposeFile = if ($env:COMPOSE_FILE) { $env:COMPOSE_FILE } else { "docker-compose.yml" }
$ProdComposeFile = if ($env:PROD_COMPOSE_FILE) { $env:PROD_COMPOSE_FILE } else { "docker-compose.prod.yml" }
$EnvFile = if ($env:ENV_FILE) { $env:ENV_FILE } else { ".env" }
$EnvExample = if ($env:ENV_EXAMPLE) { $env:ENV_EXAMPLE } else { ".env.example" }

function Write-Info($Message) {
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Ok($Message) {
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Err($Message) {
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Invoke-Compose {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Args
    )

    & docker compose @Args
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose failed with exit code $LASTEXITCODE"
    }
}

function Require-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Err "Docker is not installed."
        Write-Host "Install Docker Desktop: https://docs.docker.com/get-docker/"
        exit 1
    }

    & docker info *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Docker is installed but not running."
        Write-Host "Start Docker Desktop, then run this command again."
        exit 1
    }

    & docker compose version *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Docker Compose v2 is required (the 'docker compose' plugin)."
        exit 1
    }
}

function Ensure-Env {
    if (-not (Test-Path $EnvFile)) {
        if (-not (Test-Path $EnvExample)) {
            Write-Err "Missing $EnvExample"
            exit 1
        }
        Copy-Item $EnvExample $EnvFile
        Write-Ok "Created $EnvFile from $EnvExample"
    }
    else {
        Write-Info "Using existing $EnvFile"
    }
}

function Print-Urls {
    Write-Host ""
    Write-Ok "Tin Kolektif is starting."
    Write-Host ""
    Write-Host "  App:          http://localhost:8080"
    Write-Host "  API:          http://localhost:8000/"
    Write-Host "  Django admin: http://localhost:8000/admin/"
    Write-Host ""
    Write-Host "Demo accounts:"
    Write-Host "  admin / admin12345"
    Write-Host "  demo  / demo12345"
    Write-Host ""
    Write-Host "Stop with: .\scripts\setup.ps1 down"
    Write-Host "Logs with: .\scripts\setup.ps1 logs"
    Write-Host ""
}

function Print-ProdUrls {
    Write-Host ""
    Write-Ok "Production-like stack is starting."
    Write-Host ""
    Write-Host "  App: http://localhost:8080"
    Write-Host ""
}

switch ($Command) {
    "setup" {
        Require-Docker
        Ensure-Env
        Write-Ok "Environment is ready."
    }
    "check" {
        Require-Docker
        Write-Ok "Docker is installed and running."
    }
    "build" {
        Require-Docker
        Ensure-Env
        Print-Urls
        Invoke-Compose @("-f", $ComposeFile, "up", "--build")
    }
    "up" {
        Require-Docker
        Ensure-Env
        Print-Urls
        Invoke-Compose @("-f", $ComposeFile, "up")
    }
    "down" {
        Require-Docker
        Invoke-Compose @("-f", $ComposeFile, "down")
        Write-Ok "Development stack stopped."
    }
    "logs" {
        Require-Docker
        Invoke-Compose @("-f", $ComposeFile, "logs", "-f")
    }
    "clean" {
        Require-Docker
        Invoke-Compose @("-f", $ComposeFile, "down", "-v", "--remove-orphans")
        Write-Ok "Development stack stopped and volumes removed."
    }
    "prod" {
        Require-Docker
        Ensure-Env
        Print-ProdUrls
        Invoke-Compose @("-f", $ProdComposeFile, "up", "--build")
    }
}
