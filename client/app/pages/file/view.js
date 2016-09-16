export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';
import { Page, PageContent } from 'app/components/page/view';
import { TournamentNewButton,
         TournamentOpenButton,
         TournamentSaveButton } from 'app/components/tournament/tournament';

export const FilePage = styles.decorator(React.createClass({
  displayName: 'FilePage',
  render: filePageRender
}));

function filePageRender() {
  return (
    <Page>
      <PageContent>
        <TournamentNewButton />
        <TournamentOpenButton />
        <TournamentSaveButton />
      </PageContent>
    </Page>
  );
}