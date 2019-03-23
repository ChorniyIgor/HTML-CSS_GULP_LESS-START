const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

module.exports = function(options) {
  const fromSrc = options.fromSrc;
  const toSrc = options.toSrc;
  const taskName = options.taskName;
  const isDevelopment = options.isDevelopment;
  return function() {
    return gulp
      .src(`${fromSrc}/**/**.*`, { since: gulp.lastRun(taskName) })
      .pipe($.newer(toSrc))
      .pipe(
        $.if(
          !isDevelopment,
          $.imagemin([
            $.imagemin.optipng({ optimizationLevel: 3 }),
            $.imagemin.jpegtran({ progressive: true })
          ])
        )
      )
      .pipe(gulp.dest(toSrc));
  };
};
