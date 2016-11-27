export let __hotReload = true;

export default function stripEvent(handler) {
  return function (state, [_event_, ...args]) {
    return handler(state, args);
  };
}
