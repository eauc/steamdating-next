export let __hotReload = true;

import R from 'app/helpers/ramda';
import { toasterSub } from 'app/components/toaster/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const Toaster = createComponent({
  displayName: 'Toaster',
  subscriptions: { toaster: toasterSub },
  getInitialState: toasterGetInitialState,
  render: toasterRender,
});

function toasterGetInitialState() {
  return { toaster: null };
}

function toasterRender() {
  const type = R.pathOr('info', ['toaster','type'], this.state);
  const message = R.pathOr('', ['toaster','message'], this.state);
  return (
    <div className={{
           show: this.state.toaster,
           [type]: true,
         }}>
      {message}
    </div>
  );
}
