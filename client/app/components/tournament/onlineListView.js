export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch } from 'app/services/state';
import { tournamentOnlineListSub } from 'app/components/tournament/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { AuthRequired } from 'app/components/auth/auth';
import { TournamentOnlineListItem } from 'app/components/tournament/onlineListItemView';
/* eslint-enable no-unused-vars */

export const TournamentOnlineList = createComponent({
  render: listRender,
});

function listRender() {
  return (
    <AuthRequired>
      <ListContent />
    </AuthRequired>
  );
}

// eslint-disable-next-line no-unused-vars
const ListContent = createComponent({
  displayName: 'TournamentOnlineList',
  subscriptions: { list: tournamentOnlineListSub },
  getInitialState: listContentGetInitialState,
  render: listContentRender,
  componentDidMount: listContentDidMount,
});

function listContentGetInitialState() {
  return { list: [] };
}

function listContentRender() {
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

function listContentDidMount() {
  dispatch(['tournament-onlineRefresh']);
}
