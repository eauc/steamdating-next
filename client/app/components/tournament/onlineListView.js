export let __hotReload = true;

import R from 'app/helpers/ramda';
import { React, createComponent } from 'app/helpers/react';
import { dispatch } from 'app/services/state';
import { tournamentOnlineListSub } from 'app/components/tournament/sub';
import { AuthRequired } from 'app/components/auth/auth';
import { Icon } from 'app/components/misc/misc';

export const TournamentOnlineList = createComponent({
  render: onlineListRender
});

function onlineListRender() {
  return (
    <AuthRequired>
      <TournamentsList />
    </AuthRequired>
  );
}

const TournamentsList = createComponent({
  displayName: 'TournamentsList',
  subscriptions: { list: tournamentOnlineListSub },
  render: listRender,
  componentDidMount: listComponentDidMount
});

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

const TournamentsListItem = createComponent({
  displayName: 'TournamentsListItem',
  render: itemRender,
  download: itemDownload
});

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
