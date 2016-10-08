export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';
import { registerInit } from 'app/services/init';
import { dispatch,
         registerSubscription,
         getPermanentSubscription,
         registerValidator,
       } from 'app/services/state';

export const scope = {
  tournament: ['tournament'],
  onlineInfo: ['tournament','online'],
  online: ['online'],
  onlineUrls: ['online','urls'],
  onlineList: ['online','list'],
};

const tournamentSchema = Joi.object();
const onlineUrlsSchema = Joi.object({
  link: Joi.string()
    .empty('')
    .required(),
  mine: Joi.string()
    .empty('')
    .required(),
});
const onlineTournamentSchema = Joi.object({
  id: Joi.number().required(),
  date: Joi.date().required(),
  name: Joi.string()
    .empty('')
    .required(),
  link: Joi.string()
    .empty('')
    .required(),
  // eslint-disable-next-line camelcase
  updated_at: Joi.date().required(),
});
const onlineListSchema = Joi.array().items(onlineTournamentSchema);
export const onlineSaveFormSchema = Joi.object({
  name: Joi.string()
    .empty('')
    .required(),
  date: Joi.date().required(),
});
const onlineSchema = Joi.object({
  urls: onlineUrlsSchema,
  list: onlineListSchema,
});

registerValidator('tournament', scope.tournament, tournamentSchema);
registerValidator('online', scope.online, onlineSchema);
const tournamentOnlineResetSaveFormSub = registerSubscription(
  'tournament-onlineResetSetForm',
  (state) => {
    const defaut = {};
    return state
      .map(R.pathOr(defaut, scope.onlineInfo))
      .map((info) => {
        dispatch(['form-reset', 'tournament_onlineSave', R.pick(['name','date'], info)]);
      });
  }
);
registerInit('tournament-online', ['storage'], initTournamentOnline);

function initTournamentOnline(state) {
  getPermanentSubscription(
    'tournament-onlineInfo',
    [tournamentOnlineResetSaveFormSub]
  );
  return R.assoc('online', {}, state);
}
