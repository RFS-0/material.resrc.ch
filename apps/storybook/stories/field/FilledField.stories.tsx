import type {Meta, StoryObj} from 'storybook-solidjs';
import {FilledField, Icon} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof FilledField> = {
    title: 'Design System/Components/FilledField',
    component: FilledField,
};

export default meta;
type Story = StoryObj<typeof FilledField>;

export const Standalone: Story = {
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
    },
    render: (args) => {
        return (
            <FilledField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};

export const WithValue: Story = {
    args: {
        disabled: false,
        error: false,
        focused: false,
        populated: false,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        value: 'My Value'
    },
    render: (args) => {
        return (
            <FilledField
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
        populated: false,
        resizable: false,
        required: false,
        supportingTextEnd: '8/10',
        supportingTextStart: 'Supporting Text',
        trailingIcon: <Icon name={'cancel'}/>,
    },
    render: (args) => {
        return (
            <FilledField
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
        focused: true,
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
            <FilledField
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
            <FilledField
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
            <FilledField
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
            <FilledField
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
            <FilledField
                data-testid="outlined-field"
                {...args}
            />
        )
    }
};
