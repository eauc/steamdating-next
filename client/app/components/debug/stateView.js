export let __hotReload = true;

import { debugStateSub } from 'app/components/debug/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { DebugStateObject } from 'app/components/debug/stateObjectView';
/* eslint-enable no-unused-vars */

export const DebugState = createComponent({
  displayName: 'DebugState',
  subscriptions: { appState: debugStateSub },
  getInitialState: debugStateGetInitialState,
  render: debugStateRender,
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
