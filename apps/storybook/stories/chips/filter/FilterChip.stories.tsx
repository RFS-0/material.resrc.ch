import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilterChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilterChip> = {
    title: 'Design System/Components/Chips/Filter',
    component: FilterChip,
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        showFocusRing: false,
        removable: false,
    },
    render: (args) => <FilterChip
        data-testid="filter-chip"
        {...args}
        label="My Filter Chip"
        onSelected={() => console.log('FilterChip selected!')}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const Selected: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        selected: true,
        showFocusRing: false,
        removable: false,
    },
    render: (args) => <FilterChip
        data-testid="filter-chip"
        {...args}
        label="My Filter Chip"
        onSelected={() => console.log('FilterChip selected!')}
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
    render: (args) => <FilterChip
        data-testid="filter-chip"
        {...args}
        label="My Filter Chip"
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: (args) => <FilterChip
        data-testid="filter-chip"
        label="My Filter Chip"
        disabled={args.disabled}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const Elevated: Story = {
    args: {
        elevated: true,
    },
    render: (args) => <FilterChip
        data-testid="filter-chip"
        label="My Filter Chip"
        elevated={args.elevated}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const WithFocusRing: Story = {
    args: {
        showFocusRing: true,
    },
    render: (args) => <FilterChip
        data-testid="filter-chip"
        label="My Filter Chip"
        showFocusRing={args.showFocusRing}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
};

export const Removable: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        elevated: false,
        showFocusRing: false,
        removable: true,
    },
    render: (args) =>
        <FilterChip
            data-testid="filter-chip"
            {...args}
            label="My Filter Chip"
            onSelected={() => console.log('FilterChip selected!')}
            onRemoved={() => console.log('FilterChip removed!')}
            icon={<span class="material-symbols-outlined">add</span>}
        />,
};
