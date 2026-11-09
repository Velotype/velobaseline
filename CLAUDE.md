# velobaseline

The one deny-list of web features that aren't Baseline "widely available" yet, and the checker every repository that ships code to a browser runs in CI (velodesign, velochart, velotype, velojson, velomicro, velomini, velodevtools, velotype.github.io, nymbislith). Pinned by version in each.

- **Changing the list is a new version**, and each repository moves to it in its own pull request. A new entry can break a repository's CI on its next bump, which is the point: it's found there, not in a reader's browser.
- **An entry names the feature the way code uses it**, so prose in comments doesn't match. Every entry has a test that it's caught, through `checkSource`, and the "never on the list" test holds features that are widely available now.
- **Revise from MDN's Baseline data**: take an entry off once its feature has been widely available (30 months in all four engines), and add a feature that's tempting and isn't.
- `deno task test` and `deno publish --dry-run` - CI runs both. The package doesn't check itself: it never runs in a browser, and its source is the list. Publishing is the manual `publish.yml`.
