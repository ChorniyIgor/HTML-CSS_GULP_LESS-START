const gulp = require("gulp");

module.exports = function(options) {
  const fromSrc = options.fromSrc;
  const toSrc = options.toSrc;
  const taskName = options.taskName;
  return function() {
    return gulp
      .src(`${fromSrc}/**/*.html`, { since: gulp.lastRun(taskName) })
      .pipe(gulp.dest(toSrc));
  };
};
