import {merge} from 'webpack-merge';
import config from './webpack.config.js';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

export default merge(config, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
    ]
})
