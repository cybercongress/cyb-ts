import type { StorybookConfig } from '@storybook/react-webpack5';
import webpackConfig from '../webpack.config.common';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-designs',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          implementation: require('sass'),
        },
      },
    },
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   src: path.resolve(__dirname, '../src/'),
    //   images: path.resolve(__dirname, '../src/image'),
    // };

    return {
      ...config,

      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          ...webpackConfig.resolve.alias,
        },
      },
      module: {
        rules: [
          ...(config.module?.rules || []),
          ...webpackConfig.module.rules.filter(
            (rule) => !['.cozo'].includes(rule.test.toString())
          ),
        ],
      },
      plugins: [
        ...webpackConfig.plugins.filter((plugin) =>
          ['NodePolyfillPlugin', 'NormalModuleReplacementPlugin'].includes(
            plugin.constructor.name
          )
        ),
        ...config.plugins,
      ],
    };
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
