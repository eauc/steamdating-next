export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
import { promptSub } from 'app/components/prompt/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const Prompt = createComponent({
  displayName: 'Prompt',
  subscriptions: { prompt: promptSub },
  getInitialState: promptGetInitialState,
  render: promptRender,
  onChange: promptOnChange,
  onOk: promptOnOk,
  onCancel: promptOnCancel,
});

function promptGetInitialState() {
  return { prompt: null };
}

function promptRender() {
  const type = R.path(['prompt','type'], this.state);
  const msg = R.pathOr('', ['prompt','msg'], this.state);
  const value = R.path(['prompt','value'], this.state);
  return (
    <div className={{
           show: this.state.prompt,
         }}>
      <div className="mask">
        <div className="content">
          <div className="msg">
            {msg}
          </div>
          <input className={{
                   value: true,
                   'control-hide': type !== 'prompt',
                 }}
                 type={R.type(value) === 'Number' ? 'number' : 'text'}
                 id="prompt.value"
                 name="prompt.value"
                 value={value}
                 onChange={this.onChange} />
          <div className="controls">
            <button className="control-ok"
                    type="button"
                    onClick={this.onOk}>
              Ok <Icon name="check" />
            </button>
            <button className={{
                      'control-cancel': true,
                      'control-hide': type === 'alert',
                    }}
                    type="button"
                    onClick={this.onCancel}>
              No <Icon name="close" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function promptOnChange(event) {
  dispatch({
    eventName: 'prompt-update-value',
    value: event.target.value,
  });
}

function promptOnOk() {
  dispatch({
    eventName: 'prompt-ok',
  });
}

function promptOnCancel() {
  dispatch({
    eventName: 'prompt-cancel',
  });
}
