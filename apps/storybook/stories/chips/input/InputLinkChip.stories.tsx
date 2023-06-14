import type {Meta, StoryObj} from 'storybook-solidjs';
import {LinkInputChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof LinkInputChip> = {
    title: 'Design System/Components/Chips/Input/Link',
    component: LinkInputChip,
};

export default meta;
type Story = StoryObj<typeof LinkInputChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        label: 'My Input Chip',
        href: 'https://www.blog.resrc.ch',
        onRemoved: () => console.log('InputChip removed!'),
        showFocusRing: false,
    },
    render: (args) => <LinkInputChip
        data-testid="input-chip"
        {...args}
        icon={<span class="material-symbols-outlined">link</span>}
    />,
};

export const RemoveOnly: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        href: 'https://www.blog.resrc.ch',
        label: 'My Input Chip',
        showFocusRing: false,
        onRemoved: () => console.log('InputChip removed!'),
        removeOnly: true,
    },
    render: (args) => <LinkInputChip
        data-testid="input-chip"
        {...args}
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
        href: 'https://www.blog.resrc.ch',
        label: 'My Input Chip',
        onRemoved: () => console.log('InputChip removed!'),
    },
    render: (args) => <LinkInputChip
        data-testid="input-chip"
        {...args}
        icon={<span class="material-symbols-outlined">link</span>}
    />,
};

export const WithFocusRing: Story = {
    args: {
        label: 'My Input Chip',
        showFocusRing: true,
        onRemoved: () => console.log('InputChip removed!'),
    },
    render: (args) => <LinkInputChip
        data-testid="input-chip"
        {...args}
        icon={<span class="material-symbols-outlined">link</span>}
    />,
};
