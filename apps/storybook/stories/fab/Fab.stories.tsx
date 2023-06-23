import type {Meta, StoryObj} from 'storybook-solidjs';
import {Fab, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Fab> = {
    title: 'Design System/Components/Fab',
    component: Fab,
};

export default meta;
type Story = StoryObj<typeof Fab>;

export const Standalone: Story = {
    args: {
        variant: 'surface',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Extended: Story = {
    args: {
        label: 'My Fab',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const ExtendedWithoutIcon: Story = {
    args: {
        label: 'My Fab',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
        />
    }
};
export const Lowered: Story = {
    args: {
        lowered: true,
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Small: Story = {
    args: {
        size: 'small',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Medium: Story = {
    args: {
        size: 'medium',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Large: Story = {
    args: {
        size: 'large',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Primary: Story = {
    args: {
        variant: 'primary',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const Tertiary: Story = {
    args: {
        variant: 'tertiary',
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};

export const WithFocusRing: Story = {
    args: {
        variant: 'surface',
        showFocusRing: true,
    },
    render: (args) => {
        return <Fab
            data-testid="fab"
            {...args}
            icon={<Icon name={'edit'}/>}
        />
    }
};
