# typings-for-css-modules-loader

Webpack loader that works as a css-loader drop-in replacement to generate TypeScript typings for CSS modules on the fly

## Installation

Install via npm `npm install --save-dev typings-for-css-modules-loader`

## Options

Just like any other loader you can specify options e.g. as query-params

### css-loader options
Any option that your installed version of css-loader supports can be used and will be passed to it.

### `namedExport`-option
As your fellow css-developer may tend to use characters like dashes(`-`) that are not valid characters for a typescript variable the default behaviour for this loader is to export an interface as the default export that contains the classnames as properties.
e.g.:
```ts
export interface IExampleCss {
  'foo': string;
  'bar-baz': string;
}

declare const locals: IExampleCss;
```

A cleaner way is to expose all classes as named exports, this can be done if you enable the `namedExport`-option.
e.g.
```js
  { test: /\.css$/, loader: 'typings-for-css-modules?modules&namedExport' }
```

As mentioned above, this requires classnames to only contain valid typescript characters, thus filtering out all classnames that do not match /^\w+$/i. (feel free to improve that regexp)
In order to make sure that even classnames with non-legal characters are used it is highly recommended to use the `camelCase`-option as well, that - once passed to the css-loader - makes sure all classnames are transformed to valid variables.
with:
```js
  { test: /\.css$/, loader: 'typings-for-css-modules?modules&namedExport&camelCase' }
```
using the following css:
```css
.foo {
  color: white;
}

.bar-baz {
  color: green;
}
```

will generate the following typings file:
```ts
export const foo: string;
export const barBaz: string;
```

 `css-loader` exports mappings to `exports.locals` which is incompatible with the `namedExport`-option unless paired with `extract-text-webpack-plugin` or `style-loader`. They move the exported properties from `exports.locals` to `exports` making them reuired for `namedExport` to work, and `namedExport` required for them to work. *Always combine usage of `extract-text-webpack-plugin` or `style-loader` with the `namedExport`-option.*

### `interface`-option

Specify the interface option along with the namedExport option to also generate an interface. This option is useful if you need to use both
the named exports (for style-loader compatibility), but also have a reason to use the interface (for instance, to refer to the type from TypeScript).

with:
```js
  { test: /\.css$/, loader: 'typings-for-css-modules?modules&namedExport&interface&camelCase' }
```
using the following css:
```css
.foo {
  color: white;
}

.bar-baz {
  color: green;
}
```

will generate the following typings file:
```ts
export interface IExampleNamedExportAndInterfaceCss {
  'foo': string;
  'barBaz': string;
}

export const foo: string;
export const barBaz: string;
```

### `silent`-option
To silence the loader because you get annoyed by its warnings or for other reasons, you can simply pass the "silent" query to the loader and it will shut up.
e.g.:

```js
  { test: /\.css$/, loader: 'typings-for-css-modules?silent' }
```

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

Imagine you have a file `~/my-project/src/component/MyComponent/myComponent.scss` in your project with the following content:
```css
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

Adding the `typings-for-css-modules-loader` will generate a file `~/my-project/src/component/MyComponent/myComponent.scss.d.ts` that has the following content:
```ts
export interface IMyComponentScss {
  'some-class': string;
  'someOtherClass': string;
  'some-class-sayWhat': string;
}
declare const styles: IMyComponentScss;

export default styles;
```

### using `namedExport` with the `camelCase`-option
Using the `namedExport` as well as the `camelCase` options the generated file will look as follow:
```ts
export const someClass: string;
export const someOtherClass: string;
export const someClassSayWhat: string;
```

### Example in Visual Studio Code
![typed-css-modules](https://cloud.githubusercontent.com/assets/749171/16340497/c1cb6888-3a28-11e6-919b-f2f51a282bba.gif)

## Support

As the loader just acts as an intermediary it can handle all kind of css preprocessors (`sass`, `scss`, `stylus`, `less`, ...).
The only requirement is that those preprocessors have proper webpack loaders defined - meaning they can already be loaded by webpack anyways.

## Requirements

The loader uses `css-loader`(https://github.com/webpack/css-loader) under the hood. Thus it is a peer-dependency and the expected loader to create CSS Modules.

## Known issues

### Webpack rebuilds / builds slow

As the loader generates typing files, it is wise to tell webpack to ignore them.
The fix is luckily very simple. Webpack ships with a "WatchIgnorePlugin" out of the box.
Simply add this to your webpack plugins:
```
plugins: [
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    ...
  ]
```
where `css` is the file extension of your style files. If you use `sass` you need to put `sass` here instead. If you use `less`, `stylus` or any other style language use their file ending.

### Typescript doesnt find the typings

As the webpack process is independent from your typescript "runtime" it may take a while for typescript to pick up the typings.
Any hints on how this could be fixed deterministically are welcome!
