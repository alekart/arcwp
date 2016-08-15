// Generated on 2015-11-16 using generator-angular 0.14.0
'use strict';

// # Globbing

module.exports = function (grunt) {

	// Automatically load required Grunt tasks
	require('jit-grunt')(grunt);

	var paths = {
		dist: 'dist'
	};

	grunt.initConfig({

		watch: {
			compass: {
				files: ['scss/{,**/}*.scss'],
				tasks: ['compass:dev']
			},
			scripts: {
				files: ['scripts/{,**/}*.js'],
				tasks: ['uglify']
			},
			livereload: {
				options: {livereload: false},
				files: ['{,**/}*.css', 'js/*.js']
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				importPath: 'node_modules/bootstrap-sass/assets/stylesheets/',
				sassDir: 'scss',
				cssDir: 'css'
			},
			dev: {
				options: {
				}
			},
			dist: {
				options: {
					force: true,
					environment: 'production',
					outputStyle: 'compressed'
				}
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			files: {
				'js/arcw-popover.min.js': ['scripts/arcw-popover.js']
			}
		},

		uglify: {
			options: {
				mangle: true
			},
			scripts: {
				files: {
					'js/arcw-popover.min.js': ['scripts/arcw-popover.js']
				}
			}
		},

		copy: {
			release: {
				expand: true,
				cwd: '.',
				src: [
					'**',
					'!.sass_cache/**',
					'!bower_components/**',
					'!node_modules/**',
					'!scripts/**',
					'!scss/**',
					'!*.{js,scss,json,md}'
				],
				dest: 'dist/'
			}
		},

		replace: {
			debugDisable: {
				options: {
					patterns: [
						{
							match: /define\( 'ARCW_DEBUG', true \);/g,
							replacement: "define( 'ARCW_DEBUG', false );"
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['dist/archives-calendar.php'], dest: 'dist/'}
				]
			},
			debugRemove: {
				options: {
					patterns: [
						{
							match: /debug[ ]?\(.+\);/g,
							replacement: ""
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['dist/**/*.php'], dest: 'dist/'}
				]
			}
		},


		clean: {
			build: ['dist', 'admin/css']
		}

	});

	grunt.registerTask('default', [
		'compass:dev',
		'uglify',
		'watch'
	]);
	grunt.registerTask('build', [
		'clean',
		'compass:dist',
		'uglify'
	]);

	grunt.registerTask('release', ['build', 'copy:release', 'replace']);
};