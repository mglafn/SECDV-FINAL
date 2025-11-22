@echo off
REM Build script for Windows (cmd.exe). Run from repository or double-click.
pushd %~dp0
echo Generating LaTeX include file...
node generate_code_includes.js
if errorlevel 1 (
  echo Node script failed. Ensure Node.js is installed.
  popd
  exit /b 1
)
echo Running pdflatex (may run twice to fix references)...
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="%~dp0" main.tex
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="%~dp0" main.tex
if errorlevel 1 (
  echo pdflatex failed. Ensure a LaTeX distribution is installed and in PATH.
  popd
  exit /b 1
)
echo Build complete. Output: %~dp0main.pdf
popd
