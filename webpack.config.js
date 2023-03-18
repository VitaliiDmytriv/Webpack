const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const mode =
    process.env.NODE_ENV === "production" ? "production" : "development";
const isDev = mode === "development" ? true : false;

const cssLoader = isDev ? "style-loader" : MiniCssExtractPlugin.loader;

console.log(mode);

module.exports = {
    mode: mode,
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
    },

    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devServer: {
        static: path.join(__dirname, "src"),
        hot: true,
        port: 9000,
    },
    devtool: "source-map",
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new HTMLWebpackPlugin({
            template: "./src/index.html",
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    // cssLoader,
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: ["postcss-preset-env"],
                            },
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[hash][ext][query]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "font/[hash][ext][query]",
                },
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                        ],
                    },
                },
            },
        ],
    },
};
