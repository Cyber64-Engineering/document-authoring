const path = require('path');
const fs = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const sass = require('sass');

// Ensure 'scss' folders exist in blocks and styles
const ensureScssFolders = async () => {
  const blocksPath = path.join(__dirname, 'blocks');
  if (existsSync(blocksPath)) {
    const blocks = await fs.readdir(blocksPath, { withFileTypes: true });
    for (const block of blocks) {
      if (block.isDirectory()) {
        const scssPath = path.join(blocksPath, block.name, 'scss');
        if (!existsSync(scssPath)) {
          mkdirSync(scssPath);
          console.log(`📁 Created: ${scssPath}`);
        }
      }
    }
  }

  const stylesScss = path.join(__dirname, 'styles', 'scss');
  if (!existsSync(stylesScss)) {
    mkdirSync(stylesScss, { recursive: true });
    console.log(`📁 Created: ${stylesScss}`);
  }
};

// Compile a single SCSS file and save CSS one level up from 'scss' folder
const compileScssFile = async (scssFile) => {
  try {
    const result = sass.compile(scssFile);

    if (!result.css.trim()) {
      console.warn(`⚠️ Skipped empty SCSS: ${scssFile}`);
      return;
    }

    const scssFolder = path.dirname(scssFile);
    const outputDir = path.dirname(scssFolder); // one level up from scss
    const fileName = path.basename(scssFile, '.scss');
    const outFile = path.join(outputDir, `${fileName}.css`);

    await fs.writeFile(outFile, result.css);
    console.log(`✅ Compiled ${scssFile} → ${outFile}`);
  } catch (err) {
    console.error(`❌ SCSS Compile Error in ${scssFile}:\n`, err.message);
  }
};

// Process all SCSS files in blocks/*/scss and styles/scss
const processScssFiles = async () => {
  const blocksPath = path.join(__dirname, 'blocks');
  if (existsSync(blocksPath)) {
    const blocks = await fs.readdir(blocksPath, { withFileTypes: true });
    for (const block of blocks) {
      if (block.isDirectory()) {
        const scssDir = path.join(blocksPath, block.name, 'scss');
        if (existsSync(scssDir)) {
          const files = await fs.readdir(scssDir);
          for (const file of files) {
            if (file.endsWith('.scss')) {
              await compileScssFile(path.join(scssDir, file));
            }
          }
        }
      }
    }
  }

  const stylesScssDir = path.join(__dirname, 'styles', 'scss');
  if (existsSync(stylesScssDir)) {
    const styleFiles = await fs.readdir(stylesScssDir);
    for (const file of styleFiles) {
      if (file.endsWith('.scss')) {
        await compileScssFile(path.join(stylesScssDir, file));
      }
    }
  }
};

const run = async () => {
  await ensureScssFolders();
  await processScssFiles();
};

run();
