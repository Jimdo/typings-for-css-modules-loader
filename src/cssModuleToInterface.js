import path from 'path';

const filenameToInterfaceName = (filename) => {
  return path.basename(filename)
    .replace(/^(\w)/, (_, c) => 'I' + c.toUpperCase())
    .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleKeys, orderAlphabetically, indent = '  ') => {
  return sortCssModuleKeys(cssModuleKeys, orderAlphabetically)
    .map((key) => `${indent}'${key}': string;`)
    .join('\n');
};

const cssModuleToNamedExports = (cssModuleKeys, orderAlphabetically) => {
  return sortCssModuleKeys(cssModuleKeys, orderAlphabetically)
    .map((key) => `export const ${key}: string;`)
    .join('\n');
};

const sortCssModuleKeys = (cssModuleKeys, orderAlphabetically) => {
  return orderAlphabetically
    ? [...cssModuleKeys].sort()
    : [...cssModuleKeys]
};

const allWordsRegexp = /^\w+$/i;
export const filterNonWordClasses = (cssModuleKeys) => {
  const filteredClassNames = cssModuleKeys.filter(classname => allWordsRegexp.test(classname));
  if (filteredClassNames.length === cssModuleKeys.length) {
    return [filteredClassNames, [],];
  }
  const nonWordClassNames = cssModuleKeys.filter(classname => !allWordsRegexp.test(classname));
  return [filteredClassNames, nonWordClassNames,];
};

// Documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Reserved_keywords_as_of_ECMAScript_2015
const reservedWords = [
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield'
];
export const filterReservedWordClasses = (cssModuleKeys) => {
  const filteredClassNames = cssModuleKeys.filter(classname => reservedWords.indexOf(classname) === -1);
  if (filteredClassNames.length === cssModuleKeys.length) {
    return [filteredClassNames, [],];
  }
  const reservedWordClassNames = cssModuleKeys.filter(classname => reservedWords.indexOf(classname) !== -1);
  return [filteredClassNames, reservedWordClassNames,];
};


export const filenameToTypingsFilename = (filename) => {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.d.ts`);
};

export const generateNamedExports = (cssModuleKeys, orderAlphabetically) => {
  const namedExports = cssModuleToNamedExports(cssModuleKeys, orderAlphabetically);
  return (`${namedExports}
`);
};

export const generateGenericExportInterface = (cssModuleKeys, filename, orderAlphabetically, indent) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, orderAlphabetically, indent);
  return (
`export interface ${interfaceName} {
${interfaceProperties}
}

export const locals: ${interfaceName};
`);
};
