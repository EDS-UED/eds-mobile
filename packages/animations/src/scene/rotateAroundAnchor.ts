/** RN 旋转锚点（Desktop `transform-origin`）— 用于指针绕底端旋转。 */
export function rotateAroundBottomWorklet(degrees: number, height: number) {
  'worklet';
  return [
    { translateY: height / 2 },
    { rotate: `${degrees}deg` },
    { translateY: -height / 2 },
  ];
}