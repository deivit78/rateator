var gulp = require("gulp");
var webpack = require('webpack-stream');

/*
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
*/

var paths = {
    pages: ['src/*.html'],
    data: ['src/data/*.prop'],
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-data",function(){ 
    return gulp.src(paths.data)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html","copy-data"], function () {
    return gulp.src('src/main.ts')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist'));
});

/*
gulp.task("default", ["copy-html","copy-data"], function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("dist"));
});
*/

