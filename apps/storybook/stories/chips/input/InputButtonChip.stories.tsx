import type {Meta, StoryObj} from 'storybook-solidjs';
import {ButtonInputChip, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof ButtonInputChip> = {
    title: 'Design System/Components/Chips/Input/Button',
    component: ButtonInputChip,
};

export default meta;
type Story = StoryObj<typeof ButtonInputChip>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        label: 'My Input Chip',
        onRemoved: () => console.log('InputChip removed!'),
        showFocusRing: false,
    },
    render: (args) => <ButtonInputChip
        data-testid="input-chip"
        {...args}
        icon={<Icon name={'add'}/>}
    />,
};

export const RemoveOnly: Story = {
    args: {
        disabled: false,
        disableRipple: false,
        label: 'My Input Chip',
        showFocusRing: false,
        onRemoved: () => console.log('InputChip removed!'),
        removeOnly: true,
    },
    render: (args) => <ButtonInputChip
        data-testid="input-chip"
        {...args}
    />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
        label: 'My Input Chip',
        onRemoved: () => console.log('InputChip removed!'),
    },
    render: (args) => <ButtonInputChip
        data-testid="input-chip"
        {...args}
        icon={<Icon name={'add'}/>}
    />,
};

export const WithFocusRing: Story = {
    args: {
        label: 'My Input Chip',
        showFocusRing: true,
        onRemoved: () => console.log('InputChip removed!'),
    },
    render: (args) => <ButtonInputChip
        data-testid="input-chip"
        {...args}
        icon={<Icon name={'add'}/>}
    />,
};
