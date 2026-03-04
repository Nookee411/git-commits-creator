import { Command, Options } from "@effect/cli"
import { Command as ExecuteCommand, FileSystem } from "@effect/platform"
import { Console, DateTime, Duration, Effect, Random } from "effect"
import { GitError } from "./errors.js"

const MAIN_FILE = "Main.MD"

const daysBefore = Options.integer("days-before").pipe(Options.withDefault(365), Options.withAlias("db"))
const daysAfter = Options.integer("days-after").pipe(Options.withDefault(60), Options.withAlias("da"))
const frequency = Options.integer("frequency").pipe(Options.withDefault(80), Options.withAlias("f"))
const maxCommitsPerDay = Options.integer("max-commits-per-day").pipe(Options.withDefault(15), Options.withAlias("mcpd"))
const minCommitsPerDay = Options.integer("min-commits-per-day").pipe(Options.withDefault(0), Options.withAlias("mcpd"))

const command = Command.make("hello", { daysBefore, daysAfter, frequency, maxCommitsPerDay, minCommitsPerDay }, ({
  daysAfter,
  daysBefore,
  frequency,
  maxCommitsPerDay,
  minCommitsPerDay
}) =>
  Effect.gen(function*() {
    const repositoryPath = yield* initRepository
    const firstDate = yield* DateTime.now.pipe(Effect.map(DateTime.subtractDuration(Duration.days(daysBefore))))
    const totalDays = daysAfter + daysBefore

    for (let i = 0; i < totalDays; i++) {
      const commitDate = firstDate.pipe(DateTime.addDuration(Duration.days(i)))
      if ((yield* Random.nextIntBetween(1, 100)) > frequency) {
        continue
      }
      const commitsPerDay = yield* Random.nextIntBetween(minCommitsPerDay, maxCommitsPerDay)
      yield* Effect.repeatN(commitForTheDay(repositoryPath, commitDate), commitsPerDay)
    }

    return
  }))

const commitForTheDay = (repositoryPath: string, date: DateTime.DateTime) =>
  Effect.gen(function*() {
    const mainFilePath = `${repositoryPath}/${MAIN_FILE}`
    yield* appendFile(mainFilePath, `${DateTime.formatUtc(date)}\n`)
    yield* commit(repositoryPath, date)
  })

const initRepository = Effect.gen(function*() {
  const now = yield* DateTime.now
  const repositoryName = `repository-name-${DateTime.formatIso(now)}`
  const repositoryPath = `./repositories/${repositoryName}`
  const fs = yield* FileSystem.FileSystem
  yield* fs.makeDirectory(repositoryPath, {
    recursive: true
  })
  const repositoryCwd = ExecuteCommand.workingDirectory(repositoryPath)
  const gitInitCommand = ExecuteCommand.make("git", "init").pipe(repositoryCwd)
  const result = yield* gitInitCommand.pipe(ExecuteCommand.string)
  yield* Console.log(result)
  if (!result.startsWith("Initialized empty Git repository")) {
    return yield* new GitError({
      message: "Unable to initialize git repository"
    })
  }
  yield* appendFile(`${repositoryPath}/${MAIN_FILE}`, `# INITIAL\n`)

  return repositoryPath
})

const commit = (repositoryPath: string, date: DateTime.DateTime) =>
  Effect.gen(function*() {
    const stageAllCommand = ExecuteCommand.make("git", "add", ".").pipe(
      ExecuteCommand.workingDirectory(repositoryPath)
    )
    const dateStr = DateTime.format(date, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })

    const commitCommand = ExecuteCommand.make(
      "git",
      "commit",
      "-m",
      `"Commit for date ${DateTime.formatUtc(date)}"`,
      "--date",
      dateStr
    )
      .pipe(
        ExecuteCommand.workingDirectory(repositoryPath)
      )
    yield* stageAllCommand.pipe(ExecuteCommand.string)
    const _commitResult = yield* commitCommand.pipe(ExecuteCommand.string)
    yield* Console.log(_commitResult)
  })

const appendFile = (filePath: string, text: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    yield* fs.writeFileString(
      filePath,
      text,
      {
        flag: "a"
      }
    )
  })

export const run = Command.run(command, {
  name: "Hello World",
  version: "0.0.0"
})
