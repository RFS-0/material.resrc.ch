import type {Meta, StoryObj} from 'storybook-solidjs';
import {Button, Dialog, FilterChip} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createSignal} from 'solid-js';
import FilterChipStories from '../chips/filter/FilterChip.stories';

const meta: Meta<typeof Dialog> = {
    title: 'Design System/Components/Dialog',
    component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Standalone: Story = {
    args: {},
    render: (args) => {

        const openSignal = createSignal(false);
        const [open, setOpen] = openSignal;

        const openModal = () => setOpen(true);
        const closeModal = () => setOpen(false);

        return (
            <div>
                <Button
                    variant={'filled'}
                    label={'Open Dialog'}
                    onClick={openModal}
                />
                <Dialog
                    data-testid="dialog"
                    open={openSignal}
                    footer={
                        <div>
                            <Button variant={'text'} label={'Cancel'} onClick={closeModal}/>
                            <Button variant={'text'} label={'Accept'} onClick={closeModal}/>
                        </div>
                    }
                    headline={'Dialog Headline'}
                    headlinePrefix={<span class="material-symbols-outlined">add</span>}
                    headlineSuffix={<span>My Headline Suffix</span>}
                    supportingText={
                        <div>
                            <p>Some text describing the dialog</p>
                            <p>Could also make use of other stuff than text like e.g.</p>
                                <FilterChip
                                    icon={<span class="material-symbols-outlined">favorite</span>}
                                    label={'A filter chip'}
                                />
                                <Button variant={'filled'} label={'A button'}/>
                        </div>
                    }
                />
            </div>
        )
    }
};
