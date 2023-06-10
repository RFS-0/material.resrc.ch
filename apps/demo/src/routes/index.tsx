import {StandardIconButton} from 'material.resrc.ch';

export default function Home() {
    return (
        <div>
            <StandardIconButton
                disabled={false}
                icon={<span class="material-symbols-outlined">add</span>}
            />
        </div>
    );
}
