import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledToggleIconButton, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledToggleIconButton> = {
    title: 'Design System/Components/IconButtons/FilledToggleIconButton',
    component: FilledToggleIconButton,
};

export default meta;
type Story = StoryObj<typeof FilledToggleIconButton>;

export const Standalone: Story = {
    name: 'FilledToggleIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My FilledToggleIconButton',
        onIcon: <Icon name={'remove'}/>,
        offIcon: <Icon name={'add'}/>,
    },
    render: (args) => <FilledToggleIconButton
        data-testid="icon-button"
        {...args}
    />,
};
