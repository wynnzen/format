module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/format/" : "/",
  configureWebpack: {
    devtool: "source-map",
  },
};
