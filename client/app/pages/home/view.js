export let __hotReload = true;

import stateService from 'app/services/state';
const { dispatch, registerHandler } = stateService;
import validateArgs from 'app/helpers/middlewares/validateArgs';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Page,
         PageContent,
         PageMenu,
         PageMenuItem,
       } from 'app/components/page/page';
/* eslint-enable no-unused-vars */

registerHandler('test', [
  validateArgs(['string', 'null', 'number']),
], () => 'Oups');

registerHandler('test-prompt', (state, [_event_, ...result]) => {
  dispatch(['toaster-set', { type: 'info', message: result.join(', ') }]);
  return state;
});

export const HomePage = createComponent({
  render: homePageRender,
});

function homePageRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem
           onClick={() => {
             dispatch(['toaster-set', { type: 'success', message: 'Ouuups1!' }]);
          }}>
          Test Toaster
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch(['toaster-set', { type: 'error', message: 'Ouuups1!' }]);
             dispatch(['toaster-set', { type: 'info', message: 'Ouuups2!' }]);
             dispatch(['toaster-set', { type: 'success', message: 'Ouuups3!' }]);
             dispatch(['toaster-set', { type: 'warning', message: 'Ouuups4!' }]);
             dispatch(['toaster-set', { type: 'error', message: 'Ouuups5!' }]);
          }}>
          Test Toaster x5
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch(['test', 1, 'Baaaaka']);
          }}>
          Test ValidateArgs
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch(['prompt-set',
                       { type:'alert',
                         msg: 'This is an alert',
                         onOk: ['test-prompt', 'alert-ok'] }]);
          }}>
          Test Alert
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch(['prompt-set',
                       { type: 'confirm',
                         msg: 'This is a confirm',
                         onOk: ['test-prompt', 'confirm-ok'],
                         onCancel: ['test-prompt', 'confirm-cancel'] }]);
          }}>
          Test Confirm
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch(['prompt-set',
                       { type: 'prompt',
                         msg: 'This is a prompt',
                         value: 42,
                         onOk: ['test-prompt', 'prompt-ok'],
                         onCancel: ['test-prompt', 'prompt-cancel'] }]);
          }}>
          Test Prompt
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
      </PageContent>
    </Page>
  );
}
