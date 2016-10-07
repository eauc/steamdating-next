export let __hotReload = true;

// import { dispatch } from 'app/services/state';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
// import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const TournamentOnlineListItem = createComponent({
  displayName: 'TournamentOnlineListItem',
  render: itemRender,
  // download: itemDownload,
});

function itemRender() {
  const tournament = this.props.tournament;
  return (
    <tr>
      <td>
        {tournament.date}
      </td>
      <td>
        {tournament.name}
      </td>
      <td>
        {tournament.updated_at}
      </td>
    </tr>
  );
}

// function itemDownload(tournament) {
//   dispatch(['tournament-onlineDownload', tournament]);
// }
