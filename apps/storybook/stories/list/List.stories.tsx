import type {Meta, StoryObj} from 'storybook-solidjs';
import {handleItemClick, List, ListItem,} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createStore} from 'solid-js/store';

const meta: Meta<typeof List> = {
    title: 'Design System/Components/List/List',
    component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Standalone: Story = {
    render: () => {
        const items = createStore([
            {
                id: 'list-item-1',
                headline: 'List Item 1',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                }
            },
            {
                id: 'list-item-2',
                headline: 'List Item 2',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                }
            },
            {
                id: 'list-item-3',
                headline: 'List Item 3',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                }
            }
        ]);
        return (

            < List
                items={[items[0], items[1]]}
                itemRenderer={(item) => <ListItem
                    data-testid={item.id}
                    data={item}
                    showFocusRing={true}
                    onClick={() => console.log('click')}
                    onItemClicked={(item) => handleItemClick(item, items)}
                />
                }
            />
        )
    }
};
