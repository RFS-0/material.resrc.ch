import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledIconButton, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledIconButton> = {
    title: 'Design System/Components/IconButtons/FilledIconButton',
    component: FilledIconButton,
};

export default meta;
type Story = StoryObj<typeof FilledIconButton>;

export const Standalone: Story = {
    storyName: 'FilledIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My FilledIconButton',
        icon: <Icon name={'add'}/>,
    },
    render: (args) => <FilledIconButton
        data-testid="filledIconButton"
        {...args}
    />,
};
