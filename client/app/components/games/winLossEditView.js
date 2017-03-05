export let __hotReload = true;

import { formFieldSub } from 'app/components/form/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;
import gameModel from 'app/models/game';

export const GameWinLossEdit = createComponent({
  displayName: 'GameWinLossEdit',
  subscriptions: {
    value: getValueSubscription,
  },
  contextTypes: {
    formView: React.PropTypes.object,
    formName: React.PropTypes.string,
  },
  render,
  getInitialState,
  doUpdate,
});

function getValueSubscription() {
  return formFieldSub([this.context.formView, this.path]);
}

function render() {
  const winner = this.state.value === 1;
  const looser = this.state.value === 0;
  return (
    <td onClick={this.doUpdate}
        className={{
          win: winner,
          loss: looser,
        }}>
      {winner ? 'Winner' : ''}{looser ? 'Looser' : ''}
      <br />
      <span className="hint">
        Click to set {winner ? 'Draw' : 'Winner'}
      </span>
    </td>
  );
}

function getInitialState() {
  this.path = `${this.context.formName}.${this.props.name}`;
  return {
    value: null,
  };
}

function doUpdate() {
  const win = !(1 === this.state.value);
  dispatch({
    eventName: 'form-update',
    fieldName: this.path,
    value: win ? 1 : 0,
    updateWith: gameModel.setWinLoss$,
  });
}
