const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");

const scss = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");

const html = () => {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("build"));
};

const js = () => {
    return gulp.src("src/js/*")
        .pipe(gulp.dest("build/js"));
};

const copy = () => {
    return gulp.src([
        "src/fonts/**/*.{woff,woff2}",
        "src/css/**",
        "src/img/**",
        "src/js/**",
        "src/*.ico"
    ], {
        base: "src"
    })
    .pipe(gulp.dest("build"));
};

const clean = () => {
    return del("build");
};

const server = () => {
    sync.init({
        server: {
            baseDir: "build"
        },
        cors: true,
        notify: false,
        ui: false,
    });

    gulp.watch("src/*.html", gulp.series(html)).on("change", sync.reload);
    gulp.watch("src/js/*.js", gulp.series(js)).on("change", sync.reload);
    gulp.watch("src/scss/**/*.scss", gulp.series(styles));
};

const styles = () => {
    return gulp.src("src/scss/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(scss())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
};

const build = gulp.series(
    clean,
    copy,
    styles,
    html
);

exports.build = build;

exports.default = gulp.series(styles, server);