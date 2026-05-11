@echo off
title Mercado Central BH - Servidor HTTPS (Porta 8501)
color 0A
echo.
echo  =====================================================
echo    MERCADO CENTRAL BH - Iniciando Servidor HTTPS...
echo    Porta: 8501
echo  =====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo  ERRO: Node.js nao esta instalado!
  echo  Baixe em: https://nodejs.org
  pause
  exit /b 1
)

echo  Abrindo navegador em 2 segundos...
echo.
echo  AVISO: O navegador vai mostrar aviso de segurança.
echo  Clique em "Avancado" e depois "Continuar assim mesmo"
echo  Isso e normal para uso interno.
echo.
timeout /t 2 /nobreak >nul
start https://localhost:8501

node servidor.js
pause
