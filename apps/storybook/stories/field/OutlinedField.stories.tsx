import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, OutlinedField} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof OutlinedField> = {
    title: 'Design System/Components/OutlinedField',
    component: OutlinedField,
};

export default meta;
type Story = StoryObj<typeof OutlinedField>;

export const Standalone: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        populated: true,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
        error: false,
        focused: false,
        label: 'My Label',
        leadingIcon: <Icon name={'favorite'}/>,
        populated: true,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const WithLeadingIcon: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        leadingIcon: <Icon name={'favorite'}/>,
        populated: true,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const WithTrailingIcon: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        populated: true,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const WithLeadingAndTrailingIcon: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        leadingIcon: <Icon name={'favorite'}/>,
        populated: true,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const Unpopulated: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        populated: false,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const Resizable: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        populated: true,
        resizable: true,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: 'My Value'
    },
    render: (args) => {
        return (
            <OutlinedField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};
