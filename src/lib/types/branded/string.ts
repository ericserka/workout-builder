import * as tt from "io-ts-types"
import * as t from "io-ts"

// Codecs

export const FriendlyNonEmptyString = tt.withMessage(tt.NonEmptyString, () => "Required")

// Types

export type FriendlyNonEmptyString = t.TypeOf<typeof FriendlyNonEmptyString>
