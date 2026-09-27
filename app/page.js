'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { fetchAgents } from '../lib/agentApi'
import Loader from './components/Loader'
import Pagination from './components/Pagination'
import InitialsAvatar from './components/InitialsAvatar'

const PAGE_SIZE = 20

export default function Home() {
  const router = useRouter()

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAgents, setTotalAgents] = useState(0)

  const loadAgents = useCallback(async (page, name) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchAgents(page, PAGE_SIZE, name)
      setAgents(res.agents)
      setCurrentPage(res.currentPage)
      setTotalPages(res.totalPages)
      setTotalAgents(res.totalAgents)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not load agents. Please try again.')
      setAgents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAgents(1, '')
  }, [loadAgents])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setActiveSearch(searchInput.trim())
    loadAgents(1, searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setActiveSearch('')
    loadAgents(1, '')
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    loadAgents(page, activeSearch)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agents
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {totalAgents ? `${totalAgents} agents on record` : 'Browse and search all agents'}
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by agent name…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold shadow-sm hover:bg-brand-700 active:scale-[0.98] transition"
          >
            Search
          </button>
          {activeSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {activeSearch && !loading && (
        <p className="mb-4 text-sm text-slate-500">
          Showing results for <span className="font-semibold text-slate-700">&quot;{activeSearch}&quot;</span>
        </p>
      )}

      {/* Content */}
      {loading ? (
        <Loader label="Loading agents…" />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-6 text-sm font-medium">
          {error}
        </div>
      ) : agents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500 font-medium">No agents found.</p>
        </div>
      ) : (
        <>
          {/* Table (desktop) */}
          <div className="hidden sm:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Agent
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Super Name
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={agent.agentName} />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {agent.agentName || '—'}
                          </p>
                          {agent.agentId && (
                            <p className="text-xs text-slate-400">ID: {agent.agentId}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{agent.superName || '—'}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => router.push(`/agents/${agent._id}`)}
                        className="px-4 py-2 rounded-lg bg-brand-50 text-brand-700 text-sm font-semibold hover:bg-brand-100 transition"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="sm:hidden space-y-3">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex items-center gap-3"
              >
                <InitialsAvatar name={agent.agentName} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {agent.agentName || '—'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    Super: {agent.superName || '—'}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/agents/${agent._id}`)}
                  className="px-3 py-2 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition shrink-0"
                >
                  Details
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
