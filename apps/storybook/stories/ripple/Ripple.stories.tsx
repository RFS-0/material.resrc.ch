import type {Meta, StoryObj} from 'storybook-solidjs';
import {createHandlers, createRippleEventEmitter, Ripple} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createSignal} from 'solid-js';

const meta: Meta<typeof Ripple> = {
    title: 'Design System/Components/Ripple',
    component: Ripple,
};

export default meta;
type Story = StoryObj<typeof Ripple>;

export const Standalone: Story = {
    args: {},
    render: () => {
        const [style, ] = createSignal({
            position: 'relative',
            width: '200px',
            height: '200px',
            'background-color': 'var(--sys-primary)',
            cursor: '',
            '--ripple-hover-color': 'var(--sys-on-primary)',
            '--ripple-pressed-color': 'var(--sys-on-primary)',
            'border-radius': '20px',
        });

        const {listen, emit} = createRippleEventEmitter();
        const rippleHandlers = createHandlers(emit);

        return (
            <div
                style={style()}
                {...rippleHandlers}
            >
                <Ripple
                    data-testid='ripple'
                    disabled={false}
                    listen={listen}
                />
            </div>
        )
    }
};

export const Disabled: Story = {
    args: {},
    render: () => {
        const [style, ] = createSignal({
            position: 'relative',
            width: '200px',
            height: '200px',
            'background-color': 'var(--sys-primary)',
            cursor: '',
            '--ripple-hover-color': 'var(--sys-on-primary)',
            '--ripple-pressed-color': 'var(--sys-on-primary)',
            'border-radius': '20px',
        });

        const {listen, emit} = createRippleEventEmitter();
        const rippleHandlers = createHandlers(emit);

        return (
            <div
                style={style()}
                {...rippleHandlers}
            >
                <Ripple
                    data-testid='ripple'
                    disabled={true}
                    listen={listen}
                />
            </div>
        )
    }
};
