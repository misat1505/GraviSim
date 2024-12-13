export type Body = {
  name: string;
  mass: number;
  position: [number, number];
  velocity: [number, number];
  size: number;
  trace: [number, number][];
  color: string;
  isShowingTrace: boolean;
};
