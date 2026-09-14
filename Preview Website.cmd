@echo off
title Flash Print Solution - Website Preview
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   Node.js is not installed on this computer.
  echo   Install the LTS version from https://nodejs.org/ then double-click this file again.
  echo.
  pause
  exit /b 1
)
node preview.js
echo.
echo   Preview stopped.
pause
