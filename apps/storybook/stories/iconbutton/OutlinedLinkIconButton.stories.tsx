import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, OutlinedLinkIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof OutlinedLinkIconButton> = {
    title: 'Design System/Components/IconButtons/OutlinedLinkIconButton',
    component: OutlinedLinkIconButton,
};

export default meta;
type Story = StoryObj<typeof OutlinedLinkIconButton>;

export const Standalone: Story = {
    name: 'OutlinedLinkIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My OutlinedLinkIconButton',
        icon: <Icon name={'link'}/>,
        target: '_blank',
        href: 'https://blog.resrc.ch'
    },
    render: (args) => <OutlinedLinkIconButton
        data-testid="icon-button"
        {...args}
    />,
};
