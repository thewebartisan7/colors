const fs = require('fs');
const path = require('path');
const allColorScales = require('../index');

const outputDir = './sass';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
  fs.mkdirSync(`${outputDir}/light`);
  fs.mkdirSync(`${outputDir}/dark`);
  fs.mkdirSync(`${outputDir}/overlay`);
}

const light = []
const dark = []
const overlay = []

Object.entries(allColorScales).forEach(([colorScaleName, scale]) => {
  const isDark = /DarkA?$/.test(colorScaleName);
  const isOverlay = ['whiteA', 'blackA'].includes(colorScaleName);

  const scaleAssCssProperties = Object.entries(scale)
    .map(([name, value]) => `  ${toKebabCase(name)}: ${value},`)
    .join('\n');

  const kebabCaseScaleName = toKebabCase(colorScaleName);
  const scaleAsCssFile = `$${kebabCaseScaleName}: (\n${scaleAssCssProperties.replace(/,*$/, '')}\n);`;
  let fileName = `${kebabCaseScaleName}.scss`;

  if (isOverlay) {
    overlay.push(kebabCaseScaleName);
    fileName = `overlay/${fileName}`;
  } else {
    if (isDark) {
      dark.push(kebabCaseScaleName);
      fileName = `dark/${fileName}`;
    } else {
      light.push(kebabCaseScaleName);
      fileName = `light/${fileName}`;
    }
  }

  fs.writeFileSync(
    path.join(outputDir, fileName),
    scaleAsCssFile
  );
});

fs.writeFileSync(
  path.join(outputDir, 'light/index.scss'),
  light.map(f => `@forward '${f}';`).join('\n')
);

fs.writeFileSync(
  path.join(outputDir, 'dark/index.scss'),
  dark.map(f => `@forward '${f}';`).join('\n')
);

fs.writeFileSync(
  path.join(outputDir, 'overlay/index.scss'),
  overlay.map(f => `@forward '${f}';`).join('\n')
);

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}