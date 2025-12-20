const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// node_modules içindeki gereksiz şeyleri izleme
config.watchFolders = [];

// macOS için watcher ayarı
config.resolver.blockList = [
  /.*\/node_modules\/.*\/\.git\/.*/
];

module.exports = config;
