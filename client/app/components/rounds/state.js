export let __hotReload = true;

import R from 'app/helpers/ramda';
import ajv from 'app/helpers/ajv';
import { gameSchema } from 'app/components/games/state';
import stateService from 'app/services/state';
const { registerValidator } = stateService;
import roundModel from 'app/models/round';

export const scope = ['tournament','rounds'];

ajv.addKeyword('validRound', {
  validate: function validRoundValidate({ players }, round = {}) {
    const { errors } = roundModel.validate({ players }, round);
    validRoundValidate.errors = R.map((error) => ({
      message: error,
    }), errors);
    return R.isEmpty(errors);
  },
  errors: true,
});

export const roundSchema = (players) => ({
  type: 'object',
  properties: {
    games: {
      type: 'array',
      items: gameSchema,
    },
  },
  required: ['games'],
  additionalProperties: false,
  validRound: { players },
});

export const roundsSchema = {
  type: 'array',
  items: roundSchema([]),
};

registerValidator('tournament-rounds', scope, roundsSchema);
