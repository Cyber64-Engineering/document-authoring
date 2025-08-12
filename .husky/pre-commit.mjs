import { exec } from 'node:child_process';

const run = (cmd) =>
  new Promise((resolve, reject) =>
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject();
      if (stderr) reject(stderr);
      resolve(stdout);
    }),
  );

const changeset = await run('git diff --cached --name-only --diff-filter=ACMR');
const modifiedFiles = changeset.split('\n').filter(Boolean);

// check if there are any model files staged
const modifledPartials = modifiedFiles.filter((file) => file.match(/^ue\/models\/.*\.json/));
if (modifledPartials.length > 0) {
  const output = await run('npm run build:json --silent');
  console.log(output);
  await run('git add .');
}

// ESLint fix on staged .js and .css files inside blocks/
const jsFiles = modifiedFiles.filter((file) => file.startsWith('blocks/') && file.endsWith('.js'));
const cssFiles = modifiedFiles.filter((file) => file.startsWith('blocks/') && file.endsWith('.css'));
function section(title, icon) {
  const line = '─'.repeat(3) + '>';
  console.log(`\n${line} ${icon} ${title}\n`);
}

try {
  section('Linting', '🧹');
  if (jsFiles.length > 0) {
    const jsToFix = jsFiles.map((f) => `"${f}"`).join(' ');
    console.log('Running ESLint fix on staged JS files:\n', jsToFix);
    await run(`eslint --fix ${jsToFix}`);
    await run(`git add ${jsToFix}`);
  } else {
    console.log('No staged JS files in blocks/ to lint.');
  }
  if (cssFiles.length > 0) {
    console.log(separator);
    const cssToFix = cssFiles.map((f) => `"${f}"`).join(' ');
    console.log('Running stylelint fix on staged CSS files:\n', cssToFix);
    await run(`stylelint --fix ${cssToFix}`);
    await run(`git add ${cssToFix}`);
  } else {
    console.log('No staged CSS files in blocks/ to lint.');
  }

  section('Tests', '🧪');
  console.log('Running test script');
  await run('npm run test');
  section('Pre-commit checks passed. Commiting staged files.', '✅ ');
} catch {
  section('Pre-commit checks failed. Please fix the errors above before committing.', '❌');
  process.exit(1);
}
