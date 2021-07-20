// Gulp.js configuration

const // modules
    gulp = require("gulp"),
    // development mode?
    devBuild = process.env.NODE_ENV !== "production",
    sourcemaps = require("gulp-sourcemaps"),
    sass = require("gulp-sass"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    postcss = require("gulp-postcss"),
    purgecss = require("@fullhuman/postcss-purgecss"),
    rollup = require("gulp-better-rollup"),
    uglify = require("gulp-uglify"),
    browserSync = require("browser-sync").create(),
    imagemin = require('gulp-imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    imageResize = require('gulp-image-resize'),
    rename = require('gulp-rename'),

    // Environment (mamp, valet or static)
    localEnv = "static",
    // If valet, username:
    userName = "Nikita",
    // If valet, site name:
    siteName = "html-boilerplate",

    // Folders
    src = "assets/src/",
    build = "assets/prod/";


function imagesResponsive() {

    const sizes = [
        { width: 320, quality: 60, suffix: 'small' },
        { width: 480, quality: 70, suffix: 'medium' },
        { width: 800, quality: 80, suffix: 'large' },
        { width: 1200, quality: 80, suffix: 'extra-large' },
        { width: 2000, quality: 80, suffix: 'cover' }
    ];

    let stream;
    sizes.forEach((size) => {
        stream = gulp
            .src(src + "images/**/*")
            .pipe(imageResize({ width: size.width, upscale: false }))
            .pipe(
                rename((path) => {
                    path.basename += `-${size.suffix}`;
                }),
            )
            .pipe(
                imagemin(
                    [
                        imageminMozjpeg({
                            quality: size.quality,
                        }),
                    ],
                    {
                        verbose: true,
                    },
                ),
            )
            .pipe(gulp.dest(build + "images/"));
    });
    return stream;
}
exports.imagesResponsive = imagesResponsive;

// JavaScript processing
function js() {
    return gulp
        .src([src + "js/main.js"])
        .pipe(sourcemaps.init())
        .pipe(
            rollup(
                {
                    onwarn: function(message) {
                        if (/external dependency/.test(message)) return;
                    }
                },
                "es"
            )
        )
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(build + "js/"))
        .pipe(browserSync.reload({ stream: true }));
}
exports.js = js;

// CSS processing
function css() {
    return gulp
        .src(src + "scss/main.scss", { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: "nested",
                imagePath: "/images/",
                precision: 3,
                errLogToConsole: true
            }).on("error", sass.logError)
        )
        .pipe(
            postcss([
                purgecss({ content: ["**/*.html", "**/*.php"] }),
                autoprefixer(),
                cssnano
            ])
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(build + "css/"))
        .pipe(browserSync.reload({ stream: true }));
}
exports.css = css;

// html processing
function html() {
    return gulp
        .src(["**/*.html", "**/*.php", "!**/node_modules/**", "!**/vendor/**"])
        .pipe(browserSync.reload({ stream: true }));
}
exports.html = html;

// production build for CSS
function prodCSS() {
    return gulp
        .src(src + "scss/main.scss", { allowEmpty: true })
        .pipe(
            sass({
                outputStyle: "nested",
                imagePath: "/images/",
                precision: 3,
                errLogToConsole: true
            }).on("error", sass.logError)
        )
        .pipe(
            postcss([
                purgecss({ content: ["**/*.html", "**/*.php"] }),
                autoprefixer()
            ])
        )
        .pipe(gulp.dest(build + "css/"));
}
// production build for JS
function prodJS() {
    return gulp
        .src([src + "js/main.js"])
        .pipe(
            rollup(
                {
                    onwarn: function(message) {
                        if (/external dependency/.test(message)) return;
                    }
                },
                "es"
            )
        )
        .pipe(uglify())
        .pipe(gulp.dest(build + "js/"));
}
exports.prod = gulp.series(prodCSS, prodJS, imagesResponsive);

// watch for file changes
function watch(done) {

    if (localEnv === "valet") {
        browserSync.init({
            tunnel: false,
            proxy: "https://" + siteName + ".test",
            host: siteName + ".test",
            open: "external",
            https: {
                key:
                    "/Users/" +
                    userName +
                    "/.config/valet/Certificates/" +
                    siteName +
                    ".test.key",
                cert:
                    "/Users/" +
                    userName +
                    "/.config/valet/Certificates/" +
                    siteName +
                    ".test.crt"
            }
        });
    } else {
        browserSync.init({
            server: {
                baseDir: "./"
            },
            // proxy: {
            //     target: 'http://website.local'
            // },
            tunnel: false
        });
    }

    // html changes
    gulp.watch(["**/*.html", "**/*.php", "!**/node_modules/**", "!**/vendor/**"], gulp.series(exports.html, exports.css));

    // image changes
    gulp.watch(src + "images/**/*", imagesResponsive);

    // css changes
    gulp.watch(src + "scss/**/*", css);

    // js changes
    gulp.watch(src + "js/**/*", js);

    done();
}
exports.watch = watch;

// run all tasks
exports.build = gulp.parallel(exports.css, exports.js, exports.imagesResponsive);

// default task
exports.default = gulp.series(exports.build, exports.watch);