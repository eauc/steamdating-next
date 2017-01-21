export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { Round } from 'app/components/rounds/rounds';
import { RoundsPageMenu } from 'app/pages/rounds/menuView';
import { Page,
         PageContent,
         PageMenuItem,
       } from 'app/components/page/page';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const RoundsNthPage = createComponent({
  render,
  doDelete,
});

function render() {
  const index = Number(this.props.params.nRound);
  return (
    <Page>
      <RoundsPageMenu>
        <PageMenuItem onClick={this.doDelete}>
          <Icon name="trash" />
          <span> Delete Round</span>
        </PageMenuItem>
      </RoundsPageMenu>
      <PageContent>
        <h4>Round {index + 1}</h4>
        <Round index={index} />
      </PageContent>
    </Page>
  );
}

function doDelete() {
  const index = Number(this.props.params.nRound);
  dispatch({
    eventName: 'prompt-set',
    type: 'confirm',
    msg: 'Are you sure you want to delete this round ?',
    onOk: { eventName: 'rounds-remove', index },
  });
}
