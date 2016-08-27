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
          Home Menu 1
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['error-set', 'Ouuups1!']);
            dispatch(['error-set', 'Ouuups2!']);
            dispatch(['error-set', 'Ouuups3!']);
            dispatch(['error-set', 'Ouuups4!']);
            dispatch(['error-set', 'Ouuups5!']);
          }}>
          Home Menu 2
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['test', 'Baaaaka', null, 1]);
          }}>
          Home Menu 3
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['test', 1, 'Baaaaka']);
          }}>
          Home Menu 4
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
