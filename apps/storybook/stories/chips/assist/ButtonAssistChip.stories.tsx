import type {Meta, StoryObj} from 'storybook-solidjs';
import {ButtonAssistChip, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof ButtonAssistChip> = {
    title: 'Design System/Components/Chips/Assist/Button',
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
        icon={<Icon name="add" />}
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
        icon={<Icon name="add" />}
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
        icon={<Icon name="add" />}
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
        icon={<Icon name="add" />}
    />,
};
