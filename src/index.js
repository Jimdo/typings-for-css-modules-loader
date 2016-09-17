import cssLoader from 'css-loader';
import cssLocalsLoader from 'css-loader/locals';
import {
  generateInterface,
  filenameToTypingsFilename,
} from './cssModuleToInterface';
import * as persist from './persist';

module.exports = function(input) {
  if(this.cacheable) this.cacheable();

  // mock async step 1 - css loader is async, we need to intercept this so we get async ourselves
  const callback = this.async();
  // mock async step 2 - offer css loader a "fake" callback
  this.async = () => (err, content) => {
    const cssmodules = this.exec(content);
    const requestedResource = this.resourcePath;

    const cssModuleInterfaceFilename = filenameToTypingsFilename(requestedResource);
    const cssModuleInterface = generateInterface(cssmodules, requestedResource);
    persist.writeToFileIfChanged(cssModuleInterfaceFilename, cssModuleInterface);
    // mock async step 3 - make `async` return the actual callback again before calling the 'real' css-loader
    this.async = () => callback;
    cssLoader.call(this, input);
  };
  cssLocalsLoader.call(this, input);
}
