/* eslint-disable  */
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

class BootloaderPlugin {
  constructor(htmlWebpackPlugin, options) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.options = {
      name: 'bootloader',
      ...options,
    };
  }

  isBootloaderScriptTag(tag, bootloaderFiles) {
    if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
      return true;
    }
    return bootloaderFiles.has(tag.attributes.src);
  }

  isBootloaderStyleTag(tag, bootloaderFiles) {
    if (tag.tagName !== 'link' || !(tag.attributes && tag.attributes.href)) {
      return true;
    }
    return bootloaderFiles.has(tag.attributes.href);
  }

  inlineScriptTag(publicPath, assets, tag) {
    if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
      return tag;
    }
    const scriptName = publicPath
      ? tag.attributes.src.replace(publicPath, '')
      : tag.attributes.src;
    const asset = assets[scriptName];
    if (asset == null) {
      return tag;
    }
    return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
  }

  inlineStyleTag(publicPath, assets, tag) {
    if (tag.tagName !== 'link' || !(tag.attributes && tag.attributes.href)) {
      return tag;
    }
    const scriptName = publicPath
      ? tag.attributes.href.replace(publicPath, '')
      : tag.attributes.href;
    const asset = assets[scriptName];
    if (asset == null) {
      return tag;
    }
    return { tagName: 'style', innerHTML: asset.source(), closeTag: true };
  }

  processHtmlAsset(publicPath, src, assets, excludeFiles, result) {
    const scriptName = publicPath ? src.replace(publicPath, '') : src;
    if (excludeFiles.has(scriptName)) {
      return;
    }
    const asset = assets[scriptName];
    if (!asset) {
      return;
    }
    result.push({
      file: src,
      size: asset.size(),
    });
  }

  apply(compiler) {
    const isProductionLikeMode =
      compiler.options.mode === 'production' || !compiler.options.mode;

    if (!isProductionLikeMode) {
      return;
    }

    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    const htmlAssets = {
      js: [],
      css: [],
    };

    compiler.hooks.entryOption.tap('BootloaderPlugin', (context) => {
      compiler.hooks.make.tapAsync(
        'BootloaderPlugin',
        (compilation, callback) => {
          const entry = SingleEntryPlugin.createDependency(
            this.options.script,
            this.options.name
          );
          compilation.addEntry(context, entry, this.options.name, callback);
        }
      );
    });

    compiler.hooks.thisCompilation.tap('BootloaderPlugin', (compilation) => {
      compilation.hooks.afterOptimizeChunks.tap('BootloaderPlugin', () => {
        const entrypoint = compilation.entrypoints.get(this.options.name);
        if (entrypoint) {
          // create a new chunk for the entire bootloader
          // most likely webpack will return an existing one
          const newChunk = compilation.addChunk(this.options.name);

          for (const chunk of Array.from(entrypoint.chunks)) {
            if (chunk === newChunk) {
              continue;
            }
            // move all modules to new chunk
            for (const module of chunk.getModules()) {
              chunk.moveModule(module, newChunk);
            }
            entrypoint.removeChunk(chunk);
            const index = compilation.chunks.indexOf(chunk);
            if (index > -1) {
              compilation.chunks.splice(index, 1);
            }
            compilation.namedChunks.delete(chunk.name);
          }
          entrypoint.pushChunk(newChunk);
          entrypoint.setRuntimeChunk(newChunk);
        }
      });

      // console.log('wdwadwadawd',this.htmlWebpackPlugin);
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.beforeAssetTagGeneration.tap('BootloaderPlugin', ({ assets }) => {
        // console.log(assets);
        const entrypoint = compilation.entrypoints.get(this.options.name);
        if (entrypoint) {
          const bootloaderFiles = new Set(entrypoint.getFiles());
          assets.js.forEach((src) =>
            this.processHtmlAsset(
              assets.publicPath,
              src,
              compilation.assets,
              bootloaderFiles,
              htmlAssets.js
            )
          );
          assets.css.forEach((src) =>
            this.processHtmlAsset(
              assets.publicPath,
              src,
              compilation.assets,
              bootloaderFiles,
              htmlAssets.css
            )
          );
        }

        const moduleNames = ['helia', 'cyb-cozo-lib-wasm'];

        moduleNames.forEach((moduleName) => {
          Object.keys(compilation.assets).forEach((assetName) => {
            const correctedModuleName = moduleName.replace(/-/g, '_');

            if (assetName.startsWith(correctedModuleName)) {
              // Assuming you have a method to process these assets
              this.processModuleAsset(
                assetName,
                compilation.assets[assetName],
                htmlAssets
              );
            }
          });
        });
      });
      hooks.alterAssetTags.tap('BootloaderPlugin', ({ assetTags }) => {
        const entrypoint = compilation.entrypoints.get(this.options.name);
        if (entrypoint) {
          const bootloaderFiles = new Set(
            entrypoint.getFiles().map((filename) => publicPath + filename)
          );
          assetTags.scripts = assetTags.scripts
            .filter((tag) => this.isBootloaderScriptTag(tag, bootloaderFiles))
            .map((tag) =>
              this.inlineScriptTag(publicPath, compilation.assets, tag)
            );
          assetTags.styles = assetTags.styles
            .filter((tag) => this.isBootloaderStyleTag(tag, bootloaderFiles))
            .map((tag) =>
              this.inlineStyleTag(publicPath, compilation.assets, tag)
            );
          // inject assets
          const assetSource = `!function(){var bootloader={};bootloader.assets=${JSON.stringify(
            htmlAssets
          )};window.$bootloader=bootloader;}();`;
          assetTags.scripts.unshift({
            tagName: 'script',
            innerHTML: assetSource,
            closeTag: true,
          });
          // removing bootloader files from assets so webpack will not emit them
          entrypoint.getFiles().forEach((filename) => {
            // console.log(filename);
            delete compilation.assets[filename];
          });
        }

        const preloadTags = htmlAssets.modules.map((moduleAsset) => {
          return {
            tagName: 'script',
            attributes: {
              src: moduleAsset.file,
              type: 'text/javascript',
            },
          };
        });
        assetTags.scripts = [...preloadTags, ...assetTags.scripts];
      });
    });
  }

  processModuleAsset(assetName, asset, htmlAssets) {
    if (assetName.endsWith('.gz')) {
      // Skip processing this asset
      return;
    }

    // Ensure htmlAssets.modules is initialized
    if (!htmlAssets.modules) {
      htmlAssets.modules = [];
    }

    // Process the module asset and add it to htmlAssets for preloading
    htmlAssets.modules.push({
      file: assetName,
      size: asset.size(),
    });
  }
}

module.exports = BootloaderPlugin;
