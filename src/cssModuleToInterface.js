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

export const filenameToTypingsFilename = (filename, pathPrefix, contextPath) => {
  // Default implementation: co-locate .d.ts with the resource
  const pathPrefixCallbackDefault = function (filename) {
    const dirName = path.dirname(filename);
    const baseName = path.basename(filename);
    return path.join(dirName, baseName + '.d.ts');
  };

  let pathPrefixCallback = pathPrefixCallbackDefault;

  if (pathPrefix) {
    switch (typeof pathPrefix) {
    case 'string': {
      if (pathPrefix.endsWith(path.sep)) {
        pathPrefix = pathPrefix.slice(0, -1);
      }
      let dirName = path.dirname(filename);
      const baseName = path.basename(filename);
      // There are three cases here:
      //  1. filename is within the webpack context: add the prefix
      if (dirName.startsWith(contextPath)) {
        dirName = dirName.slice(contextPath.length);
        pathPrefixCallback = function () {
          return path.join(contextPath, pathPrefix, dirName, baseName + '.d.ts');
        };
      }
      //  2. pathPrefix is absolute
      //  3. filename is outside the webpack context
      else {
        // Use the default implementation for co-locating the .d.ts
      }
      break;
    }

    case 'function':
      // Use the user-configured filename mapping function
      pathPrefixCallback = pathPrefix;
      break;

    default:
      // Bad configuration
      return undefined;
    }
  }

  return pathPrefixCallback(filename, contextPath);
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
