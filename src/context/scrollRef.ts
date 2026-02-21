// A plain mutable ref shared between the React scroll tracker
// and the R3F frame loop. No re-render trigger.
export const scrollProgressRef = { current: 0 };
