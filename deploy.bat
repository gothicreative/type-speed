@echo off
echo SpeedType Trainer Deployment Script
echo ==================================

echo.
echo 1. Building the frontend...
cd client
npm run build
if %errorlevel% neq 0 (
    echo Error building frontend
    exit /b %errorlevel%
)
echo Frontend build completed successfully!

echo.
echo 2. Preparing for deployment...
cd ..
echo Creating deployment package...

echo.
echo Deployment preparation completed!
echo.
echo To deploy to Vercel:
echo 1. Install Vercel CLI: npm install -g vercel
echo 2. Run: vercel login
echo 3. Run: vercel --prod
echo.
echo Make sure to set the following environment variables in your Vercel project:
echo - MONGO_URI: Your MongoDB connection string
echo - JWT_SECRET: A secure random string for JWT token generation