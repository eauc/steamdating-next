export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch } from 'app/services/state';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const TournamentOnlineListItem = createComponent({
  displayName: 'TournamentOnlineListItem',
  getInitialState: itemGetInitialState,
  render: itemRender,
  download: itemDownload,
});

function itemGetInitialState() {
  this.download = R.bind(this.download, this);
  return {};
}

function itemRender() {
  const tournament = this.props.tournament;
  return (
    <tr>
      <td>
        <button className="download"
                onClick={this.download}>
          <Icon name="download" />
          <span className="downloadLabel"> Download</span>
        </button>
      </td>
      <td>
        {tournament.date}
      </td>
      <td>
        {tournament.name}
      </td>
      <td className="lastUpdate">
        {tournament.updated_at}
      </td>
    </tr>
  );
}

function itemDownload() {
  dispatch(['tournament-onlineDownload', this.props.tournament]);
}
