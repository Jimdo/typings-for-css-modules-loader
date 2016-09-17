import path from 'path';
import vm from 'vm';

const isCssModule = (module) => {
  if (!module || typeof module.request !== 'string') {
    return false;
  }

  const extname = path.extname(module.request);
  return /\/css-loader\//.test(module.request) && extname !== '.js';
};

export const filterCssModules = (modules) => {
  return modules.filter(isCssModule);
};

export const removeLoadersBeforeCssLoader = (loaders) => {
  let sawCssLoader = false;
  // remove all loaders before the css-loader
  return loaders.filter((loader)=> {
    if (loader.indexOf('/css-loader/') > -1) {
      sawCssLoader = true;
    }

    return sawCssLoader;
  });
};

export const extractCssModuleFromSource = (source) => {
  const sandbox = {
    exports: null,
    module: {},
    require: () => () => [],
  };
  const script = new vm.Script(source);
  const context = new vm.createContext(sandbox);
  script.runInContext(context);
  return sandbox.exports.locals;
};
