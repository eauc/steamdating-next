export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch,
         registerSubscription,
         getPermanentSubscription,
         registerValidator,
      } = stateService;

export const scope = {
  tournament: ['tournament'],
  onlineInfo: ['tournament','online'],
  online: ['online'],
  onlineUrls: ['online','urls'],
  onlineList: ['online','list'],
};

const tournamentSchema = {
  type: 'object',
};
const onlineUrlsSchema = {
  type: 'object',
  properties: {
    link: { type: 'string' },
    mine: { type: 'string' },
  },
  required: ['link', 'mine'],
};
const onlineTournamentSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    date: {
      type: 'string',
      format: 'date',
    },
    name: { type: 'string' },
    link: { type: 'string' },
    // eslint-disable-next-line camelcase
    updated_at: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id','date','name','link','updated_at'],
};

const onlineListSchema = {
  type: 'array',
  items: onlineTournamentSchema,
};
export const onlineSaveFormSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    date: { type: 'string', format: 'date' },
  },
  required: ['name','date'],
};
const onlineSchema = {
  type: 'object',
  properties: {
    urls: onlineUrlsSchema,
    list: onlineListSchema,
  },
};

registerValidator('tournament', scope.tournament, tournamentSchema);
registerValidator('online', scope.online, onlineSchema);

const tournamentOnlineResetSaveFormSub = registerSubscription(
  'tournament-onlineResetSetForm',
  (stateCell) => {
    const defaut = {};
    let init = true;
    return stateCell
      .map(R.pathOr(defaut, scope.onlineInfo))
      .map((info) => {
        if (init) {
          init = false;
          return;
        }
        dispatch({
          eventName: 'form-reset',
          formName: 'tournament_onlineSave',
          value: R.pick(['name','date'], info),
        });
      });
  }
);
getPermanentSubscription('tournament-onlineInfo', [tournamentOnlineResetSaveFormSub]);
