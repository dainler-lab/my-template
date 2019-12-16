/*  Start Gulp Modules - Adiciona os modulos instalados */
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
//const rsync = require('gulp-rsync');
const fileinclude = require('gulp-file-include');
//const plumber = require('gulp-plumber');

/* Functions+Gulp */

/* Function
+ browserSync: iniciar o browser
+ gulp.task: criar tarefa gulp para function synchronizeBrowser */

function browser() {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });
}
gulp.task('browser-sync', browser);

/* Function
+ sass: compilar o SASS em CSS e comprimir 
+ autoprefixer: criar css para browsers antigos
+ browserSync: injetar css na página no DEV
+ gulp.task: criar tarefa gulp para function compileSASS */

function compileSASS () {
	return gulp
		.src('src/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('public/css/'))
		.pipe(browserSync.stream());
}
gulp.task('compileSASS', compileSASS);


/* Function
+ sass: compilar o SASS em CSS e comprimir 
+ autoprefixer: criar css para browsers antigos
+ browserSync: injetar css na página no DEV
+ gulp.task: criar tarefa gulp para function compileSASS */

function findluginsCSS () {
	return gulp
		.src('node_modules/')		
		.pipe(gulp.dest('scss/css/'))
}
gulp.task('findluginsCSS', findluginsCSS);

/* Function
+ concat: agrupar todo js em main.mim.js
+ babel: criar sintaxe js para browsers antigos
+ uglify: comprimir todo js 
+ dest: salvar no destino do caminho
+ browserSync: injetar js na página no DEV
+ gulp.task: criar tarefa gulp para function compileJS */

function compileJS () {
	return gulp
		.src('src/js/**/*.js')
		.pipe(concat('main.min.js'))
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('public/js/'))
		.pipe(browserSync.stream());
}
gulp.task('compileJS', compileJS);

/* Function
+ concat: agrupar todo js em plugins.mim.js
+ uglify: comprimir todo js
+ dest: salvar no destino do caminho
+ browserSync: injetar js na página no DEV
+ gulp.task: criar tarefa gulp para function compilePlugins */

function compilePlugins () {
	return gulp
		.src([
			'node_modules/jquery/**/jquery.slim.min.js',
			'node_modules/bootstrap/**/bootstrap.bundle.js',			
			'plugins/**/*.js'
		])
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js/'))
		.pipe(browserSync.stream());
}
gulp.task('compilePlugins', compilePlugins);

/* Function
+ fileinclude: cria o include html e add no outro arquivo html desejado
ex -> @@include('./includes/header.html')
+ gulp.task: criar tarefa gulp para function fileinclude */

function compileHTML (done) {
	gulp.src([
		'./src/**/index.html',
		'./src/**/database.html'
	])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./public/'));
	done();
}
gulp.task('compileHTML', compileHTML);

/* Function
+ watch: vigiar e observar todos arquivos: html, php, sass e js e chama o 
+ browserSync: refresh do browser
+ gulp.task: criar tarefa gulp para function superviseFile */

function superviseFile () {
  gulp.watch('src/scss/**/*.scss', compileSASS);
  gulp.watch('src/js/**/*.js', compileJS);
	gulp.watch('src/plugins/**/*.js', compilePlugins);
	
  gulp.watch('src/**/*.html', compileHTML).on('change', browserSync.reload);
	
  gulp.watch('public/**/*.html').on('change', browserSync.reload);
}
gulp.task('superviseFile', superviseFile);

/* Function
+ gulp.task: criar tarefa padrão gulp e 
paralelamente chama as tarefas criadas */

gulp.task('default',
	gulp.parallel(
		'superviseFile',
		'browser-sync',
		'compileSASS',
		'compileJS',
		'compilePlugins',
		'compileHTML'
	)
);


/* // Deploy
gulp.task('deploy', function() {
	gulp.src('./')
	.pipe(rsync({
		exclude: [
			'.git*',
			'node_modules',
			'.sass-cache',
			'gulpfile.js',
			'package.json',
			'.DS_Store',
			'README.md',
			'.jshintrc',
			'*.sublime-workspace',
			'*.sublime-project'
		],
		root: './',
		hostname: 'user@host',
		destination: 'dest/',
		recursive: true,
		clean: true,
		progress: true
	}));
}); */
