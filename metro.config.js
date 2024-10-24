const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
    resolver: {
      assetExts: [getDefaultConfig(__dirname).resolver.assetExts, 'jpg', 'png'],
      sourceExts: [getDefaultConfig(__dirname).resolver.sourceExts, 'js', 'json', 'ts', 'tsx', 'jsx'],
    },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
