import {locals as stylesBase} from './example.css';
import {locals as stylesCamelCase} from './example-camelcase.css';
import * as stylesNamedExport from './example-namedexport.css';
import * as stylesCamelCasedNamedExport from './example-camelcase-namedexport.css';
import './example-no-css-modules.css';
import * as compose from './example-compose.css';

const foo = stylesBase.foo;
const barBaz = stylesBase['bar-baz'];

const fooCamelCase = stylesCamelCase.foo;
const barBazCamelCase = stylesCamelCase.barBaz;
const barBazDashedCamelCase = stylesCamelCase['bar-baz'];

const fooNamedExport = stylesNamedExport.foo;

const fooCamelCaseNamedExport = stylesCamelCasedNamedExport.foo;
const barBazCamelCaseNamedExport = stylesCamelCasedNamedExport.barBaz;

const composed = compose.test;
