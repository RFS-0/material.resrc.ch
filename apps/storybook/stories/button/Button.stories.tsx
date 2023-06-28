import type {Meta, StoryObj} from 'storybook-solidjs';
import {userEvent, within} from '@storybook/testing-library';
import {Button} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Button> = {
    title: 'Design System/Components/Button',
    component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const ButtonStory: Story = {
    name: 'Button',
    args: {
        ariaHasPopup: false,
        ariaLabel: 'My Button',
        label: 'My Button',
        labelElement: undefined,
        leadingIcon: undefined,
        onClick: () => console.log('Button clicked'),
        preventClickDefault: false,
        selected: false,
        showFocusRing: false,
        trailingIcon: undefined,
        variant: 'filled',
    },
    parameters: {
        ariaHasPopup: {
            values: [true, false],
        },
        ariaLabel: 'My Button',
        label: 'My Button',
        selected: {
            values: [true, false],
        },
        disabled: {
            values: [true, false],
        },
        showFocusRing: {
            values: [true, false],
        },
    },
    render: (args) => <Button
        data-testid="button"
        {...args}
    />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByTestId('button'));
    },
};
