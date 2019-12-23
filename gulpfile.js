// gulpプラグインを読み込みます
const gulp = require("gulp");
const sass = require("gulp-sass");// Sassをコンパイルするプラグイン
const autoprefixer = require("gulp-autoprefixer");//ベンダープレフィックス付与
const frontnote = require("gulp-frontnote");//ガイド作成
const uglify = require("gulp-uglify");//js圧縮
const browser = require("browser-sync");//ブラウザーリロード
const plumber = require("gulp-plumber");//エラー対応
const imagemin = require("gulp-imagemin");//画像圧縮
const pngquant = require("imagemin-pngquant");//画像圧縮
const mozjpeg = require("imagemin-mozjpeg");//画像圧縮


////////////////////////////////////////////////////////////////ブラウザーリロード

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./"
        }
    });
});


////////////////////////////////////////////////////////////////Sassをコンパイルタスク

gulp.task("sass", function() {
    gulp.src("scss/**/*.scss")
      .pipe(plumber())
      .pipe(frontnote({
          css: './css/style.css'
      }))//ガイド作成
      .pipe(sass())
      .pipe(autoprefixer())//ベンダープレフィックス自動追加
      .pipe(gulp.dest("./css"))
      .pipe(browser.reload({stream:true}));//自動リロード
});


////////////////////////////////////////////////////////////////jsを圧縮

gulp.task("min-js", function() {
    gulp.src(["js/**/*.js","!js/min/**/*.js"])
      .pipe(plumber())
      .pipe(uglify())
      .pipe(gulp.dest("./js/min"))
      .pipe(browser.reload({stream:true}));//自動リロード
});

////////////////////////////////////////////////////////////////画像圧縮

const imgDir = "img"
const minDir = "img/min"

//圧縮率の定義
gulp.task('imgMin', () => {
  return gulp.src(imgDir + '/*.{png,jpg,gif}')
    .pipe(imagemin([
      pngquant('65-80'),// 配列を渡すと文字列を渡すようにエラーが出たので画質のみを設定
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

gulp.task("default", function(){
  gulp.watch(["js/**/*.js","!js/min/**/*.js"], gulp.task("min-js"));//jsファイルを監視
  gulp.watch("scss/**/*.scss", gulp.task("sass"));//sassファイルを監視
});
