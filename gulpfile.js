var gulp = require("gulp");

var merge = require("merge2");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var minify = require("gulp-minify");
var watch = require("gulp-watch");
var tslint = require("gulp-tslint");
var eslint = require("gulp-eslint");

var jasmine = require("gulp-jasmine");
var jasmineBrowser = require("gulp-jasmine-browser");

var typescript = require("gulp-typescript");
var devTS = typescript.createProject("tsconfig.json");
var demoTS = typescript.createProject("demo/tsconfig.json");
var testTS = typescript.createProject("test/tsconfig.json");

var browsersync = require("browser-sync").create();
var connect = require("gulp-connect");

var typedoc = require("gulp-typedoc");

/*JS*/
gulp.task("demots", function () {
    return demoTS.src()
        .pipe(demoTS())
        .pipe(gulp.dest("demo"));
});

gulp.task("typescript", function () {
    gulp.start("tslint");

    return devTS.src()
        .pipe(sourcemaps.init())
        .pipe(devTS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
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

gulp.task("eslint", function(){
    return gulp.src(["dist/**/*.js", "!dist/**/*.min.js"])
        .pipe(eslint({
            configFile: ".eslintrc.json"
        }))
        .pipe(eslint.format("stylish"))
        .pipe(eslint.failAfterError());
});

gulp.task("lint", ["tslint", "eslint"], function(){

});

gulp.task("test", ["lint", "unittests"], function(){

});

gulp.task("testserver", function(){
    return gulp.src(testFiles)
        .pipe(watch(testFiles))
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: 15665}));
});

/*Doc*/
gulp.task("typedoc", function(){
    return gulp.src(["dev/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs",
            name: "Linq4JS",
            theme: "minimal"
        }));
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

    gulp.watch("test/**/*.ts", ["test"]);
    gulp.watch("demo/**/*.ts", ["demots"]);
    gulp.watch("dev/**/*.ts", ["typescript"]);

    gulp.watch("demo/**/*.html").on("change", browsersync.reload);
    gulp.watch("dist/**/*.js", ["eslint"]).on("change", browsersync.reload);
    gulp.watch("demo/**/*.js").on("change", browsersync.reload);
});

gulp.task("edit", function(){
    gulp.watch("test/**/*.ts", ["test"]);
    gulp.watch("dev/**/*.ts", ["typescript"]);
    gulp.watch("dist/**/*.js", ["eslint"]);
    gulp.watch("tslint.json", ["tslint"]);
    gulp.watch(".eslintrc.json", ["eslint"]);
});