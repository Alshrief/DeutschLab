@echo off
title DeutschLab - German Learning Platform
echo ========================================================
echo       Starting DeutschLab (Production Mode)
echo ========================================================
echo.
echo Starting backend server on http://localhost:5000 ...
cd /d "%~dp0"
start "" /b npm start
timeout /t 3 /nobreak >nul
echo.
echo Opening DeutschLab in your default browser...
start http://localhost:5000
echo.
echo ========================================================
echo DeutschLab is running on http://localhost:5000
echo You can also access it on mobile via your local Wi-Fi IP!
echo Keep this window open while studying.
echo Close this window or press Ctrl+C to stop.
echo ========================================================
echo.
pause
