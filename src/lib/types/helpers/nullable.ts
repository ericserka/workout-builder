import * as t from "io-ts"

export const Nullable = <C extends t.Mixed>(codec: C) =>
  t.union([codec, t.null])
