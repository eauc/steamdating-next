export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Page, PageContent } from 'app/components/page/view';
import { TournamentNewButton,
         TournamentOpenButton,
         TournamentSaveButton,
         TournamentOnlineList,
       } from 'app/components/tournament/tournament';
/* eslint-enable no-unused-vars */

export const FilePage = createComponent({
  displayName: 'FilePage',
  render: filePageRender,
});

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
