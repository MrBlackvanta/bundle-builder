import type { BuilderState } from '../types';

/**
 * Initial configuration matching the Figma design on first load:
 * 2 cameras selected, the seeded sensors/accessory, and the Cam Unlimited plan.
 */
export const seedState: BuilderState = {
  quantities: {
    'wyze-cam-v4': { white: 1 },
    'wyze-cam-pan-v3': { white: 2 },
    'wyze-sense-motion-sensor': { default: 2 },
    'wyze-sense-hub': { default: 1 },
    'wyze-microsd-256': { default: 2 },
    'plan-cam-unlimited': { default: 1 },
  },
  activeVariant: {},
  openStepId: 'cameras',
};
