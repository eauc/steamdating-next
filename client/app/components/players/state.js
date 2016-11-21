export let __hotReload = true;

import R from 'app/helpers/ramda';
import ajv from 'app/helpers/ajv';
import { registerValidator } from 'app/services/state';

export const scope = ['tournament','players'];

const numberOrNullSchema = {
  oneOf: [
    { type: 'null' },
    { type: 'number' },
  ],
};
const stringOrNullSchema = {
  oneOf: [
    { type: 'null' },
    { type: 'string' },
  ],
};

ajv.addKeyword('alreadyExists', {
  validate: function alreadyExistsValidate(schema, data) {
    const fails = R.contains(data, schema);
    if (fails) {
      alreadyExistsValidate.errors = [{
        message: 'already exists',
      }];
    }
    return !fails;
  },
  errors: true,
});

export const playerSchema = (playersNames) => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      alreadyExists: playersNames,
    },
    origin: stringOrNullSchema,
    faction: stringOrNullSchema,
    lists: {
      type: 'array',
      items: { type: 'string' },
    },
    team: stringOrNullSchema,
    notes: stringOrNullSchema,
    customField: numberOrNullSchema,
    droped: numberOrNullSchema,
  },
  required: ['name'],
});


const playersSchema = {
  type: 'array',
  items: playerSchema([]),
};

registerValidator('tournament-players', scope, playersSchema);
