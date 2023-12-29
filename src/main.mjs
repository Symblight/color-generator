import { colord } from 'colord';

function camelCaseToDash(str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

const generateCSSNameVariable = (name, color) =>
  `--color-${name}: ${colord(color).toHslString()}`;

const generateCSSVariable = (name) => `--color-${camelCaseToDash(name)}`;

const setColorDarken = (color) => colord(color).darken(0.05).toHex();

const setColorLighten = (color) => colord(color).lighten(0.05).toHex();

const transformToCSSVariablesToHSL = (objectColors) =>
  Object.keys(objectColors).reduce(
    (acc, colorKey) => ({
      ...acc,
      [colorKey]: colord(objectColors[colorKey]).toHslString(),
    }),
    {}
  );

const generateCSSVariables = (objectColors) =>
  Object.keys(objectColors).reduce(
    (acc, colorKey) =>
      `${acc}\n${generateCSSNameVariable(
        camelCaseToDash(colorKey),
        objectColors[colorKey]
      )};`,
    ''
  );

const generateCSSOpacitiyVariables = (color, name, count = 10) =>
  [...new Array(count)].reduce(
    (acc, _, index) =>
      `${acc}\n${generateCSSNameVariable(
        `opac-${name}-${index + 1}`,
        colord(color)
          .alpha((index + 1) * 0.05)
          .toHslString()
      )};`,
    ''
  );

const generateCSSOpacitiyVariablesObject = (color, name, count = 10) =>
  [...new Array(count)].reduce(
    (acc, _, index) => ({
      ...acc,
      [`opac-${name}-${index + 1}`]: colord(color)
        .alpha((index + 1) * 0.05)
        .toHslString(),
    }),
    {}
  );

export function getCSSColors({ baseColors, statusColors, mainColors, count = 10 }) {
  const mainColors_DARKEN = {
    primaryDark: setColorDarken(mainColors.primary),
    secondaryDark: setColorDarken(mainColors.secondary),
  };

  const mainColors_LIGHTEN = {
    primaryLight: setColorLighten(mainColors.primary),
    secondaryLight: setColorLighten(mainColors.secondary),
  };

  const getVariables = (variables) => {
    const vars = {};
    for (const key in variables) {
      vars[generateCSSVariable(key)] = variables[key];
    }

    return vars;
  };

  return {
    variables: {
      ...transformToCSSVariablesToHSL(baseColors),
      ...transformToCSSVariablesToHSL(mainColors),
      ...transformToCSSVariablesToHSL(mainColors_DARKEN),
      ...transformToCSSVariablesToHSL(mainColors_LIGHTEN),
      ...transformToCSSVariablesToHSL(statusColors),
      ...generateCSSOpacitiyVariablesObject(baseColors.white, 'w', count),
      ...generateCSSOpacitiyVariablesObject(baseColors.black, 'b', count),
      ...generateCSSOpacitiyVariablesObject(mainColors.primary, 'p', count),
    },
    utils: {
      generateCSSNameVariable,
      generateCSSVariable,
      generateCSSVariables,
      generateCSSOpacitiyVariables,
      generateCSSOpacitiyVariablesObject,
      getVariables,
    },
  };
}
