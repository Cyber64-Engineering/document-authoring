const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

console.log('🔁 Starting JSX compilation...');

// Recursively find all "jsx-components" directories inside "blocks"
const findJsxComponentDirs = (dir) => {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'jsx-components') {
        results.push(fullPath);
      } else {
        results.push(...findJsxComponentDirs(fullPath));
      }
    }
  }

  return results;
};

const jsxComponentDirs = findJsxComponentDirs(path.resolve(__dirname, 'blocks'));

jsxComponentDirs.forEach(async (jsxDir) => {
  const baseDir = path.dirname(jsxDir);
  const outDir = path.join(baseDir, 'components');

  console.log(`📂 Ensuring ${outDir} exists`);
  fs.mkdirSync(outDir, { recursive: true });

  // Delete compiled JS files that no longer have matching .jsx source
  const compiledFiles = await fsp.readdir(outDir);
  for (const compiledFile of compiledFiles) {
    if (compiledFile.endsWith('.js')) {
      const baseName = path.basename(compiledFile, '.js');
      const srcFile = path.join(jsxDir, `${baseName}.jsx`);
      const compiledPath = path.join(outDir, compiledFile);
      if (!fs.existsSync(srcFile)) {
        console.log(`🗑️ Deleting ${compiledPath} (no matching source ${srcFile})`);
        await fsp.rm(compiledPath);
      }
    }
  }

  console.log(`📦 Compiling updated files in ${jsxDir} to ${outDir}`);

  const jsxFiles = await fsp.readdir(jsxDir);
  for (const file of jsxFiles) {
    if (!file.endsWith('.jsx')) continue;

    const jsxFile = path.join(jsxDir, file);
    const outFile = path.join(outDir, file.replace(/\.jsx$/, '.js'));

    const jsxStat = await fsp.stat(jsxFile);
    const needsCompile =
      !fs.existsSync(outFile) ||
      (await fsp.stat(outFile)).mtimeMs < jsxStat.mtimeMs;

    if (needsCompile) {
      console.log(`📦 Compiling ${jsxFile} → ${outFile}`);
      try {
        execSync(`npx babel "${jsxFile}" --out-file "${outFile}" --extensions ".jsx"`, {
          stdio: 'inherit',
        });

        console.log(`🔧 Running eslint --fix on ${outFile}`);
        execSync(`npx eslint --fix "${outFile}"`, {
          stdio: 'inherit',
        });
      } catch (err) {
        console.error(`❌ Error compiling ${jsxFile}:\n`, err.message);
      }
    } else {
      console.log(`✅ Skipping ${jsxFile} (no changes)`);
    }
  }
});
