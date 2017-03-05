const R = require('ramda');

module.exports = {
  createPage,
};

const commands = {
  withinSection,
};
const sections = {
  nav: {
    selector: '//*[contains(@class, "Nav")]',
  },
  page: {
    selector: '//*[contains(@class, "PageContent")]',
  },
  menu: {
    selector: '//*[contains(@class, "PageMenu")]',
  },
};

function createPage(pageObject) {
  return R.pipe(
    R.over(
      R.lensProp('commands'),
      R.pipe(R.defaultTo([]), R.concat([
        commands,
        { selector: selector(pageObject.selectors) },
      ]))
    ),
    R.over(
      R.lensProp('sections'),
      R.pipe(R.defaultTo({}), R.merge(sections))
    )
  )(pageObject);
}

function withinSection(sectionName, elementSelector) {
  return `${this.section[sectionName].selector}${elementSelector}`;
}

function selector(selectors) {
  return function _selector(selectorName, ...args) {
    const sel = selectors[selectorName];
    if (R.type(sel) === 'Function') {
      return sel.apply(this, args);
    }
    const elementSelector = (R.type(sel[1]) === 'String') ?
            sel[1] : sel[1].apply(this, args);
    return this.withinSection(sel[0], elementSelector);
  };
}
