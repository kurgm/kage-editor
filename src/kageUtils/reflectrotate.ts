export enum ReflectRotateType {
  reflectX,
  reflectY,
  rotate90,
  rotate180,
  rotate270,
}

export const reflectRotateTypes = [
  ReflectRotateType.reflectX,
  ReflectRotateType.reflectY,
  ReflectRotateType.rotate90,
  ReflectRotateType.rotate180,
  ReflectRotateType.rotate270,
];

export const reflectRotateTypeParamsMap: Record<ReflectRotateType, [number, number]> = {
  [ReflectRotateType.reflectX]: [98, 0],
  [ReflectRotateType.reflectY]: [97, 0],
  [ReflectRotateType.rotate90]: [99, 1],
  [ReflectRotateType.rotate180]: [99, 2],
  [ReflectRotateType.rotate270]: [99, 3],
};
