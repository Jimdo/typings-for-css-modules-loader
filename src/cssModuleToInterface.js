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

export const filenameToTypingsFilename = (filename) => {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.d.ts`);
};

export const generateInterface = (cssModuleKeys, filename, indent) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, indent);
  return (
`export interface ${interfaceName} {
${interfaceProperties}
}
declare const styles: ${interfaceName};

export default styles;
`);
};
