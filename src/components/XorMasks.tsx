import * as React from "react";
import { xorMaskTypes, xorMaskShapeMap } from "../xorMask";

const XorMasks = () => <>
  {xorMaskTypes.map((maskType) => (
    <path id={`xormask_${maskType}`} d={xorMaskShapeMap[maskType]} />
  ))}
</>

export default XorMasks;
