var gulp = require("gulp");

var minify = require("gulp-minify");
var typescript = require("gulp-typescript");
var devTS = typescript.createProject("tsconfig.json");
var demoTS = typescript.createProject("demo/tsconfig.json");
var testTS = typescript.createProject("test/tsconfig.json");

var merge = require("merge2");

var browsersync = require("browser-sync").create();
var connect = require("gulp-connect");

/*JS*/
gulp.task("demots", function () {
    return demoTS.src()
        .pipe(demoTS())
        .pipe(gulp.dest("demo"));
});

gulp.task("testts", function () {
    return testTS.src()
        .pipe(testTS())
        .pipe(gulp.dest("test"));
});

gulp.task("typescript", function () {
    var tsResult = devTS.src()
        .pipe(devTS());

    return merge([
        tsResult.dts.pipe(gulp.dest("dist")),
        tsResult.js.pipe(gulp.dest("dist"))
    ]);
});

gulp.task("minifyJS", ["typescript"], function () {
    return gulp.src(["dist/**/*.js", "!dist/**/*.min.js"])
        .pipe(minify({
            ext: {
                src: ".js",
                min: ".min.js"
            },
            noSource: true,
            mangle: false
        }))
        .pipe(gulp.dest("dist"));
});

/*BrowserSync*/
gulp.task("browsersync", function () {
    browsersync.init({
        proxy: {
            target: "localhost:15666",
            ws: true
        },
        ui: {
            port: 15668
        },
        port: 15667,
        open: false,
        notify: false
    });
});

gulp.task("server", ["browsersync"], function () {
    connect.server({
        port: 15666
    });

    gulp.watch("demo/**/*.ts", ["demots"]);
    gulp.watch("test/**/*.ts", ["testts"]);
    gulp.watch("dev/**/*.ts", ["typescript"]);

    gulp.watch("demo/**/*.html").on("change", browsersync.reload);
    gulp.watch("dist/**/*.js").on("change", browsersync.reload);
    gulp.watch("demo/**/*.js").on("change", browsersync.reload);
    gulp.watch("test/**/*.js").on("change", browsersync.reload);
});