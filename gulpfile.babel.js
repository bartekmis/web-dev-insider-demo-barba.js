/**
 *
 *  Based on Google Web Starter Kit
 *  Improved by Bigger Picture Agency
 *  (c) 2019 https://www.biggerpicture.agency
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

const { watch, series, parallel, task, src, dest } = require('gulp');
import path from 'path';
import del from 'del';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';
import scriptsConfig from './javascripts.config.json';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import rename from 'gulp-rename';
import jshint from 'gulp-jshint';
import replace from 'gulp-replace';

const AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
const $ = gulpLoadPlugins();
const server = browserSync.create();
const stylish = require('jshint-stylish');

function serve(done) {
  server.init({
    open: false,
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'BP',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    // server: ['.tmp', 'app'],
    server: ['.tmp'],
    port: 3000
  });
  done();
}

function reload(done) {
  server.reload();
  done();
}

let scriptHtmlBody = '';

if (scriptsConfig.body.length) {
  for (var i = 0; i < scriptsConfig.body.length; i++) {
    scriptHtmlBody += `<script src="${scriptsConfig.body[i]}"></script>`;
  }
}

// templates - variables replacement
task('templates', (cb) => {
  src('app/*.html')
    .pipe(replace('@BodyJS', scriptHtmlBody))
    .pipe(replace('@Timestamp', Date.now() ))
    .pipe(dest('.tmp/'));
  cb();
});

// templates build
task('templates-build', (cb) => {
  src('dist/*.html')
    .pipe(replace('@BodyJS', scriptHtmlBody))
    .pipe(replace('@Timestamp', Date.now() ))
    .pipe(dest('dist/'));
  cb();
});

// Lint JavaScript
task('jsLinter', (cb) => {
  src(['./app/scripts/**/*.js', './app/scripts/**/*.es6'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {beep: true}));
  cb();
});

// Optimize images
task('images', (cb) => {
  src('app/images/**/*')
    .pipe(dest('dist/images'))
    .pipe($.size({title: 'images'}));
  cb();
});

// Copy images to .tmp folder while developing
task('copyImagesDev', (cb) => {
  src('app/images/**/*')
    .pipe(dest('.tmp/images'));
  cb();
});

// Copy fonts to .tmp folder while developing
task('copyFontsDev', (cb) => {
  src('app/fonts/**/*')
    .pipe(dest('.tmp/fonts'));
  cb();
});

// Copy all files at the root level (app)
task('copy', (cb) => 
  src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  })
    .pipe(dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Copy fonts
task('copy-fonts', (cb) => {
  src([
    'app/fonts/**/*'
  ], {
    dot: true
  })
  .pipe(dest('dist/fonts'))
  .pipe($.size({title: 'copy fonts'}));
  cb();
});

// Sass compilation
task('styles', (cb) => {
  src('app/styles/*.scss')
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'compressed',
      precision: 6
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano({
      autoprefixer: {browsers: AUTOPREFIXER_BROWSERS, add: true},
      reduceIdents: false
    })))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(dest('dist/styles'))
    .pipe(dest('.tmp/styles'));

  cb();
});

task('styles:dev', (cb) => {
  src('app/styles/*.scss')
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(dest('.tmp/styles'))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(dest('.tmp/styles'))
    .pipe(server.reload({stream: true}));
  cb();
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
task('scripts', (cb) => {
  src(scriptsConfig.ownJs)
    //.pipe($.newer('.tmp/scripts'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(dest('.tmp/scripts'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify({preserveComments: false}))
    // Output files
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest('dist/scripts'))
    .pipe(dest('.tmp/scripts'));
  cb();
});

task('scripts:vendor', (cb) => {
  src(scriptsConfig.vendor)
    //.pipe($.newer('.tmp/scripts'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(dest('.tmp/scripts'))
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify({preserveComments: false}))
    // Output files
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest('dist/scripts'))
    .pipe(dest('.tmp/scripts'));
  cb();
});

// Copy Vendor Script from app/scripts that you want to load separately, not concatenated to main.min.js
task('scripts:vendor-copy', (cb) => {
    src([
        'app/scripts/vendor/lazyload/lazyload.min.js', 
        'app/scripts/vendor/lazyload/lazyload-intersection-observer.min.js'
      ])
      .pipe(dest('dist/scripts'))
      .pipe(dest('.tmp/scripts'));
    cb();
});

