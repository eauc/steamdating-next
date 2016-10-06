export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['tournament','players'];

export const playerSchema = (playersNames) => Joi.object({
  name: Joi.string()
    .min(1)
    .invalid(playersNames)
    .insensitive()
    .label('Name')
    .required()
    .empty('')
    .options({ language: { any: { invalid: 'already exists' } } }),
  origin: Joi.alternatives(null, Joi.string())
    .label('Origin')
    .empty(''),
  faction: Joi.alternatives(null, Joi.string())
    .label('Faction')
    .empty(''),
  lists: Joi.array()
    .items(Joi.string())
    .label('Lists'),
  team: Joi.alternatives(null, Joi.string())
    .label('Team')
    .empty(''),
  notes: Joi.alternatives(null, Joi.string())
    .label('Notes')
    .empty(''),
  customField: Joi.alternatives(null, Joi.number().integer())
    .label('Custom Field')
    .empty(''),
  droped: Joi.alternatives(Joi.number().integer(), null)
    .label('Droped')
    .empty(''),
});
const playersSchema = Joi.array().items(playerSchema([]));

registerValidator('tournament-players', scope, playersSchema);
