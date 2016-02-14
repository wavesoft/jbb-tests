var gulp 		= require('gulp');
var jbb 		= require('gulp-jbb');
var uglify 		= require('gulp-uglifyjs');
var webpack 	= require('webpack-stream');

/**
 * Log flags
 */
var LOG = {
	PRM: 	0x0001, // Primitive messages
	ARR: 	0x0002, // Array messages
	CHU: 	0x0004, // Array Chunk
	STR: 	0x0008, // String buffer
	IREF: 	0x0010, // Internal reference
	XREF: 	0x0020, // External reference
	OBJ: 	0x0040, // Object messages
	EMB: 	0x0080, // Embedded resource
	PLO: 	0x0100, // Simple objects
	BULK: 	0x0200, // Bulk-encoded objects
	SUMM: 	0x2000,	// Log summary
	WRT: 	0x4000, // Debug writes
	PDBG: 	0x8000, // Protocol debug messages
};

//
// Paths to the bundle files
//
var bundles = [
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

// By default build bundles
gulp.task('default', ['bundles.compact', 'bundles.sparse' ]);
