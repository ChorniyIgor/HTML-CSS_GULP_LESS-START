"use strict";
let isDevelopment = true;

const gulp = require("gulp");

function lazyRequireTask(taskName, path, options = {}) {
  options.taskName = taskName;
  options.isDevelopment = isDevelopment;
  gulp.task(taskName, function(callback) {
    let task = require(path).call(this, options);
    return task(callback);
  });
}

lazyRequireTask("copy-html", "./gulp/copy-html", {
  fromSrc: "src",
  toSrc: "build"
});

lazyRequireTask("copy-img", "./gulp/copy-img", {
  fromSrc: "src/img",
  toSrc: "build/img"
});

lazyRequireTask("styles", "./gulp/styles", {
  src: "src/less/style.less"
});

lazyRequireTask("scripts", "./gulp/scripts", {
  src: "src/js/main.js"
});

lazyRequireTask("server", "./gulp/server", {
  src: "build"
});

lazyRequireTask("clean", "./gulp/clean");

gulp.task("watch", function() {
  gulp.watch("src/**/*.html", gulp.series("copy-html"));
  gulp.watch("src/img/**", gulp.series("copy-img"));
  gulp.watch("src/less/**/*.less", gulp.series("styles"));
  gulp.watch("src/js/**/*.js", gulp.series("scripts"));
});

gulp.task("copy-all", gulp.parallel("copy-html", "copy-img", "styles", "scripts"));

gulp.task("build", gulp.series("clean", "copy-all"));

gulp.task("dev", gulp.series("copy-all", gulp.parallel("watch", "server")));
