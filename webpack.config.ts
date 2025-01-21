import path from "path";
import fs from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

interface ManifestObject {
  manifest_version: number;
  name: string;
  version: string;
  description: string;
  action: Object;
  content_scripts: Array<Object>;
}

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
      import: path.resolve(src, "index.tsx"),
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
      template: path.resolve(src, "public/index.html"),
      chunks: ["main"],
    }),
    new WebpackManifestPlugin({
      publicPath: "",
      generate(_seed, files, _entries) {
        const manifest: Partial<ManifestObject> = JSON.parse(
          fs.readFileSync(
            path.resolve(src, "public/manifest.json"),
            "utf-8"
          )
        );
        files.map((e) => {
          const fixName = e.name.replace(".js", "");
          for (const [key, value] of Object.entries(content_injects)) {
            if (key === fixName) {
              value["js"].push(e.path);
              manifest["content_scripts"]?.push(value);
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
