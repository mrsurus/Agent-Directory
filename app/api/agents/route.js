// This route runs on the server, so the request to backend.adminak.com is
// server-to-server — the browser only ever talks to this same-origin route,
// which means CORS can never block it.

const API_BASE = 'https://backend.adminak.com'
const TIMEOUT_MS = 10000

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') ?? '1'
  const limit = searchParams.get('limit') ?? '20'
  const agentName = searchParams.get('agentName') ?? ''

  const upstreamUrl = new URL('/agents', API_BASE)
  upstreamUrl.searchParams.set('page', page)
  upstreamUrl.searchParams.set('limit', limit)
  upstreamUrl.searchParams.set('agentName', agentName)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const upstreamRes = await fetch(upstreamUrl.toString(), {
      cache: 'no-store',
      signal: controller.signal,
    })
    const data = await upstreamRes.json()

    if (!upstreamRes.ok) {
      return Response.json(
        { message: `Upstream API responded with ${upstreamRes.status}`, details: data },
        { status: upstreamRes.status }
      )
    }

    return Response.json({
      agents: data.agents ?? [],
      currentPage: data.currentPage ?? Number(page),
      totalPages: data.totalPages ?? 1,
      totalAgents: data.totalAgents ?? data.total ?? data.agents?.length ?? 0,
    })
  } catch (err) {
    const timedOut = err?.name === 'AbortError'
    console.error('Failed to reach agents API:', err)
    return Response.json(
      {
        message: timedOut
          ? 'The agents API did not respond in time.'
          : 'Could not reach the agents API from the server.',
      },
      { status: 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
