import type {Meta, StoryObj} from 'storybook-solidjs';
import {Switch} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Switch> = {
    title: 'Design System/Components/Switch',
    component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Standalone: Story = {
    args: {
        ariaLabel: 'My Switch',
        disabled: false,
        icons: true,
        selected: false,
        showOnlySelectedIcon: false,
        showFocusRing: true,
    },
    render: (args) => {

        return (
            < Switch
                data-testid="switch"
                {...args}
            />
        )
    }
};
