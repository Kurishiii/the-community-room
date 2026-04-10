// ─────────────────────────────────────────────────────────────
// CROSS-DEVICE EVENT SYNC via GitHub API
//
// HOW TO SET UP (one-time, 2 minutes):
// 1. Go to: https://github.com/settings/tokens/new
// 2. Give it any name (e.g. "Community Room Admin")
// 3. Under "Repository permissions" → Contents → Read and Write
// 4. Click "Generate token" and copy it
// 5. Paste it below where it says PASTE_YOUR_TOKEN_HERE
//
// NOTE: This token only allows editing files in this one repo.
// ─────────────────────────────────────────────────────────────

// Token is entered by the admin at login and stored in sessionStorage only.
// It is never saved to disk or committed to the repo.
const GITHUB_TOKEN = sessionStorage.getItem('adm_gh_token') || '';
const GITHUB_REPO  = 'Kurishiii/the-community-room';
const DATA_FILE    = 'events-data.json';
const API_BASE     = `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE}`;

async function githubReadData() {
  try {
    const res = await fetch(API_BASE + '?t=' + Date.now());
    if (!res.ok) throw new Error('GitHub read failed');
    const json = await res.json();
    const data = JSON.parse(atob(json.content.replace(/\n/g, '')));
    // Cache locally as fallback
    localStorage.setItem('uc_github_cache', JSON.stringify(data));
    localStorage.setItem('uc_github_sha', json.sha);
    return { data, sha: json.sha };
  } catch (e) {
    console.warn('GitHub read failed, using local cache:', e.message);
    const cached = localStorage.getItem('uc_github_cache');
    return {
      data: cached ? JSON.parse(cached) : { calendar_events: {}, page_events: [] },
      sha: localStorage.getItem('uc_github_sha') || ''
    };
  }
}

async function githubWriteData(data, sha) {
  if (!GITHUB_TOKEN || GITHUB_TOKEN === 'PASTE_YOUR_TOKEN_HERE') {
    // No token set — fall back to localStorage only
    localStorage.setItem('uc_github_cache', JSON.stringify(data));
    localStorage.setItem('uc_owner_events', JSON.stringify(data.calendar_events));
    localStorage.setItem('uc_events_page',  JSON.stringify(data.page_events));
    return true;
  }
  try {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const body = { message: 'Update events data', content };
    if (sha) body.sha = sha;

    const res = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('GitHub write failed: ' + res.status);
    const json = await res.json();
    localStorage.setItem('uc_github_cache', JSON.stringify(data));
    localStorage.setItem('uc_github_sha', json.content.sha);
    // Keep localStorage keys in sync so book.html calendar still works
    localStorage.setItem('uc_owner_events', JSON.stringify(data.calendar_events));
    localStorage.setItem('uc_events_page',  JSON.stringify(data.page_events));
    return true;
  } catch (e) {
    console.error('GitHub write error:', e.message);
    return false;
  }
}
