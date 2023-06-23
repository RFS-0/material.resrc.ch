export type ListProps = {
    items: ListItemData[]
}

export type ListItemData = {
    headline?: string
    id: string
    multiLineSupportingText?: string
    state: {
        active?: boolean
        disabled?: boolean
        focusOnActivation?: boolean
    }
    supportingText?: string
    trailingSupportingText?: string
}

export const List = (props: ListProps) => {

}
