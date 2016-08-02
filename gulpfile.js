/**
 * Created by KyrLouca on 20/7/2016.
 */
var gulp      = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper   = require('gulp-crisper');
var del       = require('del');
var babel     = require('gulp-babel');
var uglify    = require('gulp-uglify');
var filter    = require('gulp-filter');
var rename    = require('gulp-rename');


gulp.task('vulcan', function () {
    "use strict";
    return gulp.src('src/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            stripComments: true,
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('split', function () {
    "use strict";
    return gulp.src('dist/index.html')
        .pipe(crisper({
            scriptInHead: true, // true is default
            onlySplit: false
        }))
        .pipe(gulp.dest('dist/split'));
});


gulp.task('babel', function () {
    return gulp.src('dist/split/index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/split'));
});
gulp.task('default', ['vulcanAll']);

gulp.task('uglify', function () {
    gulp.src('src/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    "use strict";
    del(['dist/**/*.js','dist/**/*.html']);
});


gulp.task('filter', function () {
    "use strict";
    var filterJs = filter(['**/m*.js']);
    gulp.src('src/**/*.*')
        .pipe(filterJs)
        .pipe(uglify())
        .pipe(gulp.dest('dist/ta'));
});

gulp.task('prep1', function () {
    "use strict";
    var filterJs = filter(['**/*.js'], {restore: true});
    gulp.src("src/index.html")
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            stripComments: true,
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(rename(function (path) {
            path.basename = "indexGbb";
        }))
        .pipe(crisper({
            scriptInHead: false, // true is default
            onlySplit: false
        }))
        .pipe(filterJs)
        .pipe(babel({presets: ['es2015']}))
        //.pipe(uglify())
        .pipe(filterJs.restore)
        .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/hello-goodbye.md
});
