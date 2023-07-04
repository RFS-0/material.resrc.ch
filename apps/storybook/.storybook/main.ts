import {StorybookConfig} from 'storybook-solidjs-vite';

const config: StorybookConfig = {
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    docs: {
        autodocs: "tag",
    },
    framework: {
        name: "storybook-solidjs-vite",
        options: {},
    },
    stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
}

export default config;
