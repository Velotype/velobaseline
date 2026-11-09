import { DENIED } from "./deny_list.ts"
import type { DeniedFeature } from "./deny_list.ts"

/** A use of a feature that isn't Baseline widely available yet */
export type Finding = {
    file: string
    /** 1-based */
    line: number
    feature: string
    /** The line, trimmed */
    text: string
}

/** A line that is only a comment - prose about a feature, not a use of it */
function isCommentLine(line: string): boolean {
    const trimmed = line.trimStart()
    return trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")
}

/** Whether a line carries the enhancement marker: `// baseline-ok: <what happens without it>` */
function isMarked(line: string | undefined): boolean {
    return line !== undefined && /\/\/\s*baseline-ok:\s*\S/.test(line)
}

/**
 * The uses of denied features in one file's text. A comment line is prose and never matches. A line
 * may use a feature as an enhancement - the page works without it - when it says so in a JS comment,
 * `// baseline-ok: <what happens without it>`, at its end or on its own line directly above.
 */
export function checkSource(file: string, source: string, denied: readonly DeniedFeature[] = DENIED): Finding[] {
    const findings: Finding[] = []
    const lines = source.split("\n")
    lines.forEach((line, index) => {
        if (isCommentLine(line) || isMarked(line)) {return}
        const above = lines[index - 1]
        if (isMarked(above) && isCommentLine(above)) {return}
        for (const entry of denied) {
            if (entry.pattern.test(line)) {
                findings.push({file, line: index + 1, feature: entry.feature, text: line.trim()})
            }
        }
    })
    return findings
}

/** Script that runs: .ts, .tsx, .js and .jsx, but not a .d.ts file, whose declarations are types only and never reach a browser */
function isScript(path: string): boolean {
    return /\.(tsx?|jsx?)$/.test(path) && !/\.d\.(c|m)?ts$/.test(path)
}

/** The files to check: a file as given, or every script file under a directory (see isScript) */
export async function* sourceFiles(path: string): AsyncGenerator<string> {
    const info = await Deno.stat(path)
    if (info.isFile) {
        if (isScript(path)) {yield path}
        return
    }
    for await (const entry of Deno.readDir(path)) {
        // Generated and installed code is someone else's to check
        if (entry.name === "build" || entry.name === "build-prod" || entry.name === "output" || entry.name === "node_modules" || entry.name.startsWith(".")) {continue}
        yield* sourceFiles(`${path.replace(/\/+$/, "")}/${entry.name}`)
    }
}

/** Every use of a denied feature under the given files and directories */
export async function checkPaths(paths: readonly string[], denied: readonly DeniedFeature[] = DENIED): Promise<Finding[]> {
    const findings: Finding[] = []
    for (const path of paths) {
        for await (const file of sourceFiles(path)) {
            findings.push(...checkSource(file, await Deno.readTextFile(file), denied))
        }
    }
    return findings
}
