export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';
import { Page, PageContent } from 'app/components/page/view';
import { TournamentNewButton,
         TournamentOpenButton,
         TournamentSaveButton,
         TournamentOnlineList
       } from 'app/components/tournament/tournament';

export const FilePage = styles.decorator(React.createClass({
  displayName: 'FilePage',
  render: filePageRender
}));

function filePageRender() {
  return (
    <Page>
      <PageContent>
        <h3 className="header">Files</h3>
        <div className="fileActions">
          <TournamentNewButton />
          <TournamentOpenButton />
          <TournamentSaveButton />
        </div>
        <h3 className="header">My Online Tournaments</h3>
        <TournamentOnlineList />
      </PageContent>
    </Page>
  );
}
