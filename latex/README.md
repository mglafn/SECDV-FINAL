# LaTeX Project for SECDV-FINAL

This folder contains a small LaTeX project that compiles a PDF containing the repository's source files.

Files:
- `main.tex` — LaTeX document that pulls in `code_includes.tex`.
- `generate_code_includes.js` — Node.js script that scans the repository and writes `code_includes.tex`.
- `code_includes.tex` — Generated file (not included by default). Created by the script.
- `build.bat` — Windows (`cmd.exe`) build script that runs the generator and `pdflatex`.

Prerequisites:
- Node.js installed and available on PATH (for generator).
- A LaTeX distribution with `pdflatex` on PATH (MiKTeX, TeX Live, etc.).

Usage (Windows `cmd.exe`):

```
cd latex
build.bat
```

What it does:
- `generate_code_includes.js` will scan the repository root (parent directory) and produce `code_includes.tex` with a `\lstinputlisting` section for each text source file (skips common binary files and `node_modules`, `.git`, and the `latex` folder itself).
- `build.bat` then runs `pdflatex` twice to produce `main.pdf` inside the `latex` folder.

Notes:
- If you prefer to run the generator manually, run `node generate_code_includes.js` from the `latex` folder.
- The script limits files to 200KB to avoid embedding very large files. Adjust `generate_code_includes.js` if you want different behavior.
