import type {Meta, StoryObj} from 'storybook-solidjs';
import {ButtonAssistChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof ButtonAssistChip> = {
    title: 'Design System/Atoms/Chips/Assist/Button',
    component: ButtonAssistChip,
};

export default meta;
type Story = StoryObj<typeof ButtonAssistChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        showFocusRing: false,
    },
    render: (args) => <ButtonAssistChip
        data-testid="button-assist-chip"
        {...args}
        label="My Button Assist Chip"
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const WithoutIcon: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        showFocusRing: false,
    },
    render: (args) => <ButtonAssistChip
        data-testid="button-assist-chip"
        {...args}
        label="My Button Assist Chip"
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: (args) => <ButtonAssistChip
        data-testid="button-assist-chip"
        label="My Button Assist Chip"
        disabled={args.disabled}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const Elevated: Story = {
    args: {
        elevated: true,
    },
    render: (args) => <ButtonAssistChip
        data-testid="button-assist-chip"
        label="My Button Assist Chip"
        elevated={args.elevated}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const WithFocusRing: Story = {
    args: {
        showFocusRing: true,
    },
    render: (args) => <ButtonAssistChip
        data-testid="button-assist-chip"
        label="My Button Assist Chip"
        showFocusRing={args.showFocusRing}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};
