export let __hotReload = true;

import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['prompt'];

const eventSchema = {
  type: 'object',
  properties: {
    eventName: { type: 'string' },
  },
  required: ['eventName'],
};

const promptSchema = {
  type: 'object',
  properties: {
    type: { enum: ['alert','prompt','confirm'] },
    msg: {
      type: 'string',
      minLength: 1,
    },
    value: {},
    onOk: eventSchema,
    onCancel: eventSchema,
  },
  required: ['type', 'msg', 'onOk'],
};

registerValidator('prompt', scope, promptSchema);
