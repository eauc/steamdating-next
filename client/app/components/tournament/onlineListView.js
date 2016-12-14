export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
import { tournamentOnlineListSub } from 'app/components/tournament/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { AuthRequired } from 'app/components/auth/auth';
import { TournamentOnlineListItem } from 'app/components/tournament/onlineListItemView';
/* eslint-enable no-unused-vars */

export const TournamentOnlineList = createComponent({
  displayName: 'TournamentOnlineList',
  subscriptions: { list: tournamentOnlineListSub },
  getInitialState: listGetInitialState,
  render: listRender,
  componentDidMount: listDidMount,
});

function listGetInitialState() {
  return { list: [] };
}

function listRender() {
  const items = R.map((item) => (
    <TournamentOnlineListItem
       key={item.id}
       tournament={item} />
  ), this.state.list);
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>
            Date
          </th>
          <th>
            Name
          </th>
          <th className="lastUpdate">
            Last Updated At
          </th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>
    </table>
  );
}

function listDidMount() {
  dispatch({ eventName: 'tournament-onlineRefresh' });
}
