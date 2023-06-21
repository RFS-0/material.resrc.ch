import type {Meta, StoryObj} from 'storybook-solidjs';
import {Divider} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Divider> = {
    title: 'Design System/Components/Divider',
    component: Divider,
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Standalone: Story = {
    args: {
        inset: false,
        insetEnd: false,
        insetStart: false,
    },
    render: (args) => <Divider
        data-testid="divider"
        {...args}
    />
};

export const Inset: Story = {
    args: {
        inset: true,
        insetEnd: false,
        insetStart: false,
    },
    render: (args) => <Divider
        data-testid="divider"
        {...args}
    />
};

export const InsetEnd: Story = {
    args: {
        inset: false,
        insetEnd: true,
        insetStart: false,
    },
    render: (args) => <Divider
        data-testid="divider"
        {...args}
    />
};

export const InsetStart: Story = {
    args: {
        inset: false,
        insetEnd: false,
        insetStart: true,
    },
    render: (args) => <Divider
        data-testid="divider"
        {...args}
    />
};
