"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const postcssImport = require("postcss-import");

const isProduction = EmberApp.env() === "production";
const Funnel = require("broccoli-funnel");

const purgeCSS = {
  module: require("@fullhuman/postcss-purgecss"),
  options: {
    content: [
      // Add extra paths here for components/controllers which include tailwind classes
      "./app/index.html",
      "./app/templates/**/*.hbs"
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
};

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: postcssImport,
            options: {
              path: ["node_modules"]
            }
          },
          require("tailwindcss")("./app/tailwind/config.js"),
          ...(isProduction ? [purgeCSS] : [])
        ]
      }
    },
    fingerprint: {
      exclude: [
        "images/layers-2x.png",
        "images/layers.png",
        "images/marker-icon-2x.png",
        "images/marker-icon.png",
        "images/marker-shadow.png"
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // app.import("node_modules/leaflet/dist/leaflet.css");
  // app.import("node_modules/leaflet/dist/");
  const leaflet = new Funnel("node_modules/leaflet/", {
    srcDir: "/dist",
    include: ["leaflet.js", "leaflet.js.map", "leaflet.css", "images/*.png"],
    destDir: "/assets",
    overwrite: true
  });

  return app.toTree(leaflet);
};
