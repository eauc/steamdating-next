export let __hotReload = true;

import { hashHistory } from 'react-router';
import { registerCoeffect } from 'app/helpers/middlewares/coeffects';

export default hashHistory;

registerCoeffect('history', () => hashHistory);
