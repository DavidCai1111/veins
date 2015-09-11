'use strict';

let {join} = require('path');
let assert = require('assert');
let glob = require('glob');
let router = require('koa-router')();

/**
 * Consts
 * @private
 */

const CWD = process.cwd();
const DEFAULT_PATH = {
  controllers: './controllers',
  filters: './filters'
};
const METHODS = require('methods');

/**
 * Method exports
 * @public
 */

exports.route = route;

/**
 * Create routers
 * @param  {Object}  an instance of koa
 * @param  {Object}  object that specify the path of the route folder
 * @public
 */

function route (app, path = DEFAULT_PATH) {
  const CONTROLLERS_PATH = join(CWD, path.controllers);
  const FILTERS_PATH = join(CWD, path.filters);

  glob.sync(`${CONTROLLERS_PATH}/**/*.js`)
    .map((_path) => _path.slice(CONTROLLERS_PATH.length + 1))
    .forEach((_path) => {
      let exported = require(`${CONTROLLERS_PATH}/${_path}`);
      let outterFilters = [];

      if (Array.isArray(exported.filters)) {
        exported.filters.forEach((filter) => outterFilters.push(require(`${FILTERS_PATH}/${filter}`)));
      }

      METHODS.forEach((method) => {
        let url = `/${_path.split('.')[0]}`;

        if (typeof exported[method] === 'function') {
          if (typeof exported[method].params === 'string') {
            url = join(url, exported[method].params);
          }

          let innerFilters = [];
          if (Array.isArray(exported[method].filters)) {
            exported[method].filters.forEach((filter) => innerFilters.push(require(`${FILTERS_PATH}/${filter}`)));
          }

          innerFilters.push(exported[method]);
          router[method].apply(router, [url].concat(outterFilters).concat(innerFilters));
        }
      });
    });

  app.use(router.routes());
  app.use(router.allowedMethods());
};
