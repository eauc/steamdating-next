export let __hotReload = true;

import R from 'app/helpers/ramda';
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
  validateArgs({ string: 'string', null: 'null', number: 'number' }),
], () => 'Oups');

registerHandler('test-prompt', (state, { result, value }) => {
  dispatch({
    eventName: 'toaster-set',
    type: 'info',
    message: R.reject(R.isNil, [result, value]).join(', '),
  });
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
             dispatch({ eventName: 'toaster-set', type: 'success', message: 'Ouuups1!' });
          }}>
          Test Toaster
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch({ eventName: 'toaster-set', type: 'error', message: 'Ouuups1!' });
             dispatch({ eventName: 'toaster-set', type: 'info', message: 'Ouuups2!' });
             dispatch({ eventName: 'toaster-set', type: 'success', message: 'Ouuups3!' });
             dispatch({ eventName: 'toaster-set', type: 'warning', message: 'Ouuups4!' });
             dispatch({ eventName: 'toaster-set', type: 'error', message: 'Ouuups5!' });
          }}>
          Test Toaster x5
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch({ eventName: 'test', string: 1, null: 'Baaaaka' });
          }}>
          Test ValidateArgs
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch({
               eventName: 'prompt-set',
               type:'alert',
               msg: 'This is an alert',
               onOk: { eventName: 'test-prompt', result: 'alert-ok' },
             });
          }}>
          Test Alert
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch({
               eventName: 'prompt-set',
               type: 'confirm',
               msg: 'This is a confirm',
               onOk: { eventName: 'test-prompt', result: 'confirm-ok' },
               onCancel: { eventName: 'test-prompt', result: 'confirm-cancel' },
             });
          }}>
          Test Confirm
        </PageMenuItem>
        <PageMenuItem
           onClick={() => {
             dispatch({
               eventName: 'prompt-set',
               type: 'prompt',
               msg: 'This is a prompt',
               value: 42,
               onOk: { eventName: 'test-prompt', result: 'prompt-ok' },
               onCancel: { eventName: 'test-prompt', result: 'prompt-cancel' },
             });
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
