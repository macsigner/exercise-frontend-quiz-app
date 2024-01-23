import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import PrettyError from 'pretty-error';

const pe = new PrettyError();
pe.skipNodeFiles();
pe.start();

export default {
    mode: 'development',
    entry: './src/js/main.js',
    output: {
        path: path.resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /.html$/i,
                loader: 'html-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('src/pages/index.html'),
        }),
    ]
}
