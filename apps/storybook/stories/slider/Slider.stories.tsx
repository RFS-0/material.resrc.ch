import type {Meta, StoryObj} from 'storybook-solidjs';
import {Slider} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Slider> = {
    title: 'Design System/Components/Slider',
    component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Standalone: Story = {
    args: {
        disabled: false,
        disableFocusRings: false,
        labeled: true,
        max: 100,
        min: 0,
        ranged: false,
        step: 10,
        ticks: true,
        valueEnd: 10,
        valueEndLabel: '',
    },
    render: (args) => <Slider
        {...args}
    />,
};

export const Ranged: Story = {
    args: {
        disabled: false,
        disableFocusRings: false,
        labeled: true,
        max: 100,
        min: 0,
        ranged: true,
        step: 10,
        ticks: true,
        valueStart: 10,
        valueEnd: 80,
        valueEndLabel: '',
    },
    render: (args) => <Slider
        {...args}
    />,
};
