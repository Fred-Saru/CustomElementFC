module.exports = function (source, map, meta) {
  console.log(source);
  ++counter;
  console.log(counter);
  this.callback(null, source, map, meta);
  return;
};

var counter = 0;