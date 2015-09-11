'use strict';

process.chdir('./test');

let koa = require('koa');
let request = require('supertest');
let should = require('should');
let venis = require('../veins');

let app = koa();

describe('test veins', function () {

  describe('default path', function () {

    before(function () {
      venis.route(app);
    });

    it('get & outterFilters & innerFilters', function (done) {
      request(app.listen())
        .get('/controller/0')
        .expect(200)
        .end(function (err, res) {
          res.text.should.be.containEql('filter get_filter get id:0');
          done();
        });
    })

    it('put & outterFilters', function (done) {
      request(app.listen())
        .put('/controller')
        .expect(200)
        .end(function (err, res) {
          res.text.should.be.containEql('filter')
          res.text.should.be.containEql('put');
          done();
        });
    });
  });

  describe('custom path', function () {

    before(function () {
      venis.route(app, {
        controllers: './_controllers',
        filters: './filters'
      });
    });

    it('get & outterFilters & innerFilters', function (done) {
      request(app.listen())
        .get('/controller')
        .expect(200)
        .end(function (err, res) {
          res.text.should.be.containEql('filter get_filter get');
          done();
        });
    })

    it('put & outterFilters', function (done) {
      request(app.listen())
        .put('/controller')
        .expect(200)
        .end(function (err, res) {
          res.text.should.be.containEql('filter')
          res.text.should.be.containEql('put');
          done();
        });
    });
  });

});
