import assert from 'node:assert/strict'
import test from 'node:test'
import { getCrawlJobCompletionStatus } from './crawler'

void test('all failed accounts produce an error crawl job', () => {
  assert.equal(getCrawlJobCompletionStatus(0), 'error')
})

void test('at least one successful account produces a successful crawl job', () => {
  assert.equal(getCrawlJobCompletionStatus(1), 'success')
})
