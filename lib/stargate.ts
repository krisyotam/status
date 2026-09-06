export type StargateWorkload = 'inference' | 'non-inference';

export type StargateRouteHealth = {
  inference: number | null;
  nonInference: number | null;
};

export type StargateMachine = {
  id: 'us-central-1' | 'us-central-2' | 'us-central-3';
  role: 'Server' | 'Local model';
  focus: StargateWorkload;
  endpoints: readonly StargateRouteHealth[];
};

export const STARGATE_ENDPOINTS = [
  'us-central-1.stargate',
  'us-central-2.stargate',
  'us-central-3.stargate',
] as const;

const serverEndpoints = STARGATE_ENDPOINTS.map(() => ({
  inference: null,
  nonInference: 100,
}));

const inferenceEndpoints = STARGATE_ENDPOINTS.map(() => ({
  inference: 100,
  nonInference: null,
}));

export const STARGATE_MACHINES: readonly StargateMachine[] = [
  {
    id: 'us-central-1',
    role: 'Server',
    focus: 'non-inference',
    endpoints: serverEndpoints,
  },
  {
    id: 'us-central-2',
    role: 'Server',
    focus: 'non-inference',
    endpoints: serverEndpoints,
  },
  {
    id: 'us-central-3',
    role: 'Local model',
    focus: 'inference',
    endpoints: inferenceEndpoints,
  },
];
