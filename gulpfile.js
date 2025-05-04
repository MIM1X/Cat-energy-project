import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
// import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import { deleteAsync } from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

const html = () => {
  return gulp.src('source/*.html')
  // .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Images

export const images = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(plumber())
    .pipe(imagemin([
      imageminMozjpeg({
        quality: 80,
        progressive: true
      }),
      imageminPngquant({
        quality: [0.8, 0.9],
        speed: 1
      })
    ]))
    .pipe(gulp.dest('build/img'));
}


// Webp

export const imagesWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(plumber())
    .pipe(webp({
      quality: 80,
      method: 6
    }))
    .pipe(gulp.dest('build/img'));
}

// SVG Sprite

export const svgSprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(imagemin([
      imageminSvgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'removeTitle',
            active: true
          },
          {
            name: 'removeDesc',
            active: true
          }
        ]
      })
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(gulp.dest('build/img'));
}

// Copy

export const copy = () => {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/*.ico',
    'source/*.webmanifest',
    'source/css/**/*.css',
    'source/icon/**/*.{svg,png}'
  ], { base: 'source' })
    .pipe(gulp.dest('build'));
}

// Clean

export const clean = () => {
  return deleteAsync('build');
}


// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Development task
export const dev = gulp.series(
  styles,
  server,
  watcher
);

// Build task
export const build = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(
    styles,
    html,
    scripts,
    imagesWebp,
    svgSprite
  )
);

// Default task (for development)
export default dev;
