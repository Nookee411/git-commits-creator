import { Data } from "effect"

export class GitError extends Data.TaggedError("GitError")<{
  message: string
}> {
  readonly _tag = "GitError"
}
