import type {Meta, StoryObj} from 'storybook-solidjs';
import {LinkAssistChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof LinkAssistChip> = {
    title: 'Link Assist Chip',
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
        icon={<span class="material-symbols-outlined">link</span>}
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
        icon={<span class="material-symbols-outlined">link</span>}
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
        icon={<span class="material-symbols-outlined">link</span>}
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
        icon={<span class="material-symbols-outlined">link</span>}
    />,
};
