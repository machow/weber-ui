gulp = require 'gulp'
shell = require 'gulp-shell'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'
mainBowerFiles = require 'main-bower-files'
ng_templateCache = require 'gulp-angular-templatecache'
bower = require 'gulp-bower'
del = require 'del'

paths = 
    css: ['bower_components/jsoneditor/dist/jsoneditor.css', 
          'bower_components/angular-ui-grid/ui-grid.css', 
          'src/**/*.css']
          #'src/fix-jsoneditor.css']
    ui_grid_assets: [
        'bower_components/angular-ui-grid/ui-grid.woff',
        'bower_components/angular-ui-grid/ui-grid.ttf'
    ]
    json_editor_assets: 'bower_components/jsoneditor/dist/img/jsoneditor-icons.png'
    templates: ['src/mini/*.html', 'src/timeline/*.html']

gulp.task 'bower-install', () ->
    bower()

gulp.task 'clean', ['bower-install'], (cb) ->
    del('dist/*', cb)

# Copy build files to dist/js -----------------------------
gulp.task 'bower', ['clean', 'bower-manual-copy', 'bower-manual-jsoneditor', 'ng-templates'], () ->
    gulp.src(mainBowerFiles())
        .pipe(gulp.dest('dist/js'))

gulp.task 'bower-manual-copy', ['clean'], () ->
    gulp.src(['bower_components/angular/angular.min.js', 
              'bower_components/ace-builds/src-min-noconflict/ace.js',
              'bower_components/angular-ui-grid/ui-grid.min.js'])
        .pipe(gulp.dest('dist/js'))

gulp.task 'bower-manual-jsoneditor', ['clean'], () ->
    # build jsoneditor without ace, then make it the main file
    gulp.src('')
        .pipe(shell([
            'npm install',
            'browserify ./index.js -o ./jsoneditor.custom.js -s JSONEditor -x brace -x brace/mode/json -x brace/ext/searchbox',
            'uglifyjs ./jsoneditor.custom.js -o ./dist/jsoneditor.min.js -m -c',
            'browserify ./src/js/ace/index.js -o jsoneditor-ace.js',
            'uglifyjs ./jsoneditor-ace.js -o ../../dist/js/jsoneditor-ace.js -m -c'
        ], cwd: 'bower_components/jsoneditor'))


# compile angular templates into single js file (templates.js)
gulp.task 'ng-templates', ['clean'], () ->
    gulp.src(paths.templates)
        .pipe(ng_templateCache({'templates.js', standalone: true}))
        .pipe(gulp.dest('dist/js'))

# copy CSS
gulp.task 'css', ['clean'], () ->
    gulp.src(paths.css)
        .pipe(sourcemaps.init())
            .pipe(concat('weber-ui.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))

gulp.task 'cssassets', ['clean'], () ->
    gulp.src(paths.ui_grid_assets)
        .pipe(gulp.dest('dist'))

    gulp.src('bower_components/jsoneditor/dist/*/*.png')
        .pipe(gulp.dest('dist'))

# Build weber-ui.js and weber-ui.css -------------
#
gulp.task 'package', ['clean', 'ng-templates', 'bower'], () ->
    gulp.src('')
        .pipe(shell(['r.js -o build.js']))

gulp.task('build' , ['package', 'css', 'cssassets'])

gulp.task('build-nocompile', ['ng-templates', 'css', 'cssassets'])

gulp.task('default', ['build'])


# TODO this is broken
# should use requirejs, then require libraries for tests in test scripts
gulp.task 'test', () ->
    gulp.src(paths.tests)
        .pipe(jasmine())
