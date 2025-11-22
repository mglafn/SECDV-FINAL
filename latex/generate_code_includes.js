#!/usr/bin/env node
// generate_code_includes.js
// Scans the repository (parent directory) and creates code_includes.tex

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outPath = path.join(__dirname, 'code_includes.tex');

const skipDirs = new Set(['.git', 'node_modules', 'latex', 'public/images']);
const binaryExt = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.exe', '.dll', '.so']);

const langByExt = {
  '.js': 'JavaScript',
  '.json': 'JSON',
  '.css': 'CSS',
  '.hbs': 'HTML',
  '.html': 'HTML',
  '.md': 'text',
  '.txt': 'text',
  '.sql': 'SQL',
  '.py': 'Python'
};

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(__dirname, full).replace(/\\/g, '/');
    // skip designated directories
    const parts = full.split(path.sep).map(p => p.toLowerCase());
    if (parts.some(p => skipDirs.has(p))) continue;
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

const includes = [];

walk(root, (filePath) => {
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return;
  if (stat.size > 200 * 1024) return; // skip very large files
  const ext = path.extname(filePath).toLowerCase();
  if (binaryExt.has(ext)) return;
  // relative path from latex directory
  const rel = path.relative(__dirname, filePath).replace(/\\/g, '/');
  // ensure relative path uses .. prefix when file is outside latex
  const texPath = rel.startsWith('.') ? rel : (rel.startsWith('..') ? rel : '../' + rel);
  const lang = langByExt[ext] || 'text';
  const caption = filePath.replace(/\\/g, '/').replace(root + '/', '');
  includes.push({ path: texPath, lang, caption });
});

let out = '% Auto-generated file: do not edit by hand\n';
for (const item of includes.sort((a,b)=>a.path.localeCompare(b.path))) {
  out += '\\clearpage\n';
  out += `\\subsection*{${item.caption}}\n`;
  out += `\\lstinputlisting[language=${item.lang},caption={\\texttt{${item.caption}}}]{${item.path}}\n\n`;
}

fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath, 'with', includes.length, 'files');
