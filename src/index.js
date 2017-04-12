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
import loggerCreator from './logger';

function delegateToCssLoader(ctx, input, callback) {
  ctx.async = () => callback;
  cssLoader.call(ctx, input);
}

module.exports = function(input) {
  if(this.cacheable) this.cacheable();

  // mock async step 1 - css loader is async, we need to intercept this so we get async ourselves
  const callback = this.async();

  const query = loaderUtils.parseQuery(this.query);
  const logger = loggerCreator(query.silent);

  const moduleMode = query.modules || query.module;
  if (!moduleMode) {
    logger('warn','Typings for CSS-Modules: option `modules` is not active - skipping extraction work...'.red);
    return delegateToCssLoader(this, input, callback);
  }

  // default to using semiColons
  query.noSemicolons = query.noSemicolons? true : false;

  // mock async step 2 - offer css loader a "fake" callback
  this.async = () => (err, content) => {
    if (err) {
      return callback(err);
    }
    const filename = this.resourcePath;
    const cssModuleInterfaceFilename = filenameToTypingsFilename(filename);

    const keyRegex = /"([^\\"]+)":/g;
    let match;
    const cssModuleKeys = [];

    while ((match = keyRegex.exec(content))) {
      if (cssModuleKeys.indexOf(match[1]) < 0) {
        cssModuleKeys.push(match[1]);
      }
    }

    let cssModuleDefinition;
    if (!query.namedExport) {
      cssModuleDefinition = generateGenericExportInterface(cssModuleKeys, filename, '  ', query.noSemicolons);
    } else {
      const [cleanedDefinitions, skippedDefinitions,] = filterNonWordClasses(cssModuleKeys);
      if (skippedDefinitions.length > 0 && !query.camelCase) {
        logger('warn', `Typings for CSS-Modules: option 'namedExport' was set but 'camelCase' for the css-loader not.
The following classes will not be available as named exports:
${skippedDefinitions.map(sd => ` - "${sd}"`).join('\n').red}
`.yellow);
      }
      cssModuleDefinition = generateNamedExports(cleanedDefinitions, query.noSemicolons);
    }
    persist.writeToFileIfChanged(cssModuleInterfaceFilename, cssModuleDefinition);
    // mock async step 3 - make `async` return the actual callback again before calling the 'real' css-loader
    delegateToCssLoader(this, input, callback);
  };
  cssLocalsLoader.call(this, input);
};
