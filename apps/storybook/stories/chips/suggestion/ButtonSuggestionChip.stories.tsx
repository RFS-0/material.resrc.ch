import type {Meta, StoryObj} from 'storybook-solidjs';
import {ButtonSuggestionChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof ButtonSuggestionChip> = {
    title: 'Design System/Components/Chips/Suggestion/Button',
    component: ButtonSuggestionChip,
};

export default meta;
type Story = StoryObj<typeof ButtonSuggestionChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        showFocusRing: false,
    },
    render: (args) => <ButtonSuggestionChip
        data-testid="button-suggestion-chip"
        {...args}
        label="My Button Suggestion Chip"
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: (args) => <ButtonSuggestionChip
        data-testid="button-suggestion-chip"
        label="My Button Suggestion Chip"
        disabled={args.disabled}
    />,
};

export const Elevated: Story = {
    args: {
        elevated: true,
    },
    render: (args) => <ButtonSuggestionChip
        data-testid="button-suggestion-chip"
        label="My Button Suggestion Chip"
        elevated={args.elevated}
    />,
};

export const WithFocusRing: Story = {
    args: {
        showFocusRing: true,
    },
    render: (args) => <ButtonSuggestionChip
        data-testid="button-suggestion-chip"
        label="My Button Suggestion Chip"
        showFocusRing={args.showFocusRing}
    />,
};
