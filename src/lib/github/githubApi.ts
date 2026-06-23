import { DEFAULT_REPO_NAME, STATE_FILE_PATH, GitHubSyncError } from './types'

const API = 'https://api.github.com'

function authHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `token ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function parseGitHubError(res: Response): Promise<never> {
  if (res.status === 401 || res.status === 403) {
    throw new GitHubSyncError(
      'GitHub rejected this token. Check that it has the repo scope and is still valid.',
      'auth',
    )
  }
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get('X-RateLimit-Remaining')
    if (remaining === '0') {
      throw new GitHubSyncError(
        'GitHub rate limit reached. Try again in a few minutes.',
        'rate_limit',
      )
    }
  }
  let detail = res.statusText
  try {
    const body = (await res.json()) as { message?: string }
    if (body.message) detail = body.message
  } catch {
    /* ignore */
  }
  throw new GitHubSyncError(detail || 'GitHub request failed', 'unknown')
}

export interface GitHubUser {
  login: string
}

export async function validateToken(token: string): Promise<GitHubUser> {
  const res = await fetch(`${API}/user`, { headers: authHeaders(token) })
  if (!res.ok) await parseGitHubError(res)
  return (await res.json()) as GitHubUser
}

export async function ensurePrivateRepo(
  token: string,
  username: string,
  repoName = DEFAULT_REPO_NAME,
): Promise<void> {
  const res = await fetch(
    `${API}/repos/${username}/${encodeURIComponent(repoName)}`,
    { headers: authHeaders(token) },
  )
  if (res.status === 404) {
    const create = await fetch(`${API}/user/repos`, {
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: repoName,
        private: true,
        description: 'KAGE shadow mastery vault — private sync for your discipline data',
        auto_init: true,
      }),
    })
    if (!create.ok) await parseGitHubError(create)
    return
  }
  if (!res.ok) await parseGitHubError(res)
}

export interface RemoteStateFile {
  content: string
  sha: string
  updatedAt: string
}

export async function fetchRemoteState(
  token: string,
  username: string,
  repoName: string,
): Promise<RemoteStateFile | null> {
  const path = encodeURIComponent(STATE_FILE_PATH)
  const res = await fetch(
    `${API}/repos/${username}/${repoName}/contents/${path}`,
    { headers: authHeaders(token) },
  )
  if (res.status === 404) return null
  if (!res.ok) await parseGitHubError(res)

  const data = (await res.json()) as {
    content: string
    sha: string
  }
  const content = atob(data.content.replace(/\n/g, ''))
  let updatedAt = new Date().toISOString()
  try {
    const parsed = JSON.parse(content) as { exportedAt?: string }
    if (parsed.exportedAt) updatedAt = parsed.exportedAt
  } catch {
    /* ignore */
  }
  return { content, sha: data.sha, updatedAt }
}

export async function pushRemoteState(
  token: string,
  username: string,
  repoName: string,
  json: string,
  existingSha?: string,
): Promise<{ sha: string; syncedAt: string }> {
  const syncedAt = new Date().toISOString()
  const message = `KAGE sync: ${syncedAt}`
  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(json))),
  }
  if (existingSha) body.sha = existingSha

  const path = encodeURIComponent(STATE_FILE_PATH)
  const res = await fetch(
    `${API}/repos/${username}/${repoName}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) await parseGitHubError(res)
  const result = (await res.json()) as { content: { sha: string } }
  return { sha: result.content.sha, syncedAt }
}
