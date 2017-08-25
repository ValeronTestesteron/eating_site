var gulp         = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    imagemin     = require('gulp-imagemin'), // Подключаем Imagemin
    concat       = require('concat'), // Подключаем Concat
    uglifyjs     = require('uglify-js'), //Подключаем uglifyjs
    del          = require('del'),
    cache        = require('gulp-cache'),
    cleanCSS     = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify       = require("gulp-notify");


gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//gulp.task('js', function() {
//  return gulp.src([
//    'app/libs/jquery/dist/jquery.min.js',
//    'app/libs/jQuery.mmenu/dist/jquery.mmenu.all.js',
//  ])
//  .pipe(concat('scripts.min.js'))
//  .pipe(uglify())
//  .pipe(gulp.dest('app/js'))
//  .pipe(browserSync.reload({stream: true}));
//});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img'));
});


gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('build', ['removedist', 'imagemin', 'sass'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.css',
		])
    .pipe(rename({suffix: '.min', prefix : ''}))
	  .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('watch', ['browser-sync', 'sass', ], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами
    // Наблюдение за другими типами файлов
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
});
