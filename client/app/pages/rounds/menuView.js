export let __hotReload = true;

import R from 'app/helpers/ramda';
import { roundsSub } from 'app/components/rounds/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { PageMenu,
         PageMenuItem,
       } from 'app/components/page/page';
// import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const RoundsPageMenu = createComponent({
  displayName: 'RoundsPageMenu',
  subscriptions: {
    rounds: roundsSub,
  },
  render,
  getInitialState,
  doEnterNextRound,
});

function render() {
  const roundsMenus = R.mapIndexed((_round_, index) => (
    <PageMenuItem
       key={index}
       href={`#/rounds/${index}`}>
      <span>Round{index + 1}</span>
    </PageMenuItem>
  ), this.state.rounds);

  return (
    <PageMenu>
      <PageMenuItem href="#/rounds/all">
        <span>Summary</span>
      </PageMenuItem>
      {roundsMenus}
      <PageMenuItem onClick={this.doEnterNextRound}>
        <span>Next Round</span>
      </PageMenuItem>
      <hr className={{
            rulerHide: R.isNil(this.props.children),
          }} />
      {this.props.children}
    </PageMenu>
  );
}

function getInitialState() {
  return {
    rounds: [],
  };
}

function doEnterNextRound() {
  dispatch({ eventName: 'rounds-startCreate' });
}
