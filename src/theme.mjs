import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { getCSSColors } from './main.mjs';

const BASE_COLORS = {
  blue: '#2b73fe',
  gold: '#bb8446',
  indigo: '#6610f2',
  purple: '#6f42c1',
  lightIndigo: '#7158e2',
  pink: '#e83e8c',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#28a745',
  teal: '#20c997',
  cyan: '#17a2b8',
  white: '#fff',
  black: '#000',
  lightBlack: '#2b2927',
  gray: '#8697A8',
  darkGray: '#44566C',
  lighting: '#F8FAFB',
  lightGray: '#EAEDF0',
  grey: '#C0C0C0',
};

const STATUS_COLORS = {
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
};

const MAIN_COLORS = {
  primary: BASE_COLORS.blue,
  secondary: BASE_COLORS.gray,
};

function template(variables) {
  return `:root {
          ${variables}
    }`;
}

function normalizeCSSVariablesContent(variables = {}) {
  let str = '';


  for (const cssVar in variables) {
    str += `${cssVar}: ${variables[cssVar]};\n`;
  }

  return str
}

function generateCSSFile() {
  const theme = getCSSColors({
    baseColors: BASE_COLORS,
    mainColors: MAIN_COLORS,
    statusColors: STATUS_COLORS,
    count: 15,
  });

  const colors = theme.utils.getVariables(theme.variables);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputPath = path.resolve(__dirname, '../');

  const content = normalizeCSSVariablesContent(colors)
  const themeBody = template(content);

  fs.writeFile(
    path.join(outputPath, 'colors.css'),
    themeBody,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

generateCSSFile();
