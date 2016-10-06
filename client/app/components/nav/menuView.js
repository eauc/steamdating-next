export let __hotReload = true;

import R from 'app/helpers/ramda';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { NavLink } from 'app/components/nav/linkView';
import { NavToggle } from 'app/components/nav/toggleView';
import { AuthToggleButton } from 'app/components/auth/auth';
import { TournamentSaveButton } from 'app/components/tournament/tournament';
/* eslint-enable no-unused-vars */

export const NavMenu = createComponent({
  displayName: 'NavMenu',
  render: navMenuRender,
  getInitialState: navMenuGetInitialState,
  updateState: navMenuUpdateState,
  toggleShow: navMenuToggleShow,
  componentWillMount: navMenuComponentWillMount,
  componentWillUnmount: navMenuComponentWillUnmount,
});

function navMenuRender() {
  return (
    <div className={{
           show: this.state.show,
         }}>
      <NavLink currentHash={this.state.currentHash}
               path="/home"
               onClick={this.toggleShow}>Home</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/file"
               onClick={this.toggleShow}>File</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/players"
               onClick={this.toggleShow}>Players</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/about"
               onClick={this.toggleShow}>About</NavLink>
      <div className="actions">
        <AuthToggleButton>
          <Icon name="user" />
        </AuthToggleButton>
        <TournamentSaveButton iconOnly="true" />
        <NavToggle onToggle={this.toggleShow} />
      </div>
    </div>
  );
}

function navMenuGetInitialState() {
  return {
    currentHash: self.location.hash,
    show: false,
  };
}

function navMenuUpdateState() {
  this.setState({
    currentHash: self.location.hash,
  });
}

function navMenuToggleShow() {
  this.setState({
    show: !this.state.show,
  });
}

function navMenuComponentWillMount() {
  this.updateState = R.bind(this.updateState, this);
  this.toggleShow = R.bind(this.toggleShow, this);
  self.addEventListener('hashchange', this.updateState);
}

function navMenuComponentWillUnmount() {
  self.removeEventListener('hashchange', this.updateState);
}
