import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, Tab, TabItemData} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createStore} from 'solid-js/store';

const meta: Meta<typeof Tab> = {
    title: 'Design System/Components/Tab',
    component: Tab,
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Standalone: Story = {
    args: {
        id: 'home',
        ariaLabel: 'Tab',
        disabled: false,
        focusable: true,
        icon: <Icon name={'home'}/>,
        inlineIcon: false,
        label: 'Home',
        selected: false,
        tabStore: createStore<TabItemData[]>([]),
        variant: 'primary',
    },
    render: (args) => {
        return (
            <div style={{width: '350px'}}>
                <Tab
                    data-testid="tab"
                    {...args}
                />
            </div>
        )
    }
};
