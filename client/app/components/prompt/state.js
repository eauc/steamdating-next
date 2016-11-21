export let __hotReload = true;

import { registerValidator } from 'app/services/state';

export const scope = ['prompt'];

const eventVectorSchema = {
  type: 'array',
  items: [{ type: 'string' }],
  additionnalItems: true,
};

const promptSchema = {
  oneOf: [
    { type: 'null' },
    {
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
    },
  ],
};

registerValidator('prompt', scope, promptSchema);
