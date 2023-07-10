import type {Meta, StoryObj} from 'storybook-solidjs';
import {TextField} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createSignal} from 'solid-js';

const meta: Meta<typeof TextField> = {
    title: 'Design System/Components/TextField',
    component: TextField,
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Standalone: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        maxLength: 200,
        prefixText: 'Prefix',
        resizable: false,
        required: false,
        suffixText: 'Suffix',
        supportingText: 'Supporting Text',
        value: createSignal('My Value'),
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <div style={{width: '350px'}}>
                <TextField
                    data-testid="text-field"
                    {...args}
                />
            </div>
        )
    }
};
