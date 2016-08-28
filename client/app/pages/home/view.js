export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';

import React from 'react';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { dispatch, registerHandler } from 'app/services/state';
import validate from 'app/helpers/middlewares/validate';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import Joi from 'joi-browser';

registerHandler('test', [
  validateArgs([Joi.string().required(), null, Joi.number().required()]),
  validate(Joi.number())
], () => {
  return 'Oups';
});

registerHandler('test-prompt', (state, [_event_, ...result]) => {
  dispatch(['error-set', result.join(', ')]);
  return state;
});

export const HomePage = React.createClass({
  render: homePageRender
});

function homePageRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={() => {
            dispatch(['error-set', 'Ouuups1!']);
          }}>
          Test Error
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['error-set', 'Ouuups1!']);
            dispatch(['error-set', 'Ouuups2!']);
            dispatch(['error-set', 'Ouuups3!']);
            dispatch(['error-set', 'Ouuups4!']);
            dispatch(['error-set', 'Ouuups5!']);
          }}>
          Test Error x5
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['test', 'Baaaaka', null, 1]);
          }}>
          Test Validate
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['test', 1, 'Baaaaka']);
          }}>
          Test ValidateArgs
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['prompt-set',
                      { type:'alert',
                        msg: 'This is an alert',
                        onOk: ['test-prompt', 'alert-ok'] }]);
          }}>
          Test Alert
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['prompt-set',
                      { type: 'confirm',
                        msg: 'This is a confirm',
                        onOk: ['test-prompt', 'confirm-ok'],
                        onCancel: ['test-prompt', 'confirm-cancel'] }]);
          }}>
          Test Confirm
        </PageMenuItem>
        <PageMenuItem onClick={() => {
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
