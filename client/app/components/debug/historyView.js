export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { stateDebug } = stateService;
import { debugHistorySub, debugLogSub } from 'app/components/debug/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const DebugHistory = createComponent({
  displayName: 'DebugHistory',
  subscriptions: {
    history: debugHistorySub,
    log: debugLogSub,
  },
  getInitialState: debugHistoryGetInitialState,
  render: debugHistoryRender,
});

function debugHistoryGetInitialState() {
  return {
    history: [],
    log: [],
  };
}

function debugHistoryRender() {
  const history = R.reverse(R.addIndex(R.map)(([{ eventName }], index) => (
    <tr key={index}
        className={{ current: (index + 1 === this.state.history.length) }}>
      <td>{index}</td>
      <td onClick={() => stateDebug.replayHistory(index)}>
        <Icon name="refresh" />
      </td>
      <td>{eventName}</td>
      <td onClick={() => stateDebug.dropHistory(index)}>
        <Icon name="trash" />
      </td>
    </tr>
  ), this.state.history));
  const log = R.addIndex(R.map)(([{ eventName }], index) => (
    <tr key={index}>
      <td>{index}</td>
      <td onClick={() => stateDebug.replayLog(index)}>
        <Icon name="refresh" />
      </td>
      <td>{eventName}</td>
      <td onClick={() => stateDebug.dropLog(index)}>
        <Icon name="trash" />
      </td>
    </tr>
  ), this.state.log);
  return (
    <div>
      <div className="actions">
        <button className="action"
                onClick={() => stateDebug.first()}>
          <Icon name="fast-backward" />
        </button>
        <button className="action"
                onClick={() => stateDebug.back()}>
          <Icon name="step-backward" />
        </button>
        <button className="action"
                onClick={() => stateDebug.redo()}>
          <Icon name="step-forward" />
        </button>
        <button className="action"
                onClick={() => stateDebug.last()}>
          <Icon name="fast-forward" />
        </button>
      </div>
      <div className="logContainer">
        <table className="log">
          <tbody>
            {log}
            {history}
          </tbody>
        </table>
      </div>
    </div>
  );
}
