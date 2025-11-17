module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: (postcssLoaderOptions) => {
        postcssLoaderOptions.postcssOptions = {
          plugins: [
            require('@tailwindcss/postcss'),
            require('autoprefixer'),
          ],
        };
        return postcssLoaderOptions;
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Ensure CSS is processed correctly
      const cssRule = webpackConfig.module.rules.find(
        rule => rule.oneOf
      );
      
      if (cssRule) {
        cssRule.oneOf.forEach(rule => {
          if (rule.test && rule.test.toString().includes('css')) {
            rule.use = rule.use || [];
            if (Array.isArray(rule.use)) {
              rule.use.forEach(loader => {
                if (loader.loader && loader.loader.includes('postcss-loader')) {
                  loader.options = loader.options || {};
                  loader.options.postcssOptions = {
                    plugins: [
                      require('@tailwindcss/postcss'),
                      require('autoprefixer'),
                    ],
                  };
                }
              });
            }
          }
        });
      }
      
      return webpackConfig;
    },
  },
}