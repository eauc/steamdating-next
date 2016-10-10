export let __hotReload = true;

import { dispatch } from 'app/services/state';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const TournamentOnlineListItem = createComponent({
  displayName: 'TournamentOnlineListItem',
  getInitialState: itemGetInitialState,
  render: itemRender,
  doDownload: itemDoDownload,
});

function itemGetInitialState() {
  return {};
}

function itemRender() {
  const tournament = this.props.tournament;
  return (
    <tr>
      <td>
        <button className="download"
                onClick={this.doDownload}>
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

function itemDoDownload() {
  dispatch(['tournament-onlineDownload', this.props.tournament]);
}
