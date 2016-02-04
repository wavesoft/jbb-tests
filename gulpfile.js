var gulp 		= require('gulp');
var jbb 		= require('gulp-jbb');
var uglify 		= require('gulp-uglifyjs');
var webpack 	= require('webpack-stream');

//
// Paths to the bundle files
//
var bundles 	= [
	'bundles/animated.jbbsrc',
	'bundles/heavy.jbbsrc',
	'bundles/md2.jbbsrc',
	'bundles/vrml.jbbsrc',
];

//
// Compile the binary bundles
//
gulp.task('bundles.compact', function() {
	return gulp
		.src(bundles)
		.pipe(jbb({
			profile: 'three',
			sparse: false
		}))
		.pipe(gulp.dest('build/bundles'));
});
gulp.task('bundles.sparse', function() {
	return gulp
		.src(bundles)
		.pipe(jbb({
			profile: 'three',
			sparse: true
		}))
		.pipe(gulp.dest('build/bundles'));

});
gulp.task('bundles', ['bundles.compact', 'bundles.sparse']);

//
// Compile the sources 
//
gulp.task('script', function() {
	return gulp.src('js/runtests.js')
		.pipe(webpack({
			module: {
				loaders: [
					{ test: /\.json$/, loader: 'json' },
				],
		    },
		    node: {
		    	'fs': 'empty'
		    },
		    output: {
		    	'filename': 'runtests.js'
		    },
		    plugins: [
		    	new webpack.webpack.optimize.DedupePlugin()
		    ]
		}))
		.pipe(uglify("runtests.min.js", { outSourceMap: true }))
		.pipe(gulp.dest('build'));
});

// By default run only script
gulp.task('default', ['script']);

