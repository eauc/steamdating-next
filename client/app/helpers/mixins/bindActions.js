export let __hotReload = true;

import R from 'app/helpers/ramda';
// import log from 'app/helpers/log';

const bindActionsMixin = {
  componentWillMount: bindActionsWillMount,
};

export default bindActionsMixin;

function bindActionsWillMount() {
  // log.cycle('bindActionsMixin','willMount',this);
  R.thread(this)(
    R.keys,
    R.filter((prop) => prop.startsWith('do')),
    R.filter((prop) => (R.type(this[prop]) === 'Function')),
    R.forEach((prop) => {
      // log.cycle('bindActionsMixin', prop);
      R.bind(this[prop], this);
    })
  );
}
