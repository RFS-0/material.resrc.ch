import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledTonalIconButton, handleItemClick, Icon, Menu, MenuItem, MenuItemData} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createStore} from 'solid-js/store';
import {createSignal} from 'solid-js';

const meta: Meta<typeof Menu> = {
    title: 'Design System/Components/Menu/Menu',
    component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Standalone: Story = {
    render: () => {
        const items = createStore<MenuItemData[]>([
            {
                id: 'menu-item-1',
                headline: 'Menu Item 1',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                    selected: false,
                },
                focus: () => console.log('focus'),
            },
            {
                id: 'menu-item-2',
                headline: 'Menu Item 2',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                    selected: false,
                },
                focus: () => console.log('focus'),
            },
            {
                id: 'menu-item-3',
                headline: 'Menu Item 3',
                state: {
                    active: false,
                    disabled: false,
                    focusOnActivation: true,
                    selected: false,
                },
                focus: () => console.log('focus'),
            }
        ]);

        let menuAnchor: HTMLElement | null = null;
        const [menuOpen, setMenuOpen] = createSignal(false);

        return (
            <div>
                <FilledTonalIconButton
                    ref={menuAnchor}
                    icon={<Icon name={'more_vert'}/>}
                    onClick={() => setMenuOpen(true)}
                />

                <Menu
                    menuProps={{
                        anchorEl: () => menuAnchor,
                        isOpen: menuOpen(),
                    }}
                    items={[items[0], items[1]]}
                    itemRenderer={(item) => <MenuItem
                        data-testid={item.id}
                        data={item}
                        showFocusRing={true}
                        onItemClicked={(item) => handleItemClick(item, items)}
                        onCloseMenu={() => setMenuOpen(false)}
                    />
                    }
                />
            </div>
        )
    }
};
