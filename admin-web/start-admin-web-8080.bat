@echo off
setlocal
cd /d "%~dp0"
C:\C\python313\python.exe -m http.server 8080 --bind 0.0.0.0 --directory dist >> server-8080.log 2>&1
endlocal
