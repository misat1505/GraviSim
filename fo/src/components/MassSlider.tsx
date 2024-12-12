import { Body } from "../types/Body";

type MassSliderProps = React.HTMLAttributes<HTMLInputElement> & {
  body: Body;
};

const MassSlider = ({ body, ...rest }: MassSliderProps) => {
  return (
    <div>
      <label>{body.name}: </label>
      <input type="range" min="0.1" max="10" step="0.1" {...rest} />
    </div>
  );
};

export default MassSlider;
