export let __hotReload = true;

import { React } from 'app/helpers/react';

export function Icon(props) {
  return (<span className={`fa fa-${props.name}`}></span>);
}
