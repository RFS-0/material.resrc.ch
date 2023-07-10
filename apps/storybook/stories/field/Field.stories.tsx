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
        populated: true,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
                {...args}
            >
                <span>foo</span>
                My Value
                <input style={{display: 'none'}} type="text"/>
                <span>bar</span>
            </Field>
        )
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
        error: false,
        focused: false,
        label: 'My Label',
        populated: true,
        leadingIcon: <Icon name={'favorite'}/>,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
                {...args}
            >
                My Value
            </Field>
        )
    }
};

export const WithLeadingIcon: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        populated: true,
        leadingIcon: <Icon name={'favorite'}/>,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
                {...args}
            >
                My Value
            </Field>
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
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
                {...args}
            >
                My Value
            </Field>
        )
    }
};

export const WithLeadingAndTrailingIcon: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        label: 'My Label',
        populated: true,
        leadingIcon: <Icon name={'favorite'}/>,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
        variant: 'outlined'
    },
    render: (args) => {
        return (
            <Field
                {...args}
            >
                My Value
            </Field>
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
        variant: 'outlined',
    },
    render: (args) => {
        return (
            <Field
                {...args}
            >
                My Value
            </Field>
        )
    }
};
