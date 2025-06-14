import {BaseEdge, getSmoothStepPath, type EdgeProps} from '@xyflow/react';

export function AnimatedSVGEdge({
                                  id,
                                  sourceX,
                                  sourceY,
                                  targetX,
                                  targetY,
                                  sourcePosition,
                                  targetPosition,
                                }: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} fill="none" stroke="#b1b1b7" strokeWidth={2}/>
      <polygon points="-5,5 0,-2.5 0,2.5 5,-5">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath}/>
      </polygon>
    </>
  );
}