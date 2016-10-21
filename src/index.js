import cssLoader from 'css-loader';
import cssLocalsLoader from 'css-loader/locals';
import loaderUtils from 'loader-utils';
import 'colour';

import {
  filterNonWordClasses,
  generateNamedExports,
  generateGenericExportInterface,
  filenameToTypingsFilename,
} from './cssModuleToInterface';
import * as persist from './persist';

function delegateToCssLoader(ctx, input, callback) {
  ctx.async = () => callback;
  cssLoader.call(ctx, input);
}

module.exports = function(input) {
  if(this.cacheable) this.cacheable();

  // mock async step 1 - css loader is async, we need to intercept this so we get async ourselves
  const callback = this.async();

  const query = loaderUtils.parseQuery(this.query);
  const moduleMode = query.modules || query.module;
  if (!moduleMode) {
    console.warn('Typings for CSS-Modules: option `modules` is not active - skipping extraction work...'.red);
    return delegateToCssLoader(this, input, callback);
  }

  // mock async step 2 - offer css loader a "fake" callback
  this.async = () => (err, content) => {
    const filename = this.resourcePath;
    const cssModuleInterfaceFilename = filenameToTypingsFilename(filename);

    let cssModuleKeys = Object.keys(this.exec(content, this.resource));

    let cssModuleDefinition;
    if (!query.namedExport) {
      cssModuleDefinition = generateGenericExportInterface(cssModuleKeys, filename);
    } else {
      const [cleanedDefinitions, skippedDefinitions] = filterNonWordClasses(cssModuleKeys);
      if (skippedDefinitions.length > 0 && !query.camelCase) {
        console.warn(`Typings for CSS-Modules: option 'namedExport' was set but 'camelCase' for the css-loader not.
The following classes will not be available as named exports:
${skippedDefinitions.map(sd => ` - "${sd}"`).join('\n').red}
`.yellow);
      }
      cssModuleDefinition = generateNamedExports(cleanedDefinitions);
    }
    persist.writeToFileIfChanged(cssModuleInterfaceFilename, cssModuleDefinition);
    // mock async step 3 - make `async` return the actual callback again before calling the 'real' css-loader
    delegateToCssLoader(this, input, callback);
  };
  cssLocalsLoader.call(this, input);
}
