export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import styles from 'app/helpers/styles';
import { Icon } from 'app/components/misc/misc';
import { NavLink } from 'app/components/nav/linkView';
import { NavToggle } from 'app/components/nav/toggleView';
import { AuthToggleButton } from 'app/components/auth/auth';
import { TournamentSaveButton } from 'app/components/tournament/tournament';

export const NavMenu = styles.decorator(React.createClass({
  displayName: 'NavMenu',
  mixins: [ pureRenderMixin ],
  render: navMenuRender,
  getInitialState: navMenuGetInitialState,
  updateState: navMenuUpdateState,
  toggleShow: navMenuToggleShow,
  componentWillMount: navMenuComponentWillMount,
  componentWillUnmount: navMenuComponentWillUnmount
}));

function navMenuRender() {
  return (
    <div className={{
           'show': this.state.show
         }}>
      <NavLink current_hash={this.state.current_hash}
               path="/home"
               onClick={this.toggleShow}>Home</NavLink>
      <NavLink current_hash={this.state.current_hash}
               path="/file"
               onClick={this.toggleShow}>File</NavLink>
      <NavLink current_hash={this.state.current_hash}
               path="/players"
               onClick={this.toggleShow}>Players</NavLink>
      <NavLink current_hash={this.state.current_hash}
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
    current_hash: self.location.hash,
    show: false
  };
}

function navMenuUpdateState() {
  this.setState({
    current_hash: self.location.hash
  });
}

function navMenuToggleShow() {
  this.setState({
    show: !this.state.show
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
