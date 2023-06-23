import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledTonalIconButton, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledTonalIconButton> = {
    title: 'Design System/Components/IconButtons/FilledTonalIconButton',
    component: FilledTonalIconButton,
};

export default meta;
type Story = StoryObj<typeof FilledTonalIconButton>;

export const Standalone: Story = {
    storyName: 'FilledTonalIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My FilledTonalIconButton',
        icon: <Icon name={'add'}/>,
    },
    render: (args) => <FilledTonalIconButton
        data-testid="icon-button"
        {...args}
    />,
};
