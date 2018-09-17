//From http://stackoverflow.com/questions/25384796/can-i-set-gulp-livereload-to-run-after-all-files-are-compiled

var gulp = require('gulp');

var jade = require('gulp-jade');
//var gutil = require('gulp-util');
//var stylus = require('gulp-stylus');
//var jeet = require('jeet');
//var nib = require('nib');
//var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var sources = {
    jade: "./*.jade",
    sass: "./scss/*.scss",
    //    partials: "partials/**/*.jade",
    //    stylus: "styl/**/*.styl",
    //    scripts: "js/**/*.js"
};

// Define destinations object
var destinations = {
    //  html: "dist/",
    html: "./",
    css: "./css/",
  //  js: "dist/js"
};

// Compile and copy Jade
gulp.task("jade", function (event) {
    return gulp.src(sources.jade)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(destinations.html))
});

gulp.task('sass-sources', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./css'));
});
//// Compile and copy Stylus
//gulp.task("stylus", function (event) {
//    return gulp.src(sources.stylus).pipe(stylus({
//        use: [nib(), jeet()],
//        import: [
//      'nib',
//      'jeet'
//    ],
//        style: "compressed"
//    })).pipe(gulp.dest(destinations.css));
//});
gulp.task('sass', function (event) {
    return gulp.src(sources.sass)
        .pipe(sass({
            //outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(destinations.css))
});
// Minify and copy all JavaScript
//gulp.task('scripts', function () {
//    gulp.src(sources.scripts)
//        .pipe(uglify())
//        .pipe(gulp.dest(destinations.js));
//});

// Server
gulp.task('server', function () {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(__dirname));
    app.listen(4000, '127.0.0.1');
});

// Watch sources for change, executa tasks
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(sources.jade, ["jade", "sass", "refresh"]);
    //    gulp.watch(sources.partials, ["jade", "refresh"]);
    //    gulp.watch(sources.stylus, ["stylus", "refresh"]);
    //    gulp.watch(sources.scripts, ["scripts", "refresh"]);
});

// Refresh task. Depends on Jade task completion
gulp.task("refresh", ["jade"], function () {
    livereload.changed();
    console.log(livereload)
    console.log('LiveReload is triggered');
});

// Define default task
gulp.task("default", ["jade", /* "stylus", "scripts", */ "server", "sass", "watch"]);