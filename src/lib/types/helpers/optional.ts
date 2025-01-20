import * as t from "io-ts"

export const Optional = <C extends t.Mixed>(codec: C) =>
  t.union([codec, t.undefined])
