import path from 'path';

const filenameToInterfaceName = (filename) => {
  return path.basename(filename)
    .replace(/^(\w)/, (_, c) => 'I' + c.toUpperCase())
    .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleKeys, indent = '  ') => {
  return cssModuleKeys
    .map((key) => `${indent}'${key}': string;`)
    .join('\n');
};

const cssModuleToNamedExports = (cssModuleKeys) => {
  return cssModuleKeys
    .map((key) => `export const ${key}: string;`)
    .join('\n');
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

export const filenameToTypingsFilename = (filename) => {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.d.ts`);
};

export const generateNamedExports = (cssModuleKeys) => {
  const namedExports = cssModuleToNamedExports(cssModuleKeys);
  return (`${namedExports}
`);
};

export const generateGenericExportInterface = (cssModuleKeys, filename, indent) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, indent);
  return (
`export interface ${interfaceName} {
${interfaceProperties}
}

export const locals: ${interfaceName};
`);
};

export const generateCombinedInterfaceAndNamedExports = (cleanedDefinitions, filename, indent) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cleanedDefinitions, indent);
  return (
    `export interface ${interfaceName} {
${interfaceProperties}
}

${cssModuleToNamedExports(cleanedDefinitions)}
`);
}