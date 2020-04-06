//Подключаем галп
const gulp = require('gulp');
//Объединение файлов
const concat = require('gulp-concat');
//Добапвление префиксов
const autoprefixer = require('gulp-autoprefixer');
//Оптисизация стилей
const cleanCSS = require('gulp-clean-css');
//Оптимизация скриптов
const uglify = require('gulp-uglify');
//Удаление файлов
const del = require('del');
//Синхронизация с браузером
const browserSync = require('browser-sync').create();
//Для препроцессоров стилей
const sourcemaps = require('gulp-sourcemaps');
//Sass препроцессор
const sass = require('gulp-sass');

const imagemin = require('gulp-imagemin');

const font = require('gulp-font')


const fontsFiles = [
   './app/fonts/**/*',
]

//Порядок подключения css файлов
const styleFiles = [
   './app/css/fonts.css',
   './app/css/reset.css',
   './app/bower/bootstrap/dist/css/bootstrap.css',
   './app/css/link/articlmodal/jquery.arcticmodal-0.3.css',
   './app/css/link/articlmodal/simple.css',
   './app/bower/slick-carousel/slick/slick.css',
   './app/bower/slick-carousel/slick/slick-theme.css',
   './app/css/main.scss',
   './app/css/media.scss'
]
//Порядок подключения js файлов
const scriptFiles = [
   './app/bower/jquery/dist/jquery.js',
   './app/js/link/font-awesome/font-awesome.js',
   './app/bower/slick-carousel/slick/slick.js',
   './app/bower/bootstrap/dist/js/bootstrap.js',
   './app/js/link/jquery.arcticmodal-0.3.min.js',
   './app/js/lib.js',
   './app/js/main.js',
]

gulp.task('fonts', () => {
   return gulp.src(fontsFiles)
      .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('styles', () => {
   //Шаблон для поиска файлов CSS
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src(styleFiles)
      .pipe(sourcemaps.init())
      //Указать stylus() , sass() или less()
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         cascade: false
      }))
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(sourcemaps.write('./'))
      //Выходная папка для стилей
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
});
//Таск для обработки скриптов
gulp.task('scripts', () => {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src(scriptFiles)
      //Объединение файлов в один
      .pipe(concat('script.js'))
      //Минификация JS
      .pipe(uglify({
         toplevel: true
      }))
      //Выходная папка для скриптов
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
   return del(['dist/*'])
});


gulp.task('compress', () => {
   return gulp.src('./app/img/**/*')
      .pipe(imagemin({
         progressive: true
      }))
      .pipe(gulp.dest('./dist/img/'))
});


//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
   gulp.watch('./app/fonts/**/*', gulp.series('fonts'))

   gulp.watch('./app/img/**/*{png, jpg, svg, webp}', gulp.series('compress'))
   //Следить за файлами со стилями с нужным расширением
   gulp.watch('./app/css/**/*.{scss, css}', gulp.series('styles'))
   //Следить за JS файлами
   gulp.watch('./app/js/**/*.js', gulp.series('scripts'))
   //При изменении HTML запустить синхронизацию
   gulp.watch("./*.html").on('change', browserSync.reload);
});


//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'compress', 'fonts'), 'watch'));
