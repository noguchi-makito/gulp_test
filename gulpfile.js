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
const htmlbeautify = require("gulp-html-beautify");//HTML整形


// ディレクトリーパスの変数

const paths = {
  root: "./",//ルートパス

  //html
  html: {
    src: "html/**/*.html",//編集用パス
    dest: "./"//コンパイルパス
  },

  //css
  styles: {
    src: "scss/**/*.scss",//編集用パス
    dest: "./css"//コンパイルパス
  },

  //js
  scripts: {
    src: ["js/**/*.js", "!js/min/**/*.js"],//編集用パス
    dest: "./js/min"//コンパイルパス
  },

  //img
  images: {
    src: "img",//編集用パス
    dest: "img/min"//コンパイルパス
  }

};


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


gulp.task("sass", function() {
  return gulp.src(paths.styles.src)
    .pipe(plumber({
      errorHandler: notify.onError({
      title: "scssコンパイルエラー", // 任意のタイトルを表示させる
      message: "<%= error.message %>" // エラー内容を表示させる
      })
    }))
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(autoprefixer())//ベンダープレフィックス自動追加
    .pipe(gulp.dest(paths.styles.dest))
});


////////////////////////////////////////////////////////////////jsを圧縮

gulp.task("jsMin", function() {
  return gulp.src(paths.scripts.src)
    .pipe(plumber({
      errorHandler: notify.onError({
      title: "js圧縮エラー", // 任意のタイトルを表示させる
      message: "<%= error.message %>" // エラー内容を表示させる
      })
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
});

////////////////////////////////////////////////////////////////画像圧縮


//圧縮率の定義
gulp.task("imgMin", () => {
  return gulp.src(paths.images.src + "/*.{png,jpg,gif}")
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
    .pipe(gulp.dest(paths.images.dest));
});


////////////////////////////////////////////////////////////////HTML整形


gulp.task("htmlbeautify", function(){
  const htmlOption = {
    indent_size: 2,//インデント2
    preserve_newlines: true,
    indent_with_tabs: false,
    indent_inner_html: true//<head>,<body>をインデント
  };//適用ルール記載

  return gulp.src(paths.html.src)
    .pipe(htmlbeautify(htmlOption))
    .pipe(gulp.dest(paths.html.dest))
});


////////////////////////////////////////////////////////////////タスクを監視

gulp.task("watch", function(done){
  gulp.watch(paths.html.src, gulp.task("htmlbeautify"));//htmlフォルダー内のファイルが更新されたら直下に整形
  gulp.watch(paths.html.src, gulp.task("bs-reload"));//画面自動リロード
  gulp.watch(paths.styles.src, gulp.task("sass"));//scssファイルが更新されたらsassを実行
  gulp.watch(paths.styles.src, gulp.task("bs-reload"));//scssが更新されたら画面をリロード
  gulp.watch(paths.scripts.src, gulp.task("jsMin"));//jsファイルが更新されたらjsMinを実行
  gulp.watch(paths.scripts.src, gulp.task("bs-reload"));//jsが更新されたら画面リロード
});


///////////////////////////////////////////////////////////gulpで起動するタスク

gulp.task('default', gulp.series("htmlbeautify", "imgMin", "sass", "jsMin", "browser-sync", "watch"));
