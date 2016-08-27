export let __hotReload = true;

import Joi from 'joi-browser';

export const schema = {
  player: (players_names) => Joi.object().keys({
    name: Joi.string()
      .min(4)
      .invalid(players_names)
      .insensitive()
      .label('Name')
      .required()
      .options({ language: { any: { invalid: 'already exists' } } }),
    faction: Joi.string()
      .max(5)
      .label('Faction')
      .empty('')
  })
};

export const scope = ['tournament','players'];
