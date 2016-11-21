export let __hotReload = true;

import Ajv from 'ajv';

export default new Ajv({
  v5: true,
  allErrors: true,
});
