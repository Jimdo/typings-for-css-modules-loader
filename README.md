# typings-for-css-modules-loaderg

Webpack loader that works as a css-loader drop-in replacement to generate TypeScript typings for CSS modules on the fly

## Installation

Install via npm `npm install --save-dev typings-for-css-modules-loader`

## Usage

Keep your `webpack.config` as is just instead of using `css-loader` use `typings-for-css-modules-loader`
*its important you keep all the params that you used for the css-loader before, as they will be passed along in the process*

before:
```js
webpackConfig.module.loaders: [
    { test: /\.css$/, loader: 'css?modules' }
    { test: /\.scss$/, loader: 'css?modules&sass' }
];
```

after:
```js
webpackConfig.module.loaders: [
    { test: /\.css$/, loader: 'typings-for-css-modules?modules' }
    { test: /\.scss$/, loader: 'typings-for-css-modules?modules&sass' }
];
```

## Example

Imagine you have a file `~/my-project/src/component/MyComponent/component.scss` in your project with the following content:
```
.some-class {
  // some styles
  &.someOtherClass {
    // some other styles
  }
  &-sayWhat {
    // more styles
  }
}
```

Adding the `typings-for-css-modules-loader` will generate a file `~/my-project/src/component/MyComponent/mycomponent.scss.d.ts` that has the following content:
```
export interface IMyComponentScss {
  'some-class': string;
  'someOtherClass': string;
  'some-class-sayWhat': string;
}
declare const styles: IMyComponentScss;

export default styles;
```

### Example in Visual Studio Code
![typed-css-modules](https://cloud.githubusercontent.com/assets/749171/16340497/c1cb6888-3a28-11e6-919b-f2f51a282bba.gif)

## Support

As the loader just acts as an intermediary it can handle all kind of css preprocessors (`sass`, `scss`, `stylus`, `less`, ...).
The only requirement is that those preprocessors have proper webpack loaders defined - meaning they can already be loaded by webpack anyways.

## Requirements

The loader uses `css-loader`(https://github.com/webpack/css-loader) under the hood. Thus it is a peer-dependency and the expected loader to create CSS Modules.

## Known issues

 - There may be a lag or a reload necessary when adding a new style-file to your project as the typescript loader may take a while to "find" the new typings file.
