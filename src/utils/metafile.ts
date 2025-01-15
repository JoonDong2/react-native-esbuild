import type { Metafile } from 'esbuild';

interface Inputs {
  [path: string]: {
    bytesInOutput: number;
  };
}

export const extractInputs = (metafile?: Metafile): Inputs | undefined => {
  const outputs = metafile?.outputs;
  if (!outputs) return;
  const first = Object.getOwnPropertyNames(outputs)[0];
  if (!first) return;

  return outputs[first]?.inputs;
};

export const updateInputs = (base: Inputs, update: Inputs) => {
  Object.assign(base, update);
  return base;
};
