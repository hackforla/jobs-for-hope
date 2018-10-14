const gulp         = require('gulp'),
      browserSync  = require('browser-sync').create(),
      sass         = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer');

// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
    return gulp.src(['templates/static/scss/style.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("templates/static/css"))
        .pipe(browserSync.stream());
});


// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
          baseDir: './templates' //folder you want to server
        }
    });

    gulp.watch(['templates/static/scss/*.scss'], ['sass']);
    gulp.watch("templates/*.html").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);