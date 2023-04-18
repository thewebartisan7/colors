const fs = require('fs');
const path = require('path');
const allColorScales = require('../index');

const outputDir = './sass';

Object.entries(allColorScales).forEach(([colorScaleName, scale]) => {
  const scaleAssCssProperties = Object.entries(scale)
    .map(([name, value]) => `  ${toKebabCase(name)}: ${value},`)
    .join('\n');

  const scaleAsCssFile = `$${toKebabCase(colorScaleName)}: (\n${scaleAssCssProperties}\n);`;

  fs.writeFileSync(
    path.join(outputDir, toKebabCase(colorScaleName) + '.scss'),
    scaleAsCssFile
  );
});

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}