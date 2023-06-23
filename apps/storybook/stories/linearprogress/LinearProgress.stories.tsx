import type {Meta, StoryObj} from 'storybook-solidjs';
import {LinearProgress} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof LinearProgress> = {
    title: 'Design System/Components/LinearProgress',
    component: LinearProgress,
};

export default meta;
type Story = StoryObj<typeof LinearProgress>;

export const Standalone: Story = {
    args: {
        progress: 0.5,
    },
    render: (args) => {

        return (
            < LinearProgress
                data-testid="linear-progress"
                {...args}
            />
        )
    }
};

export const Indeterminate: Story = {
    args: {
        indeterminate: true,
    },
    render: (args) => {

        return (
            < LinearProgress
                data-testid="linear-progress"
                {...args}
            />
        )
    }
};

export const WithBuffer: Story = {
    args: {
        indeterminate: false,
        progress: 0.1,
        buffer: 0.1,
    },
    render: (args) => {

        return (
            < LinearProgress
                data-testid="linear-progress"
                {...args}
            />
        )
    }
};

export const FourColor: Story = {
    args: {
        indeterminate: true,
        fourColor: true,
    },
    render: (args) => {

        return (
            < LinearProgress
                data-testid="linear-progress"
                {...args}
            />
        )
    }
};
