// ====================================
// SCRIPT INSTALL.BAT PARA WINDOWS
// Salve como: install.bat na pasta raiz do projeto
// ====================================

@echo off
echo 🚀 Instalando SYNTRA ERP para Windows...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado. Instale Node.js versao 16 ou superior.
    echo Baixe em: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar se MySQL está instalado
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL nao encontrado. Instale MySQL versao 8.0 ou superior.
    echo Baixe em: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo ✅ Dependencias verificadas

REM Remover package.json corrompido se existir
if exist package.json (
    echo 🗑️ Removendo package.json corrompido...
    del package.json
)

REM Criar package.json correto
echo 📦 Criando package.json...
(
echo {
echo   "name": "syntra-erp",
echo   "version": "1.0.0",
echo   "description": "Sistema ERP para PMEs em Mocambique",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js",
echo     "dev": "nodemon server.js"
echo   },
echo   "dependencies": {},
echo   "devDependencies": {}
echo }
) > package.json

REM Instalar dependências
echo 📦 Instalando dependencias...
call npm install express ejs mysql2 sequelize bcryptjs express-session express-validator multer moment cors helmet compression dotenv express-flash connect-flash express-rate-limit

REM Instalar dependências de desenvolvimento
echo 📦 Instalando dependencias de desenvolvimento...
call npm install --save-dev nodemon

REM Criar diretórios necessários
echo 📁 Criando estrutura de pastas...
if not exist "src\public\uploads" mkdir "src\public\uploads"
if not exist "src\public\images" mkdir "src\public\images"
if not exist "src\public\css" mkdir "src\public\css"
if not exist "src\public\js" mkdir "src\public\js"
if not exist "logs" mkdir "logs"

REM Criar arquivo .env se não existir
if not exist .env (
    echo ⚙️ Criando arquivo .env...
    (
    echo NODE_ENV=development
    echo PORT=3000
    echo.
    echo # Database
    echo DB_HOST=localhost
    echo DB_PORT=3306
    echo DB_NAME=syntra_erp
    echo DB_USER=root
    echo DB_PASS=
    echo.
    echo # Session
    echo SESSION_SECRET=syntra-erp-secret-key-2024
    echo.
    echo # App
    echo APP_NAME=SYNTRA ERP
    echo APP_URL=http://localhost:3000
    echo APP_VERSION=1.0.0
    ) > .env
)

echo.
echo 🗄️ Configurando banco de dados...
echo IMPORTANTE: Execute este comando no MySQL:
echo CREATE DATABASE IF NOT EXISTS syntra_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo.

echo ✅ Instalacao concluida!
echo.
echo 📋 Proximos passos:
echo 1. Configure as variaveis no arquivo .env
echo 2. Execute: npm run dev
echo 3. Acesse: http://localhost:3000
echo 4. Use admin@syntra.co.mz / admin123 para fazer login
echo.
pause