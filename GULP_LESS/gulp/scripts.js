const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

module.exports = function(options) {
  return function() {
    const isDevelopment = options.isDevelopment;
    const src = options.src;
    return gulp
      .src(src)
      .pipe(
        $.plumber({
          errorHandler: $.notify.onError(function(error) {
            return {
              title: "scripts",
              message: error.message
            };
          })
        })
      )
      .pipe($.if(isDevelopment, $.sourcemaps.init()))
      .pipe($.betterRollup({}, "iife"))
      .pipe($.if(!isDevelopment, $.uglifyEs.default()))
      .pipe($.if(!isDevelopment, $.rename({ suffix: ".min" })))
      .pipe($.if(isDevelopment, $.sourcemaps.write()))
      .pipe(gulp.dest("build/js"));
  };
};
