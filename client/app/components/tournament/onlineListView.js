export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import styles from 'app/helpers/styles';
import { dispatch } from 'app/services/state';
import { tournamentOnlineListSub } from 'app/components/tournament/sub';
import { AuthRequired } from 'app/components/auth/auth';
import { Icon } from 'app/components/misc/misc';

export const TournamentOnlineList = React.createClass({
  render: onlineListRender,
  mixins: [ pureRenderMixin ]
});

function onlineListRender() {
  return (
    <AuthRequired>
      <TournamentsList />
    </AuthRequired>
  );
}

const TournamentsList = styles.decorator(React.createClass({
  displayName: 'TournamentsList',
  mixins: [ pureRenderMixin,
            subscriptionsMixin ],
  subscriptions: { list: tournamentOnlineListSub },
  render: listRender,
  componentDidMount: listComponentDidMount
}));

function listRender() {
  const items = R.map((t) => (
    <TournamentsListItem
       key={t.id}
       tournament={t} />
  ), this.state.list);
  return (
    <ul>
      {items}
    </ul>
  );
}

function listComponentDidMount() {
  dispatch(['tournament-onlineRefresh']);
}

const TournamentsListItem = styles.decorator(React.createClass({
  displayName: 'TournamentsListItem',
  mixins: [ pureRenderMixin ],
  render: itemRender,
  download: itemDownload
}));

function itemRender() {
  const tournament = this.props.tournament;
  return (
    <li className="item">
      <span className="itemLabel">
        {tournament.date} - {tournament.name}
      </span>
      <button className="action"
              onClick={() => this.download(tournament)}>
        <Icon name="download" />
        <span className="actionLabel"> Download</span>
      </button>
    </li>
  );
}

function itemDownload(tournament) {
  dispatch(['tournament-onlineDownload', tournament]);
}
