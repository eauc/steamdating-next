export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { DebugHistory } from 'app/components/debug/historyView';
import { DebugState } from 'app/components/debug/stateView';
/* eslint-enable no-unused-vars */

export const DebugMain = createComponent({
  displayName: 'DebugMain',
  getInitialState: debugMainGetInitialState,
  render: debugMainRender,
  componentDidMount: debugMainDidMount,
  componentWillUnmount: debugMainWillUnmount,
  doKeyDown: debugMainDoKeyDown,
});

function debugMainGetInitialState() {
  return { show: false };
}

function debugMainRender() {
  return (
    <div className={{
           show: this.state.show,
         }}>
      <div className="title">
        Debug
      </div>
      <div className="section">
        History
      </div>
      <DebugHistory />
      <div className="section">
        State
      </div>
      <DebugState />
    </div>
  );
}

function debugMainDidMount() {
  self.document.addEventListener('keydown', this.doKeyDown);
}

function debugMainWillUnmount() {
  self.document.removeEventListener('keydown', this.doKeyDown);
}

function debugMainDoKeyDown(event) {
  if (!event.altKey ||
      !event.ctrlKey ||
      event.key !== 'd') {
    return;
  }
  this.setState({ show: !this.state.show });
}
