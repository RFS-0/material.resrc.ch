import type {Meta, StoryObj} from 'storybook-solidjs';
import {Checkbox} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Checkbox> = {
    title: 'Design System/Atoms/Checkbox',
    component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Standalone: Story = {
    render: () => <Checkbox
        data-testid="checkbox"
    />,
};

export const Checked: Story = {
    render: () => <Checkbox
        data-testid="checkbox"
        checked
    />,
};

export const Indeterminate: Story = {
    render: () => <Checkbox
        data-testid="checkbox"
        indeterminate
    />,
};

export const Error: Story = {
    render: () => <Checkbox
        data-testid="checkbox"
        error
    />,
};

export const Disabled: Story = {
    render: () => <Checkbox
        data-testid="checkbox"
        disabled
    />,
}

export const FocusRing: Story = {
    render: () => <Checkbox
        data-testid="checkbox"
        showFocusRing
    />,
}

// TODO: Add story with label
