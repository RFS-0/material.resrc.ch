import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledTonalLinkIconButton, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledTonalLinkIconButton> = {
    title: 'Design System/Components/IconButtons/FilledTonalLinkIconButton',
    component: FilledTonalLinkIconButton,
};

export default meta;
type Story = StoryObj<typeof FilledTonalLinkIconButton>;

export const Standalone: Story = {
    storyName: 'FilledTonalLinkIconButton',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My FilledTonalLinkIconButton',
        icon: <Icon name={'link'}/>,
        target: '_blank',
        href: 'https://blog.resrc.ch'
    },
    render: (args) => <FilledTonalLinkIconButton
        data-testid="icon-button"
        {...args}
    />,
};
