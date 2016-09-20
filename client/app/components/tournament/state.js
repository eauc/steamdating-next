export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';
import { registerInit } from 'app/services/init';
import { registerValidator } from 'app/services/state';

export const scope = {
  tournament: ['tournament'],
  online: ['online'],
  online_urls: ['online','urls'],
  online_list: ['online','list']
};

const tournament_schema = Joi.object();
const online_urls_schema = Joi.object({
  link: Joi.string().empty('').required(),
  mine: Joi.string().empty('').required()
});
const online_tournament_schema = Joi.object({
  id: Joi.number().required(),
  date: Joi.date().required(),
  name: Joi.string().empty('').required(),
  link: Joi.string().empty('').required()
});
const online_list_schema = Joi.array().items(online_tournament_schema);
const online_schema = Joi.object({
  urls: online_urls_schema,
  list: online_list_schema
});

registerValidator('tournament', scope.tournament, tournament_schema);
registerValidator('online', scope.online, online_schema);

registerInit('tournament-online', ['storage'], initTournamentOnline);

function initTournamentOnline(state) {
  return R.assoc('online', {}, state);
}
