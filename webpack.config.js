const path = require('path');

function isRelativeToWidget(module, widgetName, chunkGraph, moduleGraph,) {
  console.log('module identifier', module.identifier());
  if (module.identifier().includes(widgetName)) return true;

  // webpack5开始使用chunkGraph和moduleGraph，webpack4使用module.issuer
  // if (module.issuer) return isRelativeToWidget(module.issuer, widgetName)
  const issuer = moduleGraph.getIssuer(module)
  if (issuer) {
    console.log('issuer', issuer.identifier());
    if (issuer.identifier().includes(widgetName)) {
      return true
    }
    return isRelativeToWidget(issuer, widgetName, chunkGraph, moduleGraph,)
  }
  return false
}

function getSplitChunksRuleForWidget(widgetName) {
    return {
        test: (module, {chunkGraph, moduleGraph}) => isRelativeToWidget(module, widgetName, chunkGraph, moduleGraph,),
        name: widgetName,
        chunks: 'async',
        enforce: true,
    }
}

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: '[name].[chunkhash:5].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: false,
        default: false,
        a: getSplitChunksRuleForWidget('module-a'),
        b: getSplitChunksRuleForWidget('module-b'),
        c: getSplitChunksRuleForWidget('module-c'),
      }
    },
    minimize: false
  }
};