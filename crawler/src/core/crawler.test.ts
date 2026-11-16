import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { isRunning, runCrawl } from './crawler'
import { initDatabase } from '../infra/database'

const dataDir = process.env.DATA_DIR ?? ''
if (!dataDir.startsWith(os.tmpdir())) {
  throw new Error('DATA_DIR must be an isolated temporary directory')
}

void test('resets the running flag when crawl-job creation fails', async () => {
  const testDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'twitter-bookmark-hub-crawler-')
  )
  const db = initDatabase(path.join(testDir, 'db.sqlite'))

  try {
    db.exec(`
      CREATE TRIGGER fail_crawl_job_insert
      BEFORE INSERT ON crawl_jobs
      BEGIN
        SELECT RAISE(ABORT, 'simulated crawl-job insert failure');
      END
    `)

    await runCrawl(db)

    assert.equal(isRunning(), false)
  } finally {
    db.close()
    fs.rmSync(testDir, { recursive: true, force: true })
  }
})
