// Data now comes straight from data/directory-data.json — no API, no network
// request, no server routes. The JSON is bundled with the app.
//
// The function names and return shapes are unchanged, so the pages
// (app/page.js and app/agents/[id]/page.js) work exactly as before.

import directoryData from '../data/directory-data.json'

const ALL_AGENTS = directoryData.agents ?? []

export async function fetchAgents(page = 1, limit = 20, agentName = '') {
  const query = agentName.trim().toLowerCase()

  const filtered = query
    ? ALL_AGENTS.filter((a) => (a.agentName || '').toLowerCase().includes(query))
    : ALL_AGENTS

  const totalAgents = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalAgents / limit))
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages)
  const start = (currentPage - 1) * limit

  return {
    agents: filtered.slice(start, start + limit),
    currentPage,
    totalPages,
    totalAgents,
  }
}

export async function fetchAgentById(id) {
  const agent = ALL_AGENTS.find((a) => a._id === id)
  if (!agent) throw new Error('Agent not found.')
  return agent
}
