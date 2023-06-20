import type {Meta, StoryObj} from 'storybook-solidjs';
import {Button, Dialog} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createSignal} from 'solid-js';

const meta: Meta<typeof Dialog> = {
    title: 'Design System/Components/Dialog',
    component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Standalone: Story = {
    args: {
    },
    render: (args) => {

        const openSignal = createSignal(false);
        const [open, setOpen] = openSignal;

        return (
            <div>
                <Button
                    variant={'filled'}
                    label={'Open Dialog'}
                    onClick={() => setOpen(!open())}
                />
                <Dialog
                    open={openSignal}
                    data-testid="dialog"
                    headlinePrefix={<span class="material-symbols-outlined">add</span>}
                />
            </div>
        )
    }
};
