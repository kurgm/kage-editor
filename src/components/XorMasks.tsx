import { xorMaskTypes, xorMaskShapeMap } from "../xorMask";

const XorMasks = () => <>
  {xorMaskTypes.map((maskType) => (
    <path key={maskType} id={`xormask_${maskType}`} d={xorMaskShapeMap[maskType]} />
  ))}
</>

export default XorMasks;
