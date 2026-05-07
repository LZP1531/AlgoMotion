export interface CurvePoint {
  x: number;
  y: number;
}

export function verticalCurvePath(from: CurvePoint, to: CurvePoint, offset = 5) {
  const startY = from.y + offset;
  const endY = to.y - offset;
  const controlY = (startY + endY) / 2;

  return `M ${from.x} ${startY} C ${from.x} ${controlY} ${to.x} ${controlY} ${to.x} ${endY}`;
}

