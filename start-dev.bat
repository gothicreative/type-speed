@echo off
echo Starting SpeedType Trainer Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Development servers started!
echo Frontend will be available at http://localhost:5175 (or next available port)
echo Backend API will be available at http://localhost:5000
echo.
echo Press any key to exit...
pause >nul