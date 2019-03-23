var browserSync = require("browser-sync").create();

module.exports = function(options) {
  const src = options.src;
  return function() {
    browserSync.init({
      server: src
    });
    browserSync.watch(`${src}/**/*.*`).on("change", browserSync.reload);
  };
};
