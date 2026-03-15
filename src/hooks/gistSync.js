const FILENAME = 'kipay-data.json'

function headers(token) {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

export async function findOrCreateGist(token, localData) {
  const listRes = await fetch('https://api.github.com/gists?per_page=100', { headers: headers(token) })
  if (!listRes.ok) throw new Error(`Token invalide ou erreur API (${listRes.status})`)

  const gists = await listRes.json()
  const found = gists.find(g => FILENAME in g.files)

  if (found) {
    const detailRes = await fetch(`https://api.github.com/gists/${found.id}`, { headers: headers(token) })
    if (!detailRes.ok) throw new Error('Impossible de lire le Gist')
    const gist = await detailRes.json()
    const content = gist.files[FILENAME]?.content
    return { gistId: found.id, data: JSON.parse(content) }
  }

  const createRes = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      description: 'KiPay – Restaurant payment tracker',
      public: false,
      files: { [FILENAME]: { content: JSON.stringify(localData, null, 2) } },
    }),
  })
  if (!createRes.ok) throw new Error('Impossible de créer le Gist')
  const gist = await createRes.json()
  return { gistId: gist.id, data: localData }
}

export async function pushToGist(token, gistId, data) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({
      files: { [FILENAME]: { content: JSON.stringify(data, null, 2) } },
    }),
  })
  if (!res.ok) throw new Error('Échec de la synchronisation')
}

export async function pullFromGist(token, gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers: headers(token) })
  if (!res.ok) throw new Error('Impossible de lire le Gist')
  const gist = await res.json()
  const content = gist.files[FILENAME]?.content
  if (!content) throw new Error('Gist vide')
  return JSON.parse(content)
}
