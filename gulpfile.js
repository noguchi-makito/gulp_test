// gulpプラグインを読み込み
const gulp = require("gulp");
const sass = require("gulp-sass");// Sassをコンパイルするプラグイン
const autoprefixer = require("gulp-autoprefixer");//ベンダープレフィックス付与
const frontnote = require("gulp-frontnote");//ガイド作成
const uglify = require("gulp-uglify");//js圧縮
const browserSync = require( 'browser-sync' );;//ブラウザーリロード
const plumber = require("gulp-plumber");//エラー対応
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
const imagemin = require("gulp-imagemin");//画像圧縮
const pngquant = require("imagemin-pngquant");//画像圧縮
const mozjpeg = require("imagemin-mozjpeg");//画像圧縮


////////////////////////////////////////////////////////////////ブラウザーリロード


// 保存時のリロード
gulp.task( 'browser-sync', function(done) {
  browserSync.init({

  //ローカル開発
  server: {
  baseDir: "./",
  index: "index.html"
  }
  });
  done();
  
});

  gulp.task( "bs-reload", function(done) {
  browserSync.reload();
  done();
  });


////////////////////////////////////////////////////////////////Sassをコンパイルタスク

const scssDir = "scss/**/*.scss"
const cssDir = "./css"

gulp.task("sass", function() {
  return gulp.src(scssDir)
    .pipe(plumber({
      errorHandler: notify.onError({
      title: "scssコンパイルエラー", // 任意のタイトルを表示させる
      message: "<%= error.message %>" // エラー内容を表示させる
      })
    }))
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(autoprefixer())//ベンダープレフィックス自動追加
    .pipe(gulp.dest(cssDir))
});


////////////////////////////////////////////////////////////////jsを圧縮

gulp.task("jsMin", function() {
  return gulp.src(["js/**/*.js","!js/min/**/*.js"])
    .pipe(plumber({
      errorHandler: notify.onError({
      title: "js圧縮エラー", // 任意のタイトルを表示させる
      message: "<%= error.message %>" // エラー内容を表示させる
      })
    }))
    .pipe(uglify())
    .pipe(gulp.dest("./js/min"))
});

////////////////////////////////////////////////////////////////画像圧縮

const imgDir = "img"
const minDir = "img/min"

//圧縮率の定義
gulp.task("imgMin", () => {
  return gulp.src(imgDir + "/*.{png,jpg,gif}")
    .pipe(imagemin([
      pngquant("65-80"),// 配列を渡すと文字列を渡すようにエラーが出たので画質のみを設定
      mozjpeg({
        quality: 85,
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest(minDir));
});


////////////////////////////////////////////////////////////////タスクを監視

gulp.task("watch", function(done){
  gulp.watch("scss/**/*.scss", gulp.task("sass"));//scssファイルが更新されたらsassを実行
  gulp.watch("scss/**/*.scss", gulp.task("bs-reload"));//scssが更新されたら画面をリロード
  gulp.watch(["js/**/*.js","./!js/min/**/*.js"], gulp.task("jsMin"));//jsファイルが更新されたらjsMinを実行
  gulp.watch(["js/**/*.js","./!js/min/**/*.js"], gulp.task("bs-reload"));//jsが更新されたら画面リロード
});


///////////////////////////////////////////////////////////gulpで起動するタスク

gulp.task('default', gulp.series("imgMin", "sass", "jsMin", "browser-sync", "watch"));
