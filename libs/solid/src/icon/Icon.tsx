import './styles/icon-styles.css';

export type IconProps = {
    name: string;
}

export const Icon = (props: IconProps) => {
    return (
        <span
            {...props}
            class={'base-icon'}
        >
            {props.name}
        </span>
    );
};
