//プラグインの読み込み
const gulp = require("gulp");
const sass = require("gulp-sass");//scss

///////////////////////////////////scssコンパイル

gulp.task("sass", function(){
  gulp.src(scss/**/*scss)
  .pipe(sass())
  .pipe(gulp.dest("./css"));
});
