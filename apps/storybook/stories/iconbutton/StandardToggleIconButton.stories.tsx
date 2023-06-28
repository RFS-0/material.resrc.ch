import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, StandardToggleIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof StandardToggleIconButton> = {
    title: 'Design System/Components/IconButtons/StandardToggleIconButton',
    component: StandardToggleIconButton,
};

export default meta;
type Story = StoryObj<typeof StandardToggleIconButton>;

export const Standalone: Story = {
    name: 'StandardToggleIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My StandardToggleIconButton',
        onIcon: <Icon name={'remove'}/>,
        offIcon: <Icon name={'add'}/>,
    },
    render: (args) => <StandardToggleIconButton
        data-testid="icon-button"
        {...args}
    />,
};
