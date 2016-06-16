var gulp = require("gulp");
var webpack = require('webpack-stream');

var paths = {
    pages: ['src/*.html'],
    data: ['src/data/*.prop'],
};

gulp.task("copy-data",function(){ 
    return gulp.src(paths.data)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-data"], function () {
    return gulp.src('src/main.ts')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist'));
});


