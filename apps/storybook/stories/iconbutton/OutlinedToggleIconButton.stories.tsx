import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, OutlinedToggleIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof OutlinedToggleIconButton> = {
    title: 'Design System/Components/IconButtons/OutlinedToggleIconButton',
    component: OutlinedToggleIconButton,
};

export default meta;
type Story = StoryObj<typeof OutlinedToggleIconButton>;

export const Standalone: Story = {
    name: 'OutlinedToggleIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My OutlinedToggleIconButton',
        onIcon: <Icon name={'remove'}/>,
        offIcon: <Icon name={'add'}/>,
    },
    render: (args) => <OutlinedToggleIconButton
        data-testid="icon-button"
        {...args}
    />,
};
