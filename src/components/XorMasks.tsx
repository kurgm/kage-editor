// SPDX-License-Identifier: GPL-3.0-only
// Copyright 2020, 2023  kurgm

import { xorMaskTypes, xorMaskShapeMap } from "../xorMask";

const XorMasks = () => <>
  {xorMaskTypes.map((maskType) => (
    <path key={maskType} id={`xormask_${maskType}`} d={xorMaskShapeMap[maskType]} />
  ))}
</>

export default XorMasks;
