const { defineConfig } = require('@vue/cli-service')


/* module.exports = defineConfig({
  transpileDependencies: true
}) */

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // URL del backend
        changeOrigin: true, // Cambia l'origin della richiesta se necessario
      },
    },
  },
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        "__VUE_PROD_HYDRATION_MISMATCH_DETAILS__": JSON.stringify(false), // Aggiungi il flag qui
      }),
    ],
  },
};
