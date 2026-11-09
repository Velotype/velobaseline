/**
 * velobaseline: refuses web features that aren't Baseline "widely available" yet, in the code a
 * browser runs.
 *
 * Nothing between Velotype's source and a browser rewrites it - `deno bundle` has no target - so
 * the syntax, the CSS in every stylesheet string and the DOM calls ship exactly as written. A
 * feature one browser lacks is broken for that browser's readers, and a test suite that drives one
 * browser doesn't notice. Every repository that ships code to a browser runs this in CI, pinned to a
 * version, so the list is kept in one place:
 *
 *     deno run --allow-read jsr:@velotype/velobaseline@<version> src/ showcase/src/
 *
 * It exits 1, listing each use, when it finds any. A use that's only an enhancement - the page works
 * without it - says so in a JS comment, at the end of its line or on its own line directly above:
 * `// baseline-ok: <what happens without it>`. Always a JS comment, which a minifier drops; never a
 * CSS comment inside a stylesheet string, which would ship.
 *
 * @module
 */
import { checkPaths } from "./src/check.ts"

export { checkPaths, checkSource, sourceFiles } from "./src/check.ts"
export type { Finding } from "./src/check.ts"
export { DENIED } from "./src/deny_list.ts"
export type { DeniedFeature } from "./src/deny_list.ts"

/** Runs the check over the paths given on the command line; exits 1 when anything is found */
export async function main(paths: readonly string[]): Promise<number> {
    if (paths.length === 0) {
        console.error("Name the files or directories to check: deno run --allow-read jsr:@velotype/velobaseline <path>...")
        return 2
    }
    const findings = await checkPaths(paths)
    for (const f of findings) {
        console.error(`${f.file}:${f.line}: ${f.feature} is not Baseline widely available yet\n    ${f.text}`)
    }
    if (findings.length > 0) {
        console.error(`\n${findings.length} use${findings.length === 1 ? "" : "s"} of features not every browser has had long enough. Use something older, or - when the page works without it - say so in a JS comment, at the end of the line or on its own line above it: // baseline-ok: <what happens without it> (never a CSS comment in a stylesheet string - that ships).`)
        return 1
    }
    console.log("ok   only Baseline widely available features (by @velotype/velobaseline's deny-list)")
    return 0
}

if (import.meta.main) {
    Deno.exit(await main(Deno.args))
}
