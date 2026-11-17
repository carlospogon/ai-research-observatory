# Atlas integration regression checklist

This branch is a **staging integration**, not a production release.

## Original laboratory compatibility

- Open `legacy-labs.html?lab=safety`; confirm LEASH is visible and the Evaluate action responds.
- Repeat with each exact lab ID: `science`, `learning`, `abstention`, `mri`, `structrl`, `codeexplain`, `guardscope`, `hindsight`, `termination`, `foam`, `pear`, `weightbench`, `concertina`, `soteria`, `fingerprints`.
- Confirm every original lab script in `assets/` loads without a console error.
- Verify every laboratory control updates its associated visualization or result.
- Verify the quiz contains 16 questions and the research catalog contains 16 approved records.
- Verify desktop and mobile widths; keyboard focus and reduced-motion behavior.

## Important limitation

The approved new Atlas HTML is not yet committed as `index.html`. The current branch adds an isolated, query-selectable copy of the legacy laboratories only. Do not merge this branch until the approved Atlas is integrated and browser regression tests pass.
