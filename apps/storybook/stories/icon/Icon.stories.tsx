import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Icon> = {
    title: 'Design System/Components/Icon',
    component: Icon,
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Standalone: Story = {
    args: {
        name: 'add',
    },
    render: (args) => {

        return (
            < Icon
                data-testid="Icon"
                {...args}
            />
        )
    }
};
