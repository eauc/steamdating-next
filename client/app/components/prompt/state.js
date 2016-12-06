export let __hotReload = true;

import stateService from 'app/services/state';
const { registerValidator } = stateService;

export const scope = ['prompt'];

const eventVectorSchema = {
  type: 'array',
  items: [{ type: 'string' }],
  additionnalItems: true,
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
    onOk: eventVectorSchema,
    onCancel: eventVectorSchema,
  },
  required: ['type', 'msg', 'onOk'],
};

registerValidator('prompt', scope, promptSchema);
