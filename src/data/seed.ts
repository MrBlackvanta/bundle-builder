import type { BuilderState } from "../state/reducer";

export const seedState: BuilderState = {
  quantities: {
    "wyze-cam-v4": { white: 1 },
    "wyze-cam-pan-v3": { white: 2 },
    "wyze-sense-motion-sensor": { default: 2 },
    "wyze-sense-hub": { default: 1 },
    "wyze-microsd-256": { default: 2 },
    "plan-cam-unlimited": { default: 1 },
  },
  activeVariant: {},
  openStepId: "cameras",
};
