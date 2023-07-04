import type {Meta, StoryObj} from 'storybook-solidjs';
import {Field, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof Field> = {
    title: 'Design System/Components/Field',
    component: Field,
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Standalone: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: () => 'My Value',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
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
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        value: () => 'My Value',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
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
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: () => 'My Value',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
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
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        value: () => 'My Value',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
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
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        value: () => 'My Value',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
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
        resizable: true,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: () =>  'My Value',
        variant: 'outlined',
    },
    render: (args) => {
        return (
            <Field
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};
