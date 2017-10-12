import {locals as stylesBase} from './example.css';
import {locals as stylesCamelCase} from './example-camelcase.css';
import {locals as stylesOrderAlphabetically} from './example-orderalphabetically.css';
import * as stylesNamedExport from './example-namedexport.css';
import * as stylesCamelCasedNamedExport from './example-camelcase-namedexport.css';
import * as stylesNamedExportOrderAlphabetically from './example-namedexport-orderalphabetically.css';
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

const fooStylesOrderAlphabetically = stylesOrderAlphabetically.foo;
const barStylesOrderAlphabetically = stylesOrderAlphabetically.bar;
const bazStylesOrderAlphabetically = stylesOrderAlphabetically.baz;

const fooNamedExportOrderAlhpabetically = stylesNamedExportOrderAlphabetically.foo;
const barNamedExportOrderAlhpabetically = stylesNamedExportOrderAlphabetically.bar;
const bazNamedExportOrderAlhpabetically = stylesNamedExportOrderAlphabetically.baz;

const composed = compose.test;
