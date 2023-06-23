import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledTonalToggleIconButton, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledTonalToggleIconButton> = {
    title: 'Design System/Components/IconButtons/FilledTonalToggleIconButton',
    component: FilledTonalToggleIconButton,
};

export default meta;
type Story = StoryObj<typeof FilledTonalToggleIconButton>;

export const Standalone: Story = {
    storyName: 'FilledTonalToggleIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My FilledTonalToggleIconButton',
        onIcon: <Icon name={'remove'}/>,
        offIcon: <Icon name={'add'}/>,
    },
    render: (args) => <FilledTonalToggleIconButton
        data-testid="icon-button"
        {...args}
    />,
};
