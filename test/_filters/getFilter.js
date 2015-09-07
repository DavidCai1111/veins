module.exports = function* (next) {
  if (this.body === undefined) {
    this.body = 'get_filter ';
  } else {
    this.body += 'get_filter ';
  }

  yield next;
};
