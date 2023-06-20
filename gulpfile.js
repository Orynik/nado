const gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssnano'),
    prefix = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
    browserSync = require("browser-sync").create();
// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
runSequence = require('run-sequence');

function onError(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Basso"
    })(err);
    this.emit('end');
};

function browserSyncInit() {
    browserSync.init({
        // proxy: 'https://local.wordpress', // http:/local.wp
        // proxy: 'http://localhost:8082', // http:/local.wp
    });
}

// BUILD SUBTASKS
// ---------------

function scss() {
    return gulp.src('assets/scss/style.scss', {sourcemaps: true})
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(prefix({
            browsers: ['last 2 versions']
        }))
        .pipe(cssmin({
            zindex: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream())
}

function js() {
    return gulp.src('assets/js/*.js', {sourcemaps: true})
        .pipe(plumber({errorHandler: onError}))
        .pipe(browserSync.stream())
}

function watch() {
    gulp.watch(['assets/scss/**/*.scss'], scss);
    gulp.watch(['assets/js/*.js'], js);
    gulp.watch('**/*.html').on('change', browserSync.reload);
}


const buildTask = gulp.parallel(scss, js)
const defaultTask = gulp.parallel(buildTask, browserSyncInit, watch)

exports.default = defaultTask

