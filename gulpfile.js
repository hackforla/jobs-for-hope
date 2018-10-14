const gulp         = require('gulp'),
      browserSync  = require('browser-sync').create(),
      sass         = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      eslint = require('gulp-eslint');

// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
    return gulp.src(['static/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("static/css"))
        .pipe(browserSync.stream());
});


// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: './templates'
    });

    gulp.watch(['static/scss/*.scss'], ['sass']);
    gulp.watch("templates/*.html").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);