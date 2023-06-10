import type {Meta, StoryObj} from 'storybook-solidjs';
import { within, userEvent } from '@storybook/testing-library';
import {StandardIconButton} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof StandardIconButton> = {
    title: 'Standard Icon Button',
    component: StandardIconButton,
};

export default meta;
type Story = StoryObj<typeof StandardIconButton>;

export const StandardIconButtonStory: Story = {
    storyName: 'Standard Icon Button',
    args: {
        disabled: false
    },
    parameters: {
        disabled: {
            values: [true, false],
        },
    },
    render: (args) => <StandardIconButton
        data-testid="standard-icon-button"
        disabled={args.disabled}
        icon={<span class="material-symbols-outlined">add</span>}
    />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByTestId('standard-icon-button'));
    },
};
