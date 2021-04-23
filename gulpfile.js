//导入工具包
var gulp = require('gulp'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer');

var paths = {
    styles: {
        main: 'dist/less/main.less',
        src: 'dist/less/*.less',
        dest: 'dist/css'
    }
};

function reduceLess() {
    return gulp.src(paths.styles.main)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.styles.dest));
}

// 实时编译less
gulp.task('watch', function() {
    gulp.watch(paths.styles.src, reduceLess);
});
