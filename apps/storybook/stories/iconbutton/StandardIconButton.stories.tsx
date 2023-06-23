import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, StandardIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof StandardIconButton> = {
    title: 'Design System/Components/IconButtons/StandardIconButton',
    component: StandardIconButton,
};

export default meta;
type Story = StoryObj<typeof StandardIconButton>;

export const Standalone: Story = {
    storyName: 'StandardIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My StandardIconButton',
        icon: <Icon name={'add'}/>,
    },
    render: (args) => <StandardIconButton
        data-testid="standardIconButton"
        {...args}
    />,
};
