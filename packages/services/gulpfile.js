const {src,dest,parallel,watch,series} = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.app.json");
const shell = require('gulp-shell');
const nodemon = require('gulp-nodemon');

function buildTs () {
  return src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(dest('./dist'));
}

function start (done) {
  nodemon({
    exec: 'inspirecloud dev',
    ext: 'js,ts',
    ignore: './dist',
    delay: 50,
    tasks: ['buildTs'],
    done
  })
}

function watchServe () {
  return watch('src/**/*.ts', {
    delay: 100
  }, series(buildTs))
}

function serve () {
  return series(buildTs, start)()
}

function deploy () {
  return series(buildTs, shell.task('inspirecloud deploy'))()
}

module.exports = {serve,deploy,buildTs}
