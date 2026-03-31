const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");

// Compila Sass → CSS
function sassCompile() {
  return gulp
    .src("sass/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("new-theme.css"))
    .pipe(gulp.dest("v4company/css"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("v4company/css"));
}

// Watch nos arquivos sass
function watchFiles() {
  gulp.watch("sass/**/*.scss", sassCompile);
}

// Exports
exports.sass = sassCompile;
exports.watch = watchFiles;
exports.default = sassCompile;
