export let __hotReload = true;

const integerOrNullSchema = {
  oneOf: [
    { type: 'null' },
    {
      type: 'integer',
      minimum: 0,
    },
  ],
};
const stringOrNullSchema = {
  oneOf: [
    { type: 'null' },
    { type: 'string' },
  ],
};

export const gamePointSchema = {
  type: 'number',
  minimum: 0,
};

export const gameScoreSchema = {
  type: 'object',
  properties: {
    tournament: integerOrNullSchema,
    assassination: { type: 'boolean' },
    scenario: {
      allOf: [
        gamePointSchema,
        { maximum: 5 },
      ],
    },
    army: gamePointSchema,
    custom: { type: 'number' },
  },
  required: ['assassination','scenario','army','custom'],
  additionalProperties: false,
};

export const gamePlayerScoreSchema = {
  type: 'object',
  properties: {
    name: stringOrNullSchema,
    list: stringOrNullSchema,
    score: gameScoreSchema,
  },
  required: ['name','list','score'],
  additionalProperties: false,
};

export const gameSchema = {
  type: 'object',
  properties: {
    table: integerOrNullSchema,
    player1: gamePlayerScoreSchema,
    player2: gamePlayerScoreSchema,
    comments: { type: 'string' },
  },
  required: ['table','player1','player2'],
  additionalProperties: false,
};
