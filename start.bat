@echo off
setlocal
title Marble Blast
cd /d "%~dp0"

echo [Marble Blast] Starting...
where npm >nul 2>nul
if errorlevel 1 (
    echo [Marble Blast] npm not found. Please install it.
    pause
    exit /b 1
)

npm start

if errorlevel 1 (
    echo [Marble Blast] Exited with error code %errorlevel%.
    pause
)
endlocal
