export let __hotReload = true;

import R from 'app/helpers/ramda';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { PageMenuItem } from 'app/components/page/pageMenuItemView';
import { PageMenuToggle } from 'app/components/page/pageMenuToggleView';
/* eslint-enable no-unused-vars */

export const PageMenu = createComponent({
  displayName: 'PageMenu',
  render: pageMenuRender,
  getInitialState: pageMenuGetInitialState,
  toggleShow: pageMenuToggleShow,
});

function pageMenuRender() {
  return (
    <div className={{
           show: this.state.show,
         }}>
      {this.props.children}
      <PageMenuToggle onToggle={this.toggleShow}
                      show={this.state.show} />
    </div>
  );
}

function pageMenuGetInitialState() {
  this.toggleShow = R.bind(this.toggleShow, this);
  return { show: false };
}

function pageMenuToggleShow() {
  this.setState({ show: !this.state.show });
}
