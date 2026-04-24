@echo off
echo ======================================================
echo 1. ESECUZIONE TEST FRONTEND (npm)
echo ======================================================
cd /d "c:\Users\serafino.corriero\Desktop\bookstore\frontend"
call npm test
echo.
pause

echo ======================================================
echo 2. ESECUZIONE TEST BACKEND (Maven)
echo ======================================================
cd /d "c:\Users\serafino.corriero\Desktop\bookstore\backend"
call mvnw test
pause