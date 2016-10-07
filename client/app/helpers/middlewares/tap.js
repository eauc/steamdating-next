export let __hotReload = true;

export default function tap(handler) {
  return function (state, event) {
    handler(state, event);
    return state;
  };
}
