import type {Meta, StoryObj} from 'storybook-solidjs';
import {Radio} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Radio> = {
    title: 'Design System/Components/Radio',
    component: Radio,
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Standalone: Story = {
    args: {
        name: 'standalone',
    },
    render: (args) => {

        return (
            <Radio
                data-testid="Radio"
                {...args}
            />
        )
    }
};

export const Multiple: Story = {
    args: {
        name: 'multiple',
    },
    render: (args) => {

        return (
            <div>
                <Radio
                    data-testid="Radio"
                    {...args}
                />
                <Radio
                    data-testid="Radio"
                    {...args}
                />
                <Radio
                    data-testid="Radio"
                    {...args}
                />
            </div>

        )
    }
};
