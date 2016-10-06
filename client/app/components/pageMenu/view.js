export let __hotReload = true;

import R from 'app/helpers/ramda';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
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

// eslint-disable-next-line no-unused-vars
const PageMenuToggle = createComponent({
  displayName: 'PageMenuToggle',
  render: pageMenuToggleRender,
});

function pageMenuToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name={this.props.show ? 'chevron-down' : 'chevron-up'} />
    </button>
  );
}

export const PageMenuItem = createComponent({
  displayName: 'PageMenuItem',
  render: pageMenuItemRender,
});

function pageMenuItemRender() {
  return (
    <a href={this.props.href}
       onClick={this.props.onClick}>
      {this.props.children}
    </a>
  );
}
