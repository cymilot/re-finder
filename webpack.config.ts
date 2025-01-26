import path from "path";
import fs from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { WebpackManifestPlugin, Manifest } from "webpack-manifest-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const src = path.resolve(__dirname, "src");
const build = path.resolve(__dirname, "build");

const content_injects = {
  content: {
    matches: ["http://*/*", "https://*/*", "file://*/*"],
    js: new Array<string>(),
  },
};

const config: webpack.Configuration = {
  context: __dirname,
  mode: "production",
  entry: {
    main: {
      import: path.resolve(src, "main.tsx"),
    },
    content: {
      import: path.resolve(src, "content.ts"),
    },
  },
  //devtool: "inline-source-map",
  output: {
    filename: "[contenthash].js",
    path: build,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
      // {
      //     test: /\.css$/,
      //     include: path.resolve(__dirname, 'src'),
      //     use: ['style-loader', 'css-loader'],
      // },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "[contenthash]",
          chunks: "all",
        },
      },
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      chunks: ["main"],
    }),
    new WebpackManifestPlugin({
      publicPath: "",
      generate(_seed, files, _entries) {
        const manifest: Manifest = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, "public/manifest.json"),
            "utf-8"
          )
        );
        files.map((e) => {
          const fixName = e.name.replace(".js", "");
          for (const [key, value] of Object.entries(content_injects)) {
            if (key === fixName) {
              value["js"].push(e.path);
              manifest["content_scripts"].push(value);
            }
          }
        });
        return manifest;
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(src, "i18n"),
          to: path.resolve(build, "_locales"),
          transform(content, absolutePath) {
            if (absolutePath.endsWith(".json")) {
              const jsonContent = JSON.parse(content.toString());
              return Buffer.from(JSON.stringify(jsonContent));
            }
            return content;
          },
        },
      ],
    }),
  ],
};

export default config;
