'use strict';

let { join } = require('path');
let assert = require('assert');
let util = require('util');
let glob = require('glob');
let router = require('koa-router')();

/**
 * Consts
 * @private
 */

const cwd = process.cwd();
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

process.on('unhandledRejection', (reason) => console.error(`unhandled rejection: ${reason}`));

/**
 * Create routers
 * @param  {Object}  a koa instance
 * @param  {Object}  object that specify the path of the route folder
 * @public
 */

function route (app, path = DEFAULT_PATH) {
  assert(util.isObject(path), `path should be an object but a ${typeof path}`);
  let controllersPath = join(cwd, path.controllers);
  let filtersPath = join(cwd, path.filters);

  glob.sync(`${controllersPath}/**/*.js`).forEach((path) => _addRouters(path));

  app.use(router.routes());
  app.use(router.allowedMethods());
};

function _addRouters (path) {
  let exported = require(`${cwd}/${path}`);
  let url = path.split('.')[0];
  let middlewares = [];
  let outterFilters = [];

  if (util.isArray(exported.filters)) {
    exported.filters.forEach((filter) => outFilters.push(require(`${filtersPath}/${path}`)[filter]));
  }

  METHODS.forEach((method) => {
    if (typeof exported[method] === 'function') {
      let innerFilters = [];
      if (util.isArray(exported[method].filters)) {
        exported[method].filters.forEach(() => innerFilters.push(require(`${filtersPath}/${path}`)[filter]));
      }
      outterFilters.unshift(url);
      innerFilters.push(exported[method]);
      router[method].apply(router, outterFilters.concat(innerFilters));
    }
  });
};
