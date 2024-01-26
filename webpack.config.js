import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import PrettyError from 'pretty-error';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const pe = new PrettyError();
pe.skipNodeFiles();
pe.start();

export default {
    mode: 'development',
    entry: './src/js/main.js',
    output: {
        path: path.resolve('dist'),
    },
    devServer: {
        watchFiles: ["src/pages/**/*.html"],
        hot: true,
    },
    module: {
        rules: [
            {
                test: /.html$/i,
                loader: 'html-loader',
            },
            {
                test: /.(s)?css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve('src/pages/index.html'),
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src/pages/demo-index.html'),
            filename: 'demo-index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src/pages/demo-score.html'),
            filename: 'demo-score.html'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src/pages/demo-question.html'),
            filename: 'demo-question.html'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/public',
                    to: path.resolve('dist'),
                }
            ]
        })
    ]
}
