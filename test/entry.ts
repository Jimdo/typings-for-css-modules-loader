import stylesBase from './example.css';
import stylesCamelCase from './example-camelcase.css';
import * as stylesNamedExport from './example-namedexport.css';
import * as stylesCamelCasedNamedExport from './example-camelcase-namedexport.css';

const foo = stylesBase.foo;
const barBaz = stylesBase['bar-baz'];

const fooCamelCase = stylesCamelCase.foo;
const barBazCamelCase = stylesCamelCase.barBaz;
const barBazDashedCamelCase = stylesCamelCase['bar-baz'];

const fooNamedExport = stylesNamedExport.foo;

const fooCamelCaseNamedExport = stylesCamelCasedNamedExport.foo;
const barBazCamelCaseNamedExport = stylesCamelCasedNamedExport.barBaz;
