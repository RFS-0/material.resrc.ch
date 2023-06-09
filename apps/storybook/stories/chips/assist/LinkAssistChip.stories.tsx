import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, LinkAssistChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof LinkAssistChip> = {
    title: 'Design System/Components/Chips/Assist/Link',
    component: LinkAssistChip,
};

export default meta;
type Story = StoryObj<typeof LinkAssistChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        href: 'https://www.blog.resrc.ch',
        showFocusRing: false,
    },
    render: (args) => <LinkAssistChip
        {...args}
        data-testid="link-assist-chip"
        label="My Link Assist Chip"
        icon={<Icon name="link"/>}
    />,
};

export const WithoutIcon: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        href: 'https://www.blog.resrc.ch',
        showFocusRing: false,
    },
    render: (args) => <LinkAssistChip
        {...args}
        data-testid="button-assist-chip"
        label="My Button Assist Chip"
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
        href: 'https://www.blog.resrc.ch',
    },
    render: (args) => <LinkAssistChip
        data-testid="link-assist-chip"
        {...args}
        label="My Link Assist Chip"
        disabled={args.disabled}
        icon={<Icon name="link"/>}
    />,
};

export const Elevated: Story = {
    args: {
        elevated: true,
        href: 'https://www.blog.resrc.ch',
    },
    render: (args) => <LinkAssistChip
        {...args}
        data-testid="link-assist-chip"
        label="My Link Assist Chip"
        elevated={args.elevated}
        icon={<Icon name="link"/>}
    />,
};

export const WithFocusRing: Story = {
    args: {
        showFocusRing: true,
        href: 'https://www.blog.resrc.ch',
    },
    render: (args) => <LinkAssistChip
        {...args}
        data-testid="link-assist-chip"
        label="My Link Assist Chip"
        showFocusRing={args.showFocusRing}
        icon={<Icon name="link"/>}
    />,
};
