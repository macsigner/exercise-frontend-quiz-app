import HtmlWebpackPlugin from 'html-webpack-plugin';
export default {
    mode: 'development',
    entry: './src/js/main.js',
    module: {
        rules: [
            {
                test: /.html/,
                loader: 'html-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ]
}
