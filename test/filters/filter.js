module.exports = function* (next) {
  this.body = 'filter ';
  yield next;
};
