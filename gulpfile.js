//From http://stackoverflow.com/questions/25384796/can-i-set-gulp-livereload-to-run-after-all-files-are-compiled

var express = require('express');
var gulp = require('gulp');

var jade = require('gulp-jade');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

//var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var connect = require('connect-livereload');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

var sources = {
    jade: "./jade/*.jade",
//    sass: "./scss/*.scss",
    js: "./js/*.js"
};

// Define destinations object
var dest = {
    html: "./",
//    css: "./css/",
    js: "./js/"
};
var host = '127.0.0.1';
var port = '5500';

// Minify and copy all JavaScript
gulp.task('scripts', function(){
    return gulp.src(['./js/imports.js', './js/!(main|imports)*.js', './js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify())    
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.js))
});
// Compile and copy Jade
gulp.task("jade", function (event) {
    return gulp.src(sources.jade)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(dest.html))
});

gulp.task('sass-sources', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest.css));
});
gulp.task('sass', function (event) {
    return gulp.src(sources.sass)
        .pipe(sass({
                //outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(gulp.dest(dest.css))
});

// Server
gulp.task('server', function () {
    var server = express();
    server.use(connect({
        port: port
    }));
    server.use(express.static(__dirname));
    server.listen(port, host);
});

// Watch sources for change, executa tasks
gulp.task('watch', function () {

    gulp.watch(sources.jade, ["jade", "refresh"]);
//    gulp.watch(sources.sass, ["sass", "refresh"]);
    gulp.watch(sources.js, ["scripts", "refresh"]);

});

gulp.task("refresh", function () {
//    livereload.listen({
//        port: port,
//        host: host
//    });
//    console.log('LiveReload is triggered');
});

// Define default task
gulp.task("default", ["server", "jade", /*"sass", "scripts", */"watch"]);
