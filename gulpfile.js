var gulp = require("gulp");

var merge = require("merge2");
var concat = require("gulp-concat");
var minify = require("gulp-minify");
var tslint = require("gulp-tslint");
var watch = require("gulp-watch");

var jasmine = require("gulp-jasmine");
var jasmineBrowser = require("gulp-jasmine-browser");

var typescript = require("gulp-typescript");
var devTS = typescript.createProject("tsconfig.json");
var demoTS = typescript.createProject("demo/tsconfig.json");
var testTS = typescript.createProject("test/tsconfig.json");

var browsersync = require("browser-sync").create();
var connect = require("gulp-connect");

/*JS*/
gulp.task("demots", function () {
    return demoTS.src()
        .pipe(demoTS())
        .pipe(gulp.dest("demo"));
});

gulp.task("typescript", function () {
    var tsResult = devTS.src()
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false,
            summarizeFailureOutput: true
        }))
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

/*Test*/
gulp.task("testts", function(){
    return testTS.src()
        .pipe(testTS())
        .pipe(gulp.dest("test"));
});

var testFiles = [
    "dist/linq4js.js", 
    "test/test.js"
];

gulp.task("unittests", ["testts"], function(){
    return gulp.src(testFiles)
        .pipe(concat("all.js"))
        .pipe(gulp.dest("test"))
        .pipe(jasmine({
            verbose: true
        }));
});

gulp.task("tslint", function(){
    return devTS.src()
        .pipe(tslint({
            formatter: "stylish"
        }))
        .pipe(tslint.report({
            emitError: true,
            summarizeFailureOutput: true
        }));
});

gulp.task("lint", ["tslint"], function(){

});

gulp.task("test", ["lint", "unittests"], function(){

});

gulp.task("testserver", function(){
    return gulp.src(testFiles)
        .pipe(watch(testFiles))
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: 15665}));
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
    gulp.watch("test/**/*.ts", ["test"]);
    gulp.watch("dev/**/*.ts", ["typescript"]);

    gulp.watch("demo/**/*.html").on("change", browsersync.reload);
    gulp.watch("dist/**/*.js").on("change", browsersync.reload);
    gulp.watch("demo/**/*.js").on("change", browsersync.reload);
});