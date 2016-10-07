export let __hotReload = true;

import { onlineSaveFormSchema } from 'app/components/tournament/state';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { AuthRequired } from 'app/components/auth/auth';
import { FormEdit, FormInput } from 'app/components/form/form';
/* eslint-enable no-unused-vars */

export const TournamentOnlineSave = createComponent({
  displayName: 'TournamentOnlineSave',
  render: onlineSaveRender,
});

function onlineSaveRender() {
  return (
    <AuthRequired>
      <FormEdit name="tournament_onlineSave"
                label="Save Tournament Online"
                schema={onlineSaveFormSchema}
                onSubmit="tournament-onlineSave">
        <FormInput name="name"
                   label="Name"
                   type="text"
                   required="required"
                   order="1" />
        <FormInput name="date"
                   label="Date"
                   type="text"
                   placeholder="YYYY/MM/DD"
                   order="2" />
      </FormEdit>
    </AuthRequired>
  );
}
