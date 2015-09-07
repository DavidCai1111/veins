exports.get = function* (next) {
  this.body = 'get';
};

exports.post = function* (next) {
  this.body = 'post';
};

exports.put = function* (next) {
  this.body = 'put';
};

exports.delete = function* (next) {
  this.body = 'delete';
}
