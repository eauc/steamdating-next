export let __hotReload = true;

import R from 'app/helpers/ramda';
import { stateDebug } from 'app/services/state';
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { debugHistorySub, debugLogSub } from 'app/components/debug/sub';

export const DebugHistory = createComponent({
  displayName: 'DebugHistory',
  subscriptions: { history: debugHistorySub,
                   log: debugLogSub },
  getInitialState: debugHistoryGetInitialState,
  render: debugHistoryRender
});

function debugHistoryGetInitialState() {
  return { history: [],
           log: [] };
}

function debugHistoryRender() {
  const history = R.reverse(R.addIndex(R.map)(([event], i) => {
    return (
      <tr key={i}
          className={{ current: (i+1 === this.state.history.length) }}>
        <td>{i}</td>
        <td onClick={() => stateDebug.replayHistory(i)}>
          <Icon name="refresh" />
        </td>
        <td>{event}</td>
        <td onClick={() => stateDebug.dropHistory(i)}>
          <Icon name="trash" />
        </td>
      </tr>
    );
  }, this.state.history));
  const log = R.addIndex(R.map)(([event], i) => {
    return (
      <tr key={i}>
        <td>{i}</td>
        <td onClick={() => stateDebug.replayLog(i)}>
          <Icon name="refresh" />
        </td>
        <td>{event}</td>
        <td onClick={() => stateDebug.dropLog(i)}>
          <Icon name="trash" />
        </td>
      </tr>
    );
  }, this.state.log);
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
