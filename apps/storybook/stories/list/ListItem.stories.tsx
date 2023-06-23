import type {Meta, StoryObj} from 'storybook-solidjs';
import {Icon, ListItem} from 'material.resrc.ch';
import 'material.resrc.ch/dist/index.css'

const meta: Meta<typeof ListItem> = {
    title: 'Design System/Components/ListItem',
    component: ListItem,
};

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Standalone: Story = {
    render: () => {
        return (
            <ListItem
                data-testid="linear-progress"
                data={{
                    id: 'list-item',
                    headline: 'List Item',
                    supportingText: 'Supporting Text',
                    multiLineSupportingText: 'Multi Line Supporting Text',
                    trailingSupportingText: 'Trailing Supporting Text',
                    state: {
                        active: false,
                        disabled: false,
                        focusOnActivation: true,
                    }
                }}
                start={<Icon name="favorite" />}
            />
        )
    }
};
