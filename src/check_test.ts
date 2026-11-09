import { assertEquals } from "@std/assert"
import { checkPaths, checkSource } from "./check.ts"
import { DENIED } from "./deny_list.ts"

Deno.test("a denied feature in code is found, with its file, line and feature", () => {
    const found = checkSource("a.ts", "const x = 1\nrequestIdleCallback(() => {})\n")
    assertEquals(found, [{file: "a.ts", line: 2, feature: "requestIdleCallback", text: "requestIdleCallback(() => {})"}])
})

Deno.test("CSS in a stylesheet string is checked like code", () => {
    const found = checkSource("s.ts", "mountStyles(`.x{anchor-name:--a;}`)")
    assertEquals(found.map(f => f.feature), ["CSS anchor positioning"])
})

Deno.test("prose in a comment line never matches", () => {
    assertEquals(checkSource("c.ts", "// requestIdleCallback( would be nicer\n * Temporal.Now is coming\n/* @scope later */"), [])
})

Deno.test("an enhancement marked on its own line, or on the line above, is allowed", () => {
    assertEquals(checkSource("m.ts", "el.moveBefore(a, b) // baseline-ok: falls back to insertBefore below"), [])
    assertEquals(checkSource("m.ts", "// baseline-ok: the page scrolls without it\nconst s = `text-wrap: pretty`"), [])
})

Deno.test("a marker needs a reason, and only covers the line it's on or the one after", () => {
    assertEquals(checkSource("m.ts", "el.moveBefore(a, b) // baseline-ok:").length, 1)
    assertEquals(checkSource("m.ts", "// baseline-ok: one line only\nconst a = 1\nel.moveBefore(a, b)").length, 1)
})

Deno.test("what's widely available is never on the list", () => {
    // Each was once tempting and is now in every engine for long enough; it must not come back by mistake
    for (const fine of ["structuredClone(x)", "arr.at(-1)", "Object.groupBy(xs, f)", "el.checkVisibility()", ".x:has(.y){}", "@container (min-width: 1px){}", "dialog.showModal()"]) {
        assertEquals(checkSource("ok.ts", fine), [], fine)
    }
})

Deno.test("every entry names its feature, and no two say the same", () => {
    assertEquals(new Set(DENIED.map(d => d.feature)).size, DENIED.length)
    for (const d of DENIED) {assertEquals(d.feature.trim().length > 0, true)}
})

Deno.test("a directory is walked for script files, skipping generated and hidden ones", async () => {
    const dir = await Deno.makeTempDir()
    await Deno.mkdir(`${dir}/src`)
    await Deno.mkdir(`${dir}/build`)
    await Deno.mkdir(`${dir}/.cache`)
    await Deno.writeTextFile(`${dir}/src/a.tsx`, "Promise.try(f)\n")
    await Deno.writeTextFile(`${dir}/src/b.css`, "@scope (.x) {}\n")
    await Deno.writeTextFile(`${dir}/build/out.js`, "Promise.try(f)\n")
    await Deno.writeTextFile(`${dir}/.cache/c.ts`, "Promise.try(f)\n")
    const found = await checkPaths([`${dir}/`])
    assertEquals(found.map(f => f.file.replace(dir, "")), ["/src/a.tsx"], "a trailing slash on the path doesn't double up in the file names")
    await Deno.remove(dir, {recursive: true})
})
