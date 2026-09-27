const API_BASE = 'https://backend.adminak.com'
const TIMEOUT_MS = 10000

export async function GET(_request, { params }) {
  const { id } = params

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const upstreamRes = await fetch(`${API_BASE}/agents/${id}`, {
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

    return Response.json(data)
  } catch (err) {
    const timedOut = err?.name === 'AbortError'
    console.error('Failed to reach agent details API:', err)
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
