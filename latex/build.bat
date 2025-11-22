@echo off
REM Build script for Windows (cmd.exe) with BibTeX support
REM Run from repository or double-click
pushd %~dp0
echo Generating LaTeX include file...
node generate_code_includes.js
if errorlevel 1 (
  echo Node script failed. Ensure Node.js is installed.
  popd
  exit /b 1
)

echo Running first pdflatex pass...
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="%~dp0" main.tex
if errorlevel 1 (
  echo First pdflatex pass failed.
  popd
  exit /b 1
)

REM Check if references.bib exists before running bibtex
if exist references.bib (
  echo Running BibTeX...
  bibtex main
  if errorlevel 1 (
    echo BibTeX failed. Check for errors in references.bib
    REM Continue anyway - bibliography might be optional
  )
  
  echo Running second pdflatex pass (for bibliography)...
  pdflatex -interaction=nonstopmode -halt-on-error -output-directory="%~dp0" main.tex
)

echo Running final pdflatex pass (to fix references)...
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="%~dp0" main.tex
if errorlevel 1 (
  echo Final pdflatex pass failed.
  popd
  exit /b 1
)

echo.
echo Build complete! Output: %~dp0main.pdf
echo.
popd