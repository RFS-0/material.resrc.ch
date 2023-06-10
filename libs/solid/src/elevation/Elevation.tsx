import './styles/elevation-styles.css';

export type ElevationProps = {}

export const Elevation = (_: ElevationProps) => {
  return (
      <div class="base-elevation md-elevation">
        <span class="shadow"></span>
      </div>
  );
};
