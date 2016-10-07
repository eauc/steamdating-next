export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Page, PageContent } from 'app/components/page/view';
import { AuthRequired } from 'app/components/auth/auth';
import { TournamentNewButton,
         TournamentOpenButton,
         TournamentSaveButton,
         TournamentOnlineList,
         TournamentOnlineSave,
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
        <h3 className="header">
          Files
        </h3>
        <div className="fileActions">
          <TournamentNewButton />
          <TournamentOpenButton />
          <TournamentSaveButton />
        </div>
        <h3 className="header">
          Online
        </h3>
        <AuthRequired>
          <TournamentOnlineSave />
          <h4 className="header">
            My Online Tournaments
          </h4>
          <TournamentOnlineList />
        </AuthRequired>
      </PageContent>
    </Page>
  );
}
