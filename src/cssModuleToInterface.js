import path from 'path';

const filenameToInterfaceName = (filename) => {
  return path.basename(filename)
    .replace(/^(\w)/, (_, c) => 'I' + c.toUpperCase())
    .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleObject, indent = '  ') => {
  return Object.keys(cssModuleObject)
    .map((key) => `${indent}'${key}': string;`)
    .join('\n');
};

export const filenameToTypingsFilename = (filename) => {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.d.ts`);
};

export const generateInterface = (cssModuleObject, filename, indent) => {
  const interfaceName = filenameToInterfaceName(filename);
  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleObject, indent);
  return (
`export interface ${interfaceName} {
${interfaceProperties}
}
declare const styles: ${interfaceName};

export default styles;
`);
};
