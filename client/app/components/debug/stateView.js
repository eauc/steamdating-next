export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import { debugStateSub } from 'app/components/debug/sub';
import { DebugStateObject } from 'app/components/debug/stateObjectView';

export const DebugState = createComponent({
  displayName: 'DebugState',
  subscriptions: { appState: debugStateSub },
  getInitialState: debugStateGetInitialState,
  render: debugStateRender
});

function debugStateGetInitialState() {
  return { appState: {},
           rootPath: [] };
}

function debugStateRender() {
  return (
    <table>
      <tbody>
        <tr>
          <td>appState</td>
          <td>
            <DebugStateObject
               path={this.state.rootPath}
               name={null}
               object={this.state.appState}>
            </DebugStateObject>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
