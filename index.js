'use strict';

let assert = require('assert');
let util = require('util');
let path = require('path');
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
  let controllersPath = path.join(cwd, path.controllers);
  let filtersPath = path.join(cwd, path.filters);

  new Promise((resolve, reject) => {
    glob(controllersPath + '/**/*.js', (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  })
  .then((files) => {
    files.forEach((path) => {
      let exported = require(`${cwd}/${path}`);
      let url = path.split('.')[0];
      METHODS.forEach((method) => {
        if (typeof exported[method] === 'function') router[method](url, exported[method]);
      });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
  })
  .catch((err) => {
    let msg = err.message;
    console.error(`uncaught error: ${msg}`);
  });
};
