import type {Meta, StoryObj} from 'storybook-solidjs';
import {Elevation} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'
import {createSignal} from 'solid-js';

const meta: Meta<typeof Elevation> = {
    title: 'Design System/Components/Elevation',
    component: Elevation,
};

export default meta;
type Story = StoryObj<typeof Elevation>;

export const Standalone: Story = {
    args: {
        elevationLevel: 1,
    },
    render: (args) => {
        const surfaceContainer = 'var(--sys-surface-container)';
        const surfaceContainerHigh = 'var(--sys-surface-container-high)';

        const [style, setStyle] = createSignal({
            position: 'relative',
            width: '100px',
            height: '100px',
            background: surfaceContainer,
            '--elevation-level': args.elevationLevel,
        });

        const handleMouseOver = () => {
            setStyle({
                ...style(),
                background: surfaceContainerHigh,
                '--elevation-level': args.elevationLevel + 1,
            })
        }

        const handleMouseOut = () => {
            setStyle({
                ...style(),
                background: surfaceContainer,
                '--elevation-level': args.elevationLevel,
            })
        }

        return <div
            style={style()}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Elevation
                data-testid="Elevation"
            />
        </div>
    }
};
