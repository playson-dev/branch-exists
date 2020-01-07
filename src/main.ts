import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const repository: string = core.getInput('repository')
    const [owner = null, repo = null] = repository.split('/')
    const branch: string = core.getInput('branch')
    const token: string = core.getInput('token') || ''
    core.debug(`Checking branch ${owner}/${repo}#${branch}`)

    if (!branch) {
      throw new Error('Input "branch" must be set')
    }

    if (!repository) {
      throw new Error('Input "repository" must be set')
    }

    if (owner === null || repo === null) {
      throw new Error(
        'Failed to parse input "repository". Must be on format: owner/repo'
      )
    }

    try {
      const gh = new github.GitHub(token)
      const branchInfo = await gh.repos.getBranch({
        repo,
        branch,
        owner
      })
      core.debug(`Found branch ${branchInfo}`)
      core.setOutput('exists', 'true')
      return
    } catch (e) {
      if (e.message === 'Branch not found') {
        core.setOutput('exists', 'false')
        return
      }
      throw new Error(`Failed to get branch: ${e.message}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
