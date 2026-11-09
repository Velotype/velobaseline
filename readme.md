# velobaseline

Refuses web features that aren't [Baseline](https://web.dev/baseline) "widely available" yet (in Chrome, Edge, Firefox and Safari for at least 30 months) in the code a browser runs.

Velotype's packages, and the apps built on them, ship their source to browsers without rewriting it: `deno bundle` has no target, so syntax, the CSS in stylesheet strings and DOM calls arrive exactly as written. A feature one browser lacks is broken for that browser's readers. This package holds the one list of features we don't use yet, so every repository checks against the same list, in CI, pinned to a version.

## Use

```sh
deno run --allow-read jsr:@velotype/velobaseline@0.1.1 src/ showcase/src/
```

It checks every `.ts`, `.tsx`, `.js` and `.jsx` file under the paths given, except `.d.ts` declarations (types only, they never reach a browser), skipping `build`, `build-prod`, `output`, `node_modules` and hidden directories. Each use is printed with its file and line, and it exits 1 if it finds any.

Deno won't download a version less than 24 hours old (its minimum dependency age), so moving CI to a new version waits a day after its release.

A feature may be used as an enhancement when the page works without it. Say so in a JS comment at the end of the line, or on its own line directly above:

```ts
el.moveBefore(node, ref) // baseline-ok: older browsers get insertBefore, which resets focus
```

Always use a JS comment, which a minifier drops. Never put a CSS comment inside a stylesheet string, because it ships. In a stylesheet, end the string before the line and put the comment between the two parts.

Comment lines are prose and never match, so writing about a feature is fine.

From code:

```ts
import { checkPaths, checkSource, DENIED } from "jsr:@velotype/velobaseline"

const findings = await checkPaths(["src/"])
```

## The list

`src/deny_list.ts` is a deny-list, not a full checker. It names features that are easy to reach for and not yet in every engine for long enough, as code uses them. It's revised from MDN's Baseline data now and then:

- an entry comes off once its feature is widely available;
- a new tempting one goes on.

Each revision is a new version, so repositories move to it on purpose.
