const _PROJECTNAME = 'dbarjs';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	print = require('gulp-print'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	concatCSS = require('gulp-concat-css'),
	//cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imageResize = require('gulp-image-resize'),
	tinypng = require('gulp-tinypng'),

	browserSync = require('browser-sync').create();

/*
 * To use the gulp-image-resize, it needs of some dependencies:
 * https://www.npmjs.com/package/gulp-image-resize
 *
 * Or, install:
 *
 * Ubuntu:
 * apt-get install imagemagick
 * apt-get install graphicsmagick
 *
 * Mac:
 * brew install imagemagick
 * brew install graphicsmagick
 *
 * Windows & others:
 * http://www.imagemagick.org/script/binary-releases.php
 * */

const tinypngToken = 'c8yyMiCZDZU7wE4SWDTxiKdNcEq7krZU';

// Source Content structure

var source = {
	content: '*',
	location: './_src/'
};

source.css = {
	content: '**/*.css',
	location: source.location + 'css/'
};

source.js = {
	content: '*.js',
	location: source.location + 'js/'
};

source.index = {
	content: '**/*.html',
	location: source.location
};

source.images = {
	content: '*.*',
	location: source.location + 'img/'
};

source.images.photos = {
	content: 'photo-*.*',
	location: source.images.location
};

source.images.largePhotos = {
	content: '*.*',
	location: source.images.location + 'largePhotos/'
};

// Public Content structure

var public = {
	location: './'
};

// Dist Content structure

var dist = {
	content: '*',
	location: public.location + 'dist/'
};

dist.css = {
	content: '*.css',
	location: dist.location + 'css/'
};

dist.js = {
	content: '*.js',
	location: dist.location + 'js/'
};

dist.images = {
	content: '*',
	location: dist.location + 'img/'
};

// CSS

gulp.task('css', function() {
	gulp.src(source.css.location + source.css.content)
		.pipe(concatCSS(_PROJECTNAME + '.css'))
		.pipe(gulp.dest(dist.css.location))
		.pipe(plumber())
		//.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(dist.css.location));
});

gulp.task('css-watch', ['css'], function () {
	watch(source.css.location + source.css.content, batch(function (events, done) {
		gulp.start('css', done);
		browserSync.reload();
	}));
});

// JS

gulp.task('js', function() {
	gulp.src(source.js.location + source.js.content)
		.pipe(concat(_PROJECTNAME + '.js'))
		.pipe(gulp.dest(dist.js.location))
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(dist.js.location));
});

gulp.task('js-watch', ['js'], function () {
	watch(source.js.location + source.js.content, batch(function (events, done) {
		gulp.start('js', done);
		browserSync.reload();
	}));
});

// IMAGES

gulp.task('resizePhotos', function () {
	gulp.src(source.images.photos.location + source.images.photos.content)
		.pipe(imageResize({
			width : 1080,
			upscale : false
		}))
		.pipe(gulp.dest(dist.images.location));
});

gulp.task('tinySource', function () {
	if (tinypngToken)
		gulp.src(source.images.location + source.images.content)
			.pipe(tinypng(tinypngToken))
			.pipe(gulp.dest(source.images.location));
	else
		console.log('TinyPNG Token Required');
});

// SERVER

gulp.task('serve', function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./",
			index: "index.html",
			routes: {
				"/home": "./index.html"
			}
		}
	});

	gulp.watch(source.index.content).on('change', browserSync.reload);

});

gulp.task('default', ['serve', 'css-watch', 'js-watch']);