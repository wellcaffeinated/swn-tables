module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/swn-tables/'
    : '/'
  , configureWebpack: {
    resolve: { symlinks: false }
    , node: {
      __dirname: true
    }
    , plugins: [

    ]
    , output: {
      globalObject: 'this'
    }
    , module: {
      rules: [
        //   , {
        //     test: /\.js$/
        //     , use: [
        //       'comlink-loader'
        //     ]
        //     , include: [ path.resolve(__dirname, 'src/workers') ]
        //   }
      ]
    }
  }
  , css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        prependData: "@import '@/styles/_variables'"
      }
    }
  }
}
