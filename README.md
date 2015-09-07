# veins

[![Build Status](https://travis-ci.org/DavidCai1993/veins.svg?branch=master)](https://travis-ci.org/DavidCai1993/veins)
[![Coverage Status](https://coveralls.io/repos/DavidCai1993/veins/badge.svg?branch=master&service=github)](https://coveralls.io/github/DavidCai1993/veins?branch=master)

A koa router middleware for RESTful API basing on the folder path.

Venis mapping all paths inside the specified folder to HTTP request routes.

## Installation

```SHELL
npm install veins --save
```

## Usage

In your `app.js`：

```js
let koa = require('koa');
let veins = require('veins');

let app = koa();

veins.route(app);
//Then venis will initialize all routers.

app.listen(3000);
```

## Controllers & filters

Venis will mount all `js` files in `./controllers`(could be changed) to your app's router.

For example, you have a file named `user.js` in folder `./controllers`:

```js
//./controllers/user.js :
exports.get = function *(next) {
  //.....
};

exports.delete = function *(next) {
  //....
};
```

And after calling `veins.route(app);`, this file will be mounted on:

```SHELL
GET      /user
DELETE   /user
```

Nested folders are also be supported:

```js
//./controllers/human/man/DavidCai.js :
exports.post = function *(next) {
  //.....
};
```

```SHELL
POST      /human/man/DavidCai
```

If you need some filters for your routers, just add a file to './fitters', and add a array property named `filters` to the handle function or the `exports` object in a controller.

For example, here is a file named `auth.js` in `./filters`:

```js
//./filters/auth.js :
module.exports = function *(next) {
  //....
  yield next;
}
```

You can require this filter in a controller:

```js
//./controllers/user.js :
exports.get = function *(next) {
  //.....
};

//add method level filters.
exports.get.filters = ['auth'];

exports.delete = function *(next) {
  //....
};

//add controller level filters.
exports.filters = ['auth'];
```

You can add as many filters as you want!

## Use customized path

The paths of controllers and filters can be customized by passing a config object as the second parameter to `
veins.route();`:

```js
veins.route(app, {
  controllers: './your/controllers',
  filters: './your/filters'
});
```

## License

MIT
