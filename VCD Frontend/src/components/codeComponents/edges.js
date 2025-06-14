import { AnimatedSVGEdge } from './AnimatedSVGEdge';

export const edgeTypes = {
  animatedSvg: AnimatedSVGEdge
};

export const initialEdges = [
  { id: 'e1-2', source: '0', target: '1', targetHandle: 'input-1', type: 'animatedSvg' },
  { id: 'e1-1', source: '3', target: '1', targetHandle: 'input-2', type: 'animatedSvg' },
  { id: 'e1-3', source: '1', target: '2', targetHandle: 'input-1', type: 'animatedSvg' },
];