@echo off
echo ========================================
echo Qdrant Setup for Windows
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo Python found!
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Docker is not installed
    echo.
    echo You have two options:
    echo 1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo 2. Use Qdrant Cloud (no Docker needed)
    echo.
    set /p choice="Continue with Qdrant Cloud setup? (y/n): "
    if /i "%choice%" neq "y" (
        echo Setup cancelled
        pause
        exit /b 1
    )
    goto cloud_setup
)

echo Docker found!
echo.

REM Start Qdrant with Docker
echo Starting Qdrant with Docker...
docker ps | findstr qdrant >nul 2>&1
if errorlevel 1 (
    echo Creating Qdrant container...
    docker run -d --name qdrant -p 6333:6333 -p 6334:6334 -v "%cd%\qdrant_storage:/qdrant/storage" qdrant/qdrant
) else (
    echo Qdrant container already running
)

echo.
echo Qdrant started successfully!
echo Dashboard: http://localhost:6333/dashboard
echo.

:install_deps
REM Install Python dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install qdrant-client==1.11.3 sentence-transformers==3.2.1 tqdm

echo.
echo Dependencies installed!
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo .env file created! Please add your MISTRAL_API_KEY
    echo.
)

REM Ask about migration
set /p migrate="Do you have existing embeddings to migrate? (y/n): "
if /i "%migrate%"=="y" (
    echo.
    echo Running migration...
    python migrate_to_qdrant.py
    echo.
)

REM Ask about tests
set /p test="Run tests now? (y/n): "
if /i "%test%"=="y" (
    echo.
    echo Running tests...
    python test_qdrant_search.py
    echo.
)

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Add your MISTRAL_API_KEY to .env file
echo 2. Start your chatbot: python main.py
echo 3. Visit Qdrant dashboard: http://localhost:6333/dashboard
echo.
pause
exit /b 0

:cloud_setup
echo.
echo ========================================
echo Qdrant Cloud Setup
echo ========================================
echo.
echo To use Qdrant Cloud:
echo 1. Sign up at: https://cloud.qdrant.io/
echo 2. Create a cluster
echo 3. Get your cluster URL and API key
echo 4. Update .env file with:
echo    QDRANT_URL=https://your-cluster.qdrant.io
echo    QDRANT_API_KEY=your_api_key
echo.
goto install_deps
