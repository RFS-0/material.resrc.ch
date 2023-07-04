import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledSelect, SelectItem, SelectOptionItem, TypeaheadController} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createStore} from 'solid-js/store';
import {createSignal} from 'solid-js';

const meta: Meta<typeof FilledSelect> = {
    title: 'Design System/Components/Select/FilledSelect',
    component: FilledSelect,
};

export default meta;
type Story = StoryObj<typeof FilledSelect>;

export const Standalone: Story = {
    render: () => {
        const items = createStore<SelectOptionItem []>([
            {
                id: 'select-item-1',
                headline: 'Select Item 1',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                    selected: false,
                },
                value: 'value-1',
            },
            {
                id: 'select-item-2',
                headline: 'Select Item 2',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                    selected: false,
                },
                value: 'value-2',
            },
            {
                id: 'select-item-3',
                headline: 'Select Item 3',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                    selected: false,
                },
                focus: () => console.log('focus'),
                value: 'value-3',
            }
        ]);

        let selectAnchor: HTMLButtonElement | null = null;
        const [selectOpen, setSelectOpen] = createSignal(false);

        return (
            <FilledSelect
                positionHelper={{
                    anchorEl: () => selectAnchor,
                    isOpen: selectOpen,
                }}
                items={[items[0], items[1]]}
                itemRenderer={
                    (item) => <SelectItem
                        data-testid={item.id}
                        data={item}
                        showFocusRing={true}
                    />
                }
                label={'My Select'}
                open={[selectOpen, setSelectOpen]}
                stayOpenOnFocusout={true}
                type={'select'}
                typeAheadController={new TypeaheadController({
                    items: items,
                    active: () => true,
                    typeaheadBufferTime: () => 500,
                })}
            />
        )
    }
};