// Concatenate minified Barba.js with uglified and minified scripts from dist/main.min.js (created via `scripts` task)
// to fix some of the IE11 issues (minified Barba.js cannot be uglified with the rest of the scripts).
// If you use Barba.js in your project, please run this task in `gulp` build task after the lint, html and scripts tasks
task('scripts-merge-with-barba', (cb) => {
  src(['./node_modules/barba.js/dist/barba.min.js', './dist/scripts/vendor.min.js'])
    .pipe($.concat('vendor.min.js'))
    .pipe(dest('dist/scripts'))
    .pipe(dest('.tmp/scripts'));
  cb();
});

// transpilation only own JS files
task('scripts:dev', (cb) => {
  src(
      scriptsConfig.vendor.concat(scriptsConfig.ownJs),
    )
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest('.tmp/scripts'));
  cb();
});

// scripts just for develop - without minification and concatenation
task('scripts:serve', (cb) => {
  src(scriptsConfig.ownJs)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    // Output files
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest('.tmp/scripts'));
  cb();
});

// Scan your HTML for assets & optimize them
task('html', (cb) => {
  src('app/**/*.html')
    .pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))

    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    // Output files
    .pipe(replace('@BodyJS', ''))
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(dest('dist'));
  cb();
});

// all images/icons/*.svg files into one file
task('svgstore', function (cb) {
  src('app/images/icons/*.svg')
    .pipe(svgmin((file) => {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
            plugins: [{
                cleanupIDs: {
                    prefix: prefix + '-',
                    minify: true
                }
            }]
        }
    }))
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore())
    .pipe(dest('app/images'))
    .pipe(dest('.tmp/images'))
    .pipe(dest('dist/images'));
  cb();
});

// Clean output directory
task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
task('copy-sw-scripts', () => 
  src(['node_modules/sw-toolbox/sw-toolbox.js', 'app/scripts/sw/runtime-caching.js'])
    .pipe(dest('dist/scripts/sw'))
);

task('write-service-worker', (cb) => {
  const rootDir = 'dist';
  const filepath = path.join(rootDir, 'service-worker.js');

  swPrecache.write(filepath, {
    // Used to avoid cache conflicts when serving on localhost.
    cacheId: pkg.name || 'web-starter-kit',
    // sw-toolbox.js needs to be listed first. It sets up methods used in runtime-caching.js.
    importScripts: [
      'scripts/sw/sw-toolbox.js',
      'scripts/sw/runtime-caching.js'
    ],
    staticFileGlobs: [
      // Add/remove glob patterns to match your directory setup.
      `${rootDir}/images/**/*`,
      `${rootDir}/scripts/**/*.js`,
      `${rootDir}/styles/**/*.css`,
      `${rootDir}/*.html`
    ],
    // Translates a static file path to the relative URL that it's served from.
    // This is '/' rather than path.sep because the paths returned from
    // glob always use '/'.
    stripPrefix: rootDir + '/'
  }, cb);
});

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
task('generate-service-worker', series('copy-sw-scripts', 'write-service-worker'));

// Watch files for changes & reload
const watchStyles = () => watch(['app/styles/**/*.{scss,css}'], series('styles:dev'));
const watchTemplates = () => watch(['app/*.html'], series('templates', reload));
const watchScripts = () => watch(['app/scripts/**/*.js', 'app/scripts/**/*.es6'], series('scripts:serve', 'jsLinter', reload));
const watchImages = () => watch(['app/images/**/*', '!app/images/**/*.svg'], series('copyImagesDev', reload));
const watchIcons = () => watch(['app/images/icons/**/*'], series('svgstore', reload));
const watchFonts = () => watch(['app/fonts/**/*'], series('copyFontsDev', reload));

task('watch', parallel(serve, watchStyles, watchTemplates, watchScripts, watchImages, watchIcons, watchFonts));
task('buildForDev', series('styles:dev', 'templates', 'scripts:vendor-copy', 'scripts:dev', 'copyFontsDev', 'copyImagesDev', 'svgstore'));
task('serve', series('buildForDev', 'watch'));

// Build production files, the default task
task('default', series(
  'clean', 
  series(
    'styles',
    'html', 
    'scripts:vendor',
    'scripts',
    'scripts:vendor-copy',
    'images',
    'svgstore',
    'copy',
    'copy-fonts',
    'templates-build',
  ),
  //'scripts-merge-with-barba',
  'generate-service-worker'
));

// Build and serve the output from the dist build
task('serve:dist', parallel('default', (cb) => {
  browserSync({
    open: false,
    notify: false,
    logPrefix: 'BP',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001
  });
  cb();
}));