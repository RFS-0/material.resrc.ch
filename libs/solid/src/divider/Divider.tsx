import './styles/divider-styles.css';

export type DividerProps = {
    inset?: boolean;
    insetEnd?: boolean;
    insetStart?: boolean;
}

export const Divider = (props: DividerProps) => {
    return (
        <div
            class="base-divider"
            classList={{
                'inset': props.inset,
                'inset-start': props.insetStart,
                'inset-end': props.insetEnd,
            }}
        />
    );
};
