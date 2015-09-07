'use strict';

process.chdir('./test');

let koa = require('koa');
let request = require('supertest');
let should = require('should');
let venis = require('../veins');

let app = koa();

describe('test veins', function () {
  before(function () {
    venis.route(app);
  });

  describe('controllers', function () {
    it('get', function (done) {
      request(app.listen())
        .get('/controller')
        .expect(200)
        .end(function (err, res) {
          res.text.should.be.eql('get');
          done();
        });
    })
  });

  it('put', function (done) {
    request(app.listen())
      .put('/controller')
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.eql('put');
        done();
      });
  });
  
});
