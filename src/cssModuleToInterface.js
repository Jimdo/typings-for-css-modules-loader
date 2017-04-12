import path from 'path';

const filenameToInterfaceName = (filename) => {
  return path.basename(filename)
    .replace(/^(\w)/, (_, c) => 'I' + c.toUpperCase())
    .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleKeys, indent = '  ', useSemicolons = true) => {
  return cssModuleKeys
    .map((key) => `${indent}'${key}': string${useSemicolons ? ';' : ''}`)
    .join('\n');
};

const cssModuleToNamedExports = (cssModuleKeys, useSemicolons) => {
  return cssModuleKeys
    .map((key) => `export const ${key}: string${useSemicolons ? ';' : ''}`)
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

export const generateNamedExports = (cssModuleKeys, useSemicolons = true) => {
  const namedExports = cssModuleToNamedExports(cssModuleKeys, useSemicolons);
  return (`${namedExports}
`);
};

export const generateGenericExportInterface = (cssModuleKeys, filename, indent, useSemicolons = true) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, indent, useSemicolons);
  return (
`export interface ${interfaceName} {
${interfaceProperties}
}

export const locals: ${interfaceName}${useSemicolons ? ';' : ''}
`);
};
