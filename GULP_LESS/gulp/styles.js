const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const LessAutoprefix = require("less-plugin-autoprefix");

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
              title: "style",
              message: error.message
            };
          })
        })
      )
      .pipe($.if(isDevelopment, $.sourcemaps.init()))
      .pipe(
        $.less({
          plugins: [new LessAutoprefix({ browsers: ["last 2 versions"] })]
        })
      )
      .pipe($.if(!isDevelopment, $.cleanCss()))
      .pipe($.if(!isDevelopment, $.rename({ suffix: ".min" })))
      .pipe($.if(isDevelopment, $.sourcemaps.write()))
      .pipe(gulp.dest("build/css"));
  };
};
