const fs = require('fs');
const path = require('path');
const allColorScales = require('../index');

const outputDir = './sass';

const forward = []

Object.entries(allColorScales).forEach(([colorScaleName, scale]) => {
  const scaleAssCssProperties = Object.entries(scale)
    .map(([name, value]) => `$${toKebabCase(name)}: ${value};`)
    .join('\n');

  const kebabCaseScaleName = toKebabCase(colorScaleName);

  // const scaleAsCssFile = `$${kebabCaseScaleName}: (\n${scaleAssCssProperties}\n);`;
  const scaleAsCssFile = `${scaleAssCssProperties}`;

  console.log('scaleAsCssFile', scaleAsCssFile)

  // Add to @forward
  forward.push(kebabCaseScaleName);

  fs.writeFileSync(
    path.join(outputDir, kebabCaseScaleName + '.scss'),
    scaleAsCssFile
  );
});

const indexContent = forward.map(f => {
  return `@forward '${f}';`
}).join('\n');

fs.writeFileSync(
  path.join(outputDir, 'index.scss'),
  indexContent
);

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}