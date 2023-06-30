import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledLinkIconButton, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledLinkIconButton> = {
    title: 'Design System/Components/IconButtons/FilledLinkIconButton',
    component: FilledLinkIconButton,
};

export default meta;
type Story = StoryObj<typeof FilledLinkIconButton>;

export const Standalone: Story = {
    name: 'FilledLinkIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My FilledLinkIconButton',
        icon: <Icon name={'link'}/>,
        target: '_blank',
        href: 'https://blog.resrc.ch'
    },
    render: (args) => <FilledLinkIconButton
        data-testid="icon-button"
        {...args}
    />,
};
