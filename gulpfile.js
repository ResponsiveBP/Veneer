// Include gulp
var gulp = require("gulp");

// Install tools and plugins.
var es = require("event-stream"),
    del = require("del"),
    path = require("path"),
    plugins = require("gulp-load-plugins")();

// Set paths
var basePath = {
    src: "./src/",
    build: "./build/",
    dist: "./dist/"
},
	path = {
	    sass: {
	        src: basePath.src + "sass/",
	        build: basePath.build
	    },
	    js: {
	        src: basePath.src + "js/",
	        build: basePath.build
	    }
	};

var sassSrc = path.sass.src + "veneer.scss";

// Concatenate & Minify SCSS
gulp.task("sass", function (cb) {
    gulp.src(sassSrc)
        .pipe(plugins.rubySass({ unixNewlines: true, precision: 4, noCache: true }))
        .pipe(plugins.autoprefixer("last 2 version", "> 1%", "ie 8", { cascade: true }))
        .pipe(gulp.dest(path.sass.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(path.sass.build))
        .on("end", cb);
});

gulp.task("clean", ["sass"], function (cb) {
    del("./dist/veneer.zip", cb);
});

gulp.task("zip", ["clean"], function (cb) {
    gulp.src(basePath.build + "**/*")
        .pipe(plugins.zip("veneer.zip"))
        .pipe(gulp.dest(basePath.dist))
        .on("end", cb);
});

gulp.task("watch", function () {
    // Watch for changes to our SASS
    gulp.watch(path.sass.src + "**/*.scss", ["sass"]);

});

gulp.task("release", ["zip"]);

// Default Task
gulp.task("default", ["sass"]);