import type {Meta, StoryObj} from 'storybook-solidjs';
import {CircularProgress} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof CircularProgress> = {
    title: 'Design System/Components/CircularProgress',
    component: CircularProgress,
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Standalone: Story = {
    args: {
        progress: 0.5,
    },
    render: (args) => <CircularProgress
        data-testid="circularProgress"
        {...args}
    />
};

export const Indeterminate: Story = {
    args: {
        indeterminate: true,
        progress: 0.75,
    },
    render: (args) => <CircularProgress
        data-testid="circularProgress"
        {...args}
    />
};

export const IndeterminateWithFourColor: Story = {
    args: {
        indeterminate: true,
        fourColor: true,
    },
    render: (args) => <CircularProgress
        data-testid="circularProgress"
        {...args}
    />
};
