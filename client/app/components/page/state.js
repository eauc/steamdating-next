export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import page from 'page';
import { dispatch } from 'app/services/state';
import { registerInit } from 'app/services/init';

import { HomePage } from 'app/pages/home/view';
import { PlayersListPage } from 'app/pages/players/listView';
import { PlayersCreatePage } from 'app/pages/players/createView';
import { PlayersEditPage } from 'app/pages/players/editView';
import { FilePage } from 'app/pages/file/view';
import { AboutPage } from 'app/pages/about/view';

registerInit('page', [], routerStart);

export const PAGES = {
  HomePage: { component: HomePage, path: '/home' },
  PlayersListPage: { component: PlayersListPage, path: '/players/list' },
  PlayersCreatePage: { component: PlayersCreatePage, path: '/players/create' },
  PlayersEditPage: { component: PlayersEditPage, path: '/players/edit' },
  FilePage: { component: FilePage, path: '/file' },
  AboutPage: { component: AboutPage, path: '/about' },
};

export function routerStart(state) {
  page.base(self.location.pathname);
  R.forEach((pageName) => {
    page(PAGES[pageName].path, () => {
      log.router(`routing ${pageName} home`);
      dispatch(['page-set', pageName]);
    });
  }, R.keys(PAGES));
  page('*', (...args) => {
    log.router('404 page not found', args);
    page.show('/home');
  });
  page.start({ hashbang: true });
  return R.assoc('page', null, state);
}

export function routerStop() {
  page.stop();
}
