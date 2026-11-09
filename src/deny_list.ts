/**
 * The web features Velotype's packages and the apps built on them don't use yet: not Baseline
 * "widely available" (in Chrome, Edge, Firefox and Safari for at least 30 months).
 *
 * This is a deny-list, not a full checker: the features listed are ones that are easy to reach for
 * and not yet in every engine for long enough. It is revised now and then from MDN's Baseline data -
 * an entry comes off once its feature is widely available, and a new tempting one goes on - and each
 * revision is a new version of this package, so every repository moves to it on purpose.
 */

/** One feature that isn't Baseline widely available yet, matched the way code uses it */
export type DeniedFeature = {pattern: RegExp, feature: string}

/**
 * Not Baseline widely available as of 2026-11. Patterns name the feature the way code uses it,
 * so prose about it in a comment doesn't match - comment lines are skipped as well.
 */
export const DENIED: DeniedFeature[] = [
    // CSS
    {pattern: /\b(anchor-name|position-anchor|position-area|position-try(-fallbacks|-order)?)\s*:|\banchor\(/, feature: "CSS anchor positioning"},
    {pattern: /@scope\b/, feature: "CSS @scope"},
    {pattern: /@starting-style\b/, feature: "CSS @starting-style"},
    {pattern: /\btransition-behavior\s*:|\ballow-discrete\b/, feature: "CSS transition-behavior (discrete transitions)"},
    {pattern: /@property\b/, feature: "CSS @property"},
    {pattern: /\bfield-sizing\s*:/, feature: "CSS field-sizing"},
    {pattern: /\binterpolate-size\s*:|\bcalc-size\(/, feature: "CSS interpolate-size / calc-size()"},
    {pattern: /:state\(/, feature: "CSS :state() (custom states)"},
    {pattern: /@container\s+style\(/, feature: "CSS container style queries"},
    {pattern: /\bview-transition-name\s*:|@view-transition\b|\bstartViewTransition\(/, feature: "View transitions"},
    {pattern: /::details-content\b/, feature: "CSS ::details-content"},
    {pattern: /\bappearance\s*:\s*base-select\b/, feature: "Customizable <select> (appearance: base-select)"},
    {pattern: /\btext-wrap\s*:\s*pretty\b/, feature: "CSS text-wrap: pretty"},
    {pattern: /\bscroll-state\(|\bsibling-(index|count)\(|\breading-flow\s*:|@function\b/, feature: "Recent CSS (scroll-state, sibling-index, reading-flow, @function)"},
    // JavaScript and the DOM
    {pattern: /\brequestIdleCallback\(/, feature: "requestIdleCallback"},
    {pattern: /\bscheduler\.(postTask|yield)\(/, feature: "The Prioritized Task Scheduling API"},
    {pattern: /\bnavigation\.(navigate|addEventListener|currentEntry)\b/, feature: "The Navigation API"},
    {pattern: /\bCloseWatcher\b|\.requestClose\(/, feature: "CloseWatcher / dialog.requestClose()"},
    {pattern: /\.moveBefore\(/, feature: "Element.moveBefore()"},
    {pattern: /\b(commandfor|interestfor)\b|\bhidden\s*=\s*["']until-found["']|\bbeforematch\b/, feature: "Invoker commands, interest invokers, hidden=until-found"},
    {pattern: /\bTemporal\./, feature: "Temporal"},
    {pattern: /\.(union|intersection|symmetricDifference|isSubsetOf|isSupersetOf|isDisjointFrom)\(/, feature: "Set methods (union, intersection, ...)"},
    {pattern: /\bPromise\.try\(/, feature: "Promise.try()"},
    {pattern: /\bIterator\.(from|prototype)\b/, feature: "Iterator helpers"},
    {pattern: /\bRegExp\.escape\(/, feature: "RegExp.escape()"},
    {pattern: /\bUint8Array\.fromBase64\(|\.toBase64\(|\bfromHex\(/, feature: "Uint8Array base64 / hex"},
    {pattern: /\bError\.isError\(|\bMath\.sumPrecise\(|\bFloat16Array\b/, feature: "Error.isError(), Math.sumPrecise(), Float16Array"},
    {pattern: /\bIntl\.DurationFormat\b/, feature: "Intl.DurationFormat"},
    {pattern: /\bURL\.parse\(/, feature: "URL.parse() (use new URL() in a try)"},
]
