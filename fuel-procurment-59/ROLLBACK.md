# Pre-React rollback — 28 September 2026

Restored all eight HTML pages and their JavaScript/CSS dependencies from `references/legacy-prototype/`. This is the snapshot immediately before the React migration, including the dispatch startup brace fix. It retains the connected dispatch workflow that existed at that time. Later React screen redesigns and receipt revisions are removed.

## Active source

Edit the root HTML, JavaScript and CSS files directly. `index.html` is the canonical entry. `npm run build` copies only the legacy application files into `dist/`; it does not compile React. `npm run dev` serves the project on localhost:5173. Camera access requires browser permission and HTTPS or localhost.

Vercel continues publishing only `dist/`, using the existing `.vercelignore` and `vercel.json`. Backups and source notes are excluded from publication.

## Preserved backup

`backups/pre-rollback-react/` contains the React source, app template, tests, original build scripts and package configuration, compiled output, root entries and notes. The original legacy snapshot is unchanged. Installed dependencies were left in place but are unused by the static application.

To recover React, first archive any newer static edits, then copy the backed-up source directories, configuration, HTML entries and assets back to their original paths. Restore its package.json and package-lock.json together, then use its original build instructions. Do not deploy an old dist folder without intentionally choosing that version.

## Data and limits

No browser storage was cleared or migrated. The production domain and legacy storage keys are retained. Fields introduced by later versions may not appear in the older interface. This rollback does not restore or delete browser records. The isolated latest #157 sample remains stored but is not used by the older screens.

Legacy input JavaScript passed syntax checks and its HTML local dependency references resolved before restoration. No visual, camera or physical printer verification was performed; screenshots remain deferred.

Historical decision notes describe work across versions and may contain later additions; the restored root source is the active baseline. The prior React notes are preserved in the backup.

Deployment status is recorded in DEPLOYMENT.md.
