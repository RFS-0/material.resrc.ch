import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, OutlinedIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof OutlinedIconButton> = {
    title: 'Design System/Components/IconButtons/OutlinedIconButton',
    component: OutlinedIconButton,
};

export default meta;
type Story = StoryObj<typeof OutlinedIconButton>;

export const Standalone: Story = {
    storyName: 'OutlinedIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My OutlinedIconButton',
        icon: <Icon name={'add'}/>,
    },
    render: (args) => <OutlinedIconButton
        data-testid="icon-button"
        {...args}
    />,
};
