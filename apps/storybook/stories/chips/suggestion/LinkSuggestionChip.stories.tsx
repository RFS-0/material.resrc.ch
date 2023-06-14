import type {Meta, StoryObj} from 'storybook-solidjs';
import {LinkSuggestionChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof LinkSuggestionChip> = {
    title: 'Design System/Components/Chips/Suggestion/Link',
    component: LinkSuggestionChip,
};

export default meta;
type Story = StoryObj<typeof LinkSuggestionChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        href: 'https://www.blog.resrc.ch',
        showFocusRing: false,
    },
    render: (args) => <LinkSuggestionChip
        {...args}
        data-testid="link-suggestion-chip"
        label="My Link Suggestion Chip"
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
        href: 'https://www.blog.resrc.ch',
    },
    render: (args) => <LinkSuggestionChip
        data-testid="link-suggestion-chip"
        {...args}
        label="My Link Suggestion Chip"
        disabled={args.disabled}
    />,
};

export const Elevated: Story = {
    args: {
        elevated: true,
        href: 'https://www.blog.resrc.ch',
    },
    render: (args) => <LinkSuggestionChip
        {...args}
        data-testid="link-suggestion-chip"
        label="My Link Suggestion Chip"
        elevated={args.elevated}
    />,
};

export const WithFocusRing: Story = {
    args: {
        showFocusRing: true,
        href: 'https://www.blog.resrc.ch',
    },
    render: (args) => <LinkSuggestionChip
        {...args}
        data-testid="link-suggestion-chip"
        label="My Link Suggestion Chip"
        showFocusRing={args.showFocusRing}
    />,
};
