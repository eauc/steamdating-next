export let __hotReload = true;

import Joi from 'joi-browser';
import { registerValidator } from 'app/services/state';

export const scope = ['tournament'];

const tournament_schema = Joi.object();

registerValidator('tournament', scope, tournament_schema);
