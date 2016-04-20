module.exports = function(grunt) {
  var fs = require('fs');
            

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: [{
            expand: true,
            cwd: 'src/js',
            src: '**/*.js',
            dest: 'dist/js',
            ext: '.min.js'
        }]
      }
    },
    md5: {
      compile: {
        files: {
          'dist/js/': 'dist/js/*.min.js'
        },
        options: {
          encoding: null,
          keepBasename: true,
          keepExtension: true,
          afterEach: function (fileChange, options) {
            // Called once for each file processed by the md5 task.
  
            // fileChange is in following format:
            //
            // {
            //   newPath: '...',
            //   oldPath: '...',
            //   content: '...'
            // }
            //
            // Where newPath is the path with MD5, oldPath is the original path,
            // and content is the file content.
  
            // options is the options object of the task
            // In this case:
            // {encoding: null, keepBasename: true, keepExtension: true, afterEach: function () {...} after: function () {...}}
  
            // The context (value of "this") is set to the context of the task
            // this.nameArgs -> "md5:compile"
            // See more information at http://gruntjs.com/api/inside-tasks
  
          },
          after: function (fileChanges, options) {
            // Called after all of the files are processed by the md5 task.
  
            // fileChanges is an array, holding the same values are the afterEach callback.
            // [{newPath: '...', oldPath: '...', content: '...'}, ...]
  
            // options is the options object of the task
            // In this case:
            // {encoding: null, keepBasename: true, keepExtension: true, afterEach: function () {...} after: function () {...}}
  
            // The context (value of "this") is set to the context of the task
            // this.nameArgs -> "md5:compile"
            // See more information at http://gruntjs.com/api/inside-tasks
            console.log('filechanges:', fileChanges);
            fileChanges.forEach(function(element, index, array){
              var oldPath = element.oldPath,
                  newPath = element.newPath;
              fs.unlink(oldPath);
              var file = fs.readFileSync('src/index.html', 'utf8');
              var replacedData = file.replace(oldPath.replace('dist/', '').replace('.min.js', '.js'), newPath.replace('dist/', ''));
              fs.writeFileSync('dist/index.html', replacedData);
            });
          }
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-md5');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'md5']);

};
