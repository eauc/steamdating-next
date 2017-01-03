export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { NavLink } from 'app/components/nav/linkView';
import { NavToggle } from 'app/components/nav/toggleView';
import { AuthToggleButton } from 'app/components/auth/auth';
import { TournamentSaveButton } from 'app/components/tournament/tournament';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const NavMenu = createComponent({
  displayName: 'NavMenu',
  render: navMenuRender,
  getInitialState: navMenuGetInitialState,
  doUpdateState: navMenuDoUpdateState,
  doToggleShow: navMenuDoToggleShow,
  doEnterRounds: navMenuDoEnterRounds,
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
               onClick={this.doToggleShow}>Home</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/file"
               onClick={this.doToggleShow}>File</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/players"
               onClick={this.doToggleShow}>Players</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/rounds"
               onClick={this.doEnterRounds}>Rounds</NavLink>
      <NavLink currentHash={this.state.currentHash}
               path="/about"
               onClick={this.doToggleShow}>About</NavLink>
      <div className="actions">
        <AuthToggleButton>
          <Icon name="user" />
        </AuthToggleButton>
        <TournamentSaveButton iconOnly="true" />
        <NavToggle onToggle={this.doToggleShow} />
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

function navMenuDoUpdateState() {
  this.setState({
    currentHash: self.location.hash,
  });
}

function navMenuDoToggleShow() {
  this.setState({
    show: !this.state.show,
  });
}

function navMenuDoEnterRounds() {
  this.doToggleShow();
  dispatch({ eventName: 'rounds-init' });
}

function navMenuComponentWillMount() {
  self.addEventListener('hashchange', this.doUpdateState);
}

function navMenuComponentWillUnmount() {
  self.removeEventListener('hashchange', this.doUpdateState);
}
