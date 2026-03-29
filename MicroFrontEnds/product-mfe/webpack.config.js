const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "sysco",
    projectName: "product-mfe",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.(mp4|webm|ogg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/videos/[name].[hash][ext]',
          },
        }
      ],
    },
  });
};
