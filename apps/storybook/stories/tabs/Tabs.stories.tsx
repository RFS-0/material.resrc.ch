import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, Tabs} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Tabs> = {
    title: 'Design System/Components/Tabs',
    component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Standalone: Story = {
    args: {},
    render: (args) => {
        return (
            <div style={{width: '350px'}}>
                <Tabs
                    items={
                        [
                            {
                                id: 'home',
                                ariaLabel: 'Home',
                                disabled: false,
                                focusable: true,
                                icon: <Icon name={'home'}/>,
                                inlineIcon: false,
                                label: 'Home',
                                selected: false,
                            },
                            {
                                id: 'favorite',
                                ariaLabel: 'Favorite',
                                disabled: false,
                                focusable: true,
                                icon: <Icon name={'favorite'}/>,
                                inlineIcon: false,
                                label: 'Favorite',
                                selected: false,
                            },
                            {
                                id: 'person',
                                ariaLabel: 'Person',
                                disabled: false,
                                focusable: true,
                                icon: <Icon name={'person'}/>,
                                inlineIcon: false,
                                label: 'Person',
                                selected: false,
                            },
                        ]
                    }
                    variant={args.variant}
                >
                </Tabs>
            </div>
        )
    }
};
