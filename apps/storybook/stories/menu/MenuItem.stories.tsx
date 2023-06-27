import type {Meta, StoryObj} from 'storybook-solidjs';
import {Checkbox, Icon, MenuItem} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof MenuItem> = {
    title: 'Design System/Components/Menu/MenuItem',
    component: MenuItem,
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Standalone: Story = {
    render: () => {
        return (
            <MenuItem
                data-testid="linear-progress"
                data={{
                    id: 'list-item',
                    headline: 'List Item',
                    state: {
                        active: false,
                        disabled: false,
                        focusOnActivation: true,
                        selected: false,
                    },
                    focus: () =>  console.log('focus'),
                }}
                onCloseMenu={() => console.log('close menu')}
                start={
                    <Icon
                        data-variant={'icon'}
                        name="favorite"
                    />
                }
            />
        )
    }
};

export const WithEnd: Story = {
    render: () => {
        return (
            <MenuItem
                data-testid="linear-progress"
                data={{
                    id: 'list-item',
                    headline: 'List Item',
                    state: {
                        active: false,
                        disabled: false,
                        focusOnActivation: true,
                        selected: false,
                    },
                    focus: () =>  console.log('focus'),
                }}
                onCloseMenu={() => console.log('close menu')}
                start={
                    <Icon
                        data-variant={'icon'}
                        name="favorite"
                    />
                }
                // TODO: check why check box does not get the click event
                end={<Checkbox/>}
                showFocusRing={true}
            />
        )
    }
};

export const WithTwoLines: Story = {
    render: () => {
        return (
            <MenuItem
                data-testid="linear-progress"
                data={{
                    id: 'list-item',
                    headline: 'List Item',
                    supportingText: 'Supporting Text',
                    state: {
                        active: false,
                        disabled: false,
                        focusOnActivation: true,
                        selected: false,
                    },
                    focus: () =>  console.log('focus'),
                }}
                onCloseMenu={() => console.log('close menu')}
                start={
                    <Icon
                        data-variant={'icon'}
                        name="favorite"
                    />
                }
            />
        )
    }
};

export const WithThreeLines: Story = {
    render: () => {
        return (
            <MenuItem
                data-testid="linear-progress"
                data={{
                    id: 'list-item',
                    headline: 'List Item',
                    supportingText: 'Supporting Text',
                    multiLineSupportingText: 'Multi Line Supporting Text',
                    trailingSupportingText: 'Trailing Supporting Text',
                    state: {
                        active: false,
                        disabled: false,
                        focusOnActivation: true,
                        selected: false,
                    },
                    focus: () =>  console.log('focus'),
                }}
                onCloseMenu={() => console.log('close menu')}
                start={
                    <Icon
                        data-variant={'icon'}
                        name="favorite"
                    />
                }
            />
        )
    }
};
