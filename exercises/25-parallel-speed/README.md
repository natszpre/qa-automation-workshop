# 25 · How many workers is too many?

**Slides:** 115–119 · **Time:** ~15 min · **Level:** ⭐ core

## Goal
Measure the effect of parallelism on run time and understand why more workers do not always mean faster.

## Task
1. Check how many CPU cores your computer has (Windows: Task Manager → Performance; macOS/Linux: `node -e "console.log(require('os').cpus().length)"`).
2. Run `catalog.spec.ts` with different settings and write down the time (last line of the output):

| Command | Time |
|---------|------|
| `npx playwright test 25-parallel --workers=1` | |
| `npx playwright test 25-parallel --workers=2` | |
| `npx playwright test 25-parallel --workers=4` | |
| `npx playwright test 25-parallel --workers=4 --fully-parallel` | |
| `npx playwright test 25-parallel --workers=16 --fully-parallel` | |

3. Answer:
   - Why does `--workers=4` **without** `--fully-parallel` not speed up this file?
   - What happens with 16 workers on your computer?
   - What must be true about the tests for `fullyParallel: true` to be safe? (Go back to exercise 14.)
4. (Bonus) Simulate CI sharding: `npx playwright test 25-parallel --shard=1/2` and `--shard=2/2`.

## Done when
The table is filled in and the answers have been discussed in the group.
