var gulp= require('gulp'); //підключення gulp
var less = require('gulp-less'); //підключення модуля для less
var plumber = require('gulp-plumber'); //підключення пламбера для запобігання помилок
var browserSync = require('browser-sync'); //підклюення модуля локального сервера
var postcss= require('gulp-postcss'); //підключення postcss модуля
var autoprefixer= require('autoprefixer'); //підключення автопрефіксора webkit-
var mqpacker= require('css-mqpacker'); //підключення модуля для сортування медіа-виразів
var csso = require('gulp-csso'); //модуль для мінімалізації css
var rename = require("gulp-rename"); //модуль для переіменування файлів
var imagemin = require('gulp-imagemin'); //модуль для мінімалізації картинок
var svgstore = require('gulp-svgstore'); //модуль для створення svg спрайта
var svgmin = require('gulp-svgmin'); //мінімалізація для svg
var run = require('gulp-sequence') //плагін для запуску задач послідовно
var del = require('del'); //плагін для видалення файлів


gulp.task('default', ['serve']); //просто задав дефолтний таск

//функція для компіляції less to css
gulp.task('less', function () {
  return gulp.src('less/style.less') //беремо less файл підключень less модулів
    .pipe(plumber()) //застереження від помилки
    .pipe(less())  //перетворення less в  css
    .pipe(gulp.dest('css')) //оновлення css
    .pipe(browserSync.reload({stream: true})); //оновлення сторінки в браузері
});

//функція локального браузера
gulp.task("serve", ["less"], function(){
  browserSync.init({ //запуск проекта що у папці в браузері
      server: "."
  });
    gulp.watch("less/**/*.less",["less"]); //відстеження змін less файлів
    gulp.watch("*.html") //відстеження змін html файлів
    .on("change",browserSync.reload); //перезагрузка якщо html змінився
});




//функція автопрефіксації, сортирування за медіавиразами і мінімалізація
gulp.task("min",function(){
      gulp.src("css/style.css") //беремо файл який скомпільований з less
      .pipe(postcss([ //запуск постпроцесорних плагінів
        autoprefixer({browsers: ['last 2 versions']}), //запуск автопрефіксера
        mqpacker({ //запуск сортувальника медіа виразів
          sort: true
        })
      ]))
      .pipe(gulp.dest("final/css")) //збереження файла в кінцеву папку
      .pipe(csso()) //запуск плагіна для мінімалізації css
      .pipe(rename("style.min.css")) //перейменування мініманізованого файла
      .pipe(gulp.dest("final/css")) //збереження мініманізованого файла
});


//минимализация картинок
gulp.task("imagemin",function(){
  gulp.src("img/**/*.{png,jpg,gif}") //вибір усіх каринок із папаки img із розширеннями png,jpg,gif
    .pipe(imagemin([ //запуск мінімалізатора картинок
      imagemin.optipng({optimizationLevel: 3}), //рівень зжимання
      imagemin.jpegtran({progressive: true}) //дозвіл прогресивного перетворення картинок
    ]))
    .pipe(gulp.dest('final/img')) //збереження мінімалізованих картинок
});

//зборка svg спрайта
gulp.task("svgsprite",function(){
  return gulp.src("img/icons/*.svg") //беремо іконки із папки
    .pipe(svgmin()) //мінімалізація css
    .pipe(svgstore({ //створення спрайта
      inLineSvg: true
    }))
    .pipe(rename("symbols.svg")) //перейменування
    .pipe(gulp.dest('final/img')); //збереження
});


//збірка білд
gulp.task("build",function(fn){
  run("less", "min", "imagemin", "svgsprite", fn);
});




gulp.task("copy", function(){
  return gulp.src([
    "fonts/**/*{woff,woff2}",
    "img/**",
    "js/**",
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function(){
  return del("build");
});
