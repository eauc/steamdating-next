export let __hotReload = true;

import Joi from 'joi-browser';

const player = (players_names) => Joi.object().keys({
  name: Joi.string()
    .min(1)
    .invalid(players_names)
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
    .items(Joi.any())
    .label('Lists'),
  team: Joi.alternatives(null, Joi.string())
    .label('Team')
    .empty(''),
  notes: Joi.alternatives(null, Joi.string())
    .label('Notes')
    .empty(''),
  custom_field: Joi.alternatives(null, Joi.number().integer())
    .label('Custom Field')
    .empty(''),
  droped: Joi.alternatives(Joi.number().integer(), null)
    .label('Droped')
    .empty('')
});

const players = Joi.array().items(player([]));

export const schema = { player, players };
export const scope = ['tournament','players'];
