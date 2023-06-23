import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, StandardLinkIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof StandardLinkIconButton> = {
    title: 'Design System/Components/IconButtons/StandardLinkIconButton',
    component: StandardLinkIconButton,
};

export default meta;
type Story = StoryObj<typeof StandardLinkIconButton>;

export const Standalone: Story = {
    storyName: 'StandardLinkIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My StandardLinkIconButton',
        icon: <Icon name={'link'}/>,
        target: '_blank',
        href: 'https://blog.resrc.ch'
    },
    render: (args) => <StandardLinkIconButton
        data-testid="standardIconButtonToggle"
        {...args}
    />,
};
