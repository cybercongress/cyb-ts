class BundleInfoPlugin {
  constructor(options) {
    // you can define options if needed
    this.options = options || {};
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'BundleInfoPlugin',
      (compilation, callback) => {
        let result = {};

        for (let filename in compilation.assets) {
          let size = compilation.assets[filename].size();
          result[filename] = size;
        }

        // Convert the result object to JSON format
        let jsonResult = JSON.stringify(result, null, 2);

        // Add the JSON to the compilation's assets for output
        compilation.assets['bundle_info.json'] = {
          source: function () {
            return jsonResult;
          },
          size: function () {
            return jsonResult.length;
          },
        };

        // Continue with the build process
        callback();
      }
    );
  }
}

module.exports = BundleInfoPlugin;
