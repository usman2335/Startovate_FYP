#!/usr/bin/env powershell
# PowerShell script to start LCI ChatBot with Uvicorn

Write-Host "Starting LCI ChatBot with Uvicorn..." -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

Set-Location $PSScriptRoot

# Check if Qdrant is running
Write-Host "Checking if Qdrant is running..." -ForegroundColor Yellow
$qdrantRunning = Get-NetTCPConnection -LocalPort 6333 -ErrorAction SilentlyContinue
if (-not $qdrantRunning) {
    Write-Host "❌ Qdrant is not running! Starting it first..." -ForegroundColor Red
    Set-Location "qdrant_local"
    Start-Process -FilePath "qdrant.exe" -ArgumentList "--config-path", "config.yaml" -WindowStyle Normal
    Set-Location ".."
    Write-Host "Waiting for Qdrant to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} else {
    Write-Host "✅ Qdrant is already running" -ForegroundColor Green
}

Write-Host "Starting ChatBot API with Uvicorn..." -ForegroundColor Green
Write-Host "🌐 Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📊 Health check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "📚 API docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload