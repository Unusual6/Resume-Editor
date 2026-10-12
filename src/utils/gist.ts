/**
 * GitHub Gist API utility for cloud sync.
 * Stores resume data as a secret Gist tied to the user's GitHub account.
 * Token is stored in localStorage and only used for this user's browser.
 */

const GIST_API = 'https://api.github.com/gists';
const TOKEN_KEY = 'resume-github-token';
const GIST_ID_KEY = 'resume-gist-id';
const GIST_FILENAME = 'resume-data.json';

export interface GistSyncResult {
  success: boolean;
  message: string;
  gistId?: string;
}

// --- Token management ---
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(GIST_ID_KEY);
}

export function getGistId(): string | null {
  return localStorage.getItem(GIST_ID_KEY);
}

function setGistId(id: string) {
  localStorage.setItem(GIST_ID_KEY, id);
}

// --- API calls ---
async function gistRequest(
  url: string,
  options: RequestInit,
  token: string
): Promise<Response> {
  const resp = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return resp;
}

/**
 * Verify token is valid by calling /user endpoint.
 */
export async function verifyToken(token: string): Promise<{ ok: boolean; login?: string; message?: string }> {
  try {
    const resp = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!resp.ok) {
      if (resp.status === 401) return { ok: false, message: 'Token invalid or expired' };
      return { ok: false, message: `GitHub API error: ${resp.status}` };
    }
    const data = await resp.json();
    return { ok: true, login: data.login };
  } catch (e: any) {
    return { ok: false, message: e.message || 'Network error' };
  }
}

/**
 * Upload all resume entries to a secret Gist.
 * Creates a new Gist if none exists, otherwise updates the existing one.
 */
export async function uploadToGist(
  entriesJson: string,
  token: string,
  existingGistId?: string
): Promise<GistSyncResult> {
  try {
    const body = {
      description: 'Resume Editor - Cloud Sync Data',
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: entriesJson,
        },
      },
    };

    if (existingGistId) {
      // Update existing gist
      const resp = await gistRequest(`${GIST_API}/${existingGistId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }, token);

      if (!resp.ok) {
        // If gist was deleted, create new one
        if (resp.status === 404) {
          return uploadToGist(entriesJson, token);
        }
        return { success: false, message: `Update failed: ${resp.status}` };
      }

      const data = await resp.json();
      return { success: true, message: 'Updated', gistId: data.id };
    }

    // Create new gist
    const resp = await gistRequest(GIST_API, {
      method: 'POST',
      body: JSON.stringify(body),
    }, token);

    if (!resp.ok) {
      return { success: false, message: `Create failed: ${resp.status}` };
    }

    const data = await resp.json();
    setGistId(data.id);
    return { success: true, message: 'Created', gistId: data.id };
  } catch (e: any) {
    return { success: false, message: e.message || 'Network error' };
  }
}

/**
 * Download resume entries from a Gist.
 */
export async function downloadFromGist(
  token: string,
  gistId: string
): Promise<{ success: boolean; data?: string; message?: string }> {
  try {
    const resp = await gistRequest(`${GIST_API}/${gistId}`, {
      method: 'GET',
    }, token);

    if (!resp.ok) {
      if (resp.status === 404) {
        return { success: false, message: 'Gist not found' };
      }
      return { success: false, message: `Download failed: ${resp.status}` };
    }

    const data = await resp.json();
    const file = data.files?.[GIST_FILENAME];
    if (!file) {
      return { success: false, message: 'Resume data file not found in Gist' };
    }

    return { success: true, data: file.content };
  } catch (e: any) {
    return { success: false, message: e.message || 'Network error' };
  }
}

/**
 * Find an existing resume Gist by searching user's gists.
 */
export async function findResumeGist(token: string): Promise<string | null> {
  try {
    let page = 1;
    while (page <= 3) {
      const resp = await fetch(`${GIST_API}?per_page=100&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      });
      if (!resp.ok) break;
      const gists: any[] = await resp.json();
      if (gists.length === 0) break;

      const found = gists.find(g => g.files?.[GIST_FILENAME]);
      if (found) return found.id;
      if (gists.length < 100) break;
      page++;
    }
    return null;
  } catch {
    return null;
  }
}
