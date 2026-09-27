// The browser calls these relative, same-origin paths — never
// backend.adminak.com directly — so there is nothing for a browser CORS
// policy to block. The actual external call happens inside
// app/api/agents/route.js and app/api/agents/[id]/route.js, on the server.

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`)
  }
  return data
}

export async function fetchAgents(page = 1, limit = 20, agentName = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), agentName })
  const res = await fetch(`/api/agents?${params.toString()}`, { cache: 'no-store' })
  return handleResponse(res)
}

export async function fetchAgentById(id) {
  const res = await fetch(`/api/agents/${id}`, { cache: 'no-store' })
  return handleResponse(res)
}
