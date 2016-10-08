export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { PageMenuItem } from 'app/components/page/pageMenuItemView';
import { PageMenuToggle } from 'app/components/page/pageMenuToggleView';
/* eslint-enable no-unused-vars */

export const PageMenu = createComponent({
  displayName: 'PageMenu',
  render: pageMenuRender,
  getInitialState: pageMenuGetInitialState,
  doToggleShow: pageMenuDoToggleShow,
});

function pageMenuRender() {
  return (
    <div className={{
           show: this.state.show,
         }}>
      {this.props.children}
      <PageMenuToggle onToggle={this.doToggleShow}
                      show={this.state.show} />
    </div>
  );
}

function pageMenuGetInitialState() {
  return { show: false };
}

function pageMenuDoToggleShow() {
  this.setState({ show: !this.state.show });
}
