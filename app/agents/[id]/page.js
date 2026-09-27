'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchAgentById } from '../../../lib/agentApi'
import Loader from '../../components/Loader'
import InitialsAvatar from '../../components/InitialsAvatar'
import Section, { InfoRow, Chip } from '../../components/Section'

function formatRecordList(list) {
  if (!list || list.length === 0) return null
  return list
}

export default function AgentDetails() {
  const { id } = useParams()

  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    fetchAgentById(id)
      .then((data) => {
        if (!ignore) setAgent(data)
      })
      .catch((err) => {
        console.error(err)
        if (!ignore) setError(err.message || 'Could not load this agent.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) return <Loader label="Loading agent details…" />

  if (error) {
    return (
      <div>
        <BackLink />
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-6 text-sm font-medium">
          {error}
        </div>
      </div>
    )
  }

  if (!agent) return null

  const years = agent.presentSell?.years ?? []
  const fined = formatRecordList(agent.gotFined)
  const bonus = formatRecordList(agent.gotBonus)
  const loan = formatRecordList(agent.gotLoan)
  const photo = agent.image?.[0]?.url

  return (
    <div>
      <BackLink />

      {/* Header */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={agent.agentName}
            className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
          />
        ) : (
          <InitialsAvatar name={agent.agentName} size="lg" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {agent.agentName || 'Unnamed agent'}
            </h1>
            {agent.agentId && (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                ID #{agent.agentId}
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Super: <span className="font-semibold text-slate-700">{agent.superName || '—'}</span>
            {agent.superRating && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                {agent.superRating}
              </span>
            )}
          </p>
          {agent.joiningDate && (
            <p className="text-xs text-slate-400 mt-2">Joined {agent.joiningDate}</p>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <Section title="Personal Information" icon="🧑">
          <InfoRow label="Date of birth" value={agent.dob} />
          <InfoRow label="Present address" value={agent.presentAddress} />
          <InfoRow label="Study" value={agent.study} />
          <InfoRow label="Marital status" value={agent.married ? 'Married' : 'Unmarried'} />
          <InfoRow label="Family members" value={agent.familyMembers} />
          <InfoRow label="Earning members" value={agent.earningMembers} />
        </Section>

        <Section title="Agency Information" icon="🤝">
          <InfoRow label="Mobile number" value={agent.mobileNumber} />
          <InfoRow label="Refer agent name" value={agent.referAgentName} />
          <InfoRow label="Referred agent(s)" value={agent.referredAgentName} />
          <InfoRow label="Cash out method" value={agent.cashOutMethod} />
        </Section>
      </div>

      {/* Documents & company numbers */}
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <Section title="Documents" icon="📄">
          {agent.documents && agent.documents.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {agent.documents.map((doc, i) => (
                <Chip key={i}>{doc}</Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No documents on file.</p>
          )}
        </Section>

        <Section title="Company SIM Numbers" icon="📶">
          {agent.companyNumber && agent.companyNumber.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {agent.companyNumber.map((num, i) => (
                <Chip key={i}>{num.value}</Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No company numbers on file.</p>
          )}
        </Section>
      </div>

      {/* Phones */}
      <Section title="Company Phones" icon="📱" className="mt-5">
        {agent.phones && agent.phones.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {agent.phones.map((phone, i) => (
              <div key={i} className="rounded-xl border border-slate-100 p-3 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">{phone.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">IMEI: {phone.imei}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No phones on file.</p>
        )}
      </Section>

      {/* Fined / Bonus / Loan */}
      <div className="grid md:grid-cols-3 gap-5 mt-5">
        <RecordSection title="Got Fined" icon="⚠️" list={fined} tone="rose" />
        <RecordSection title="Got Bonus" icon="🎁" list={bonus} tone="emerald" />
        <RecordSection title="Got Loan" icon="🏦" list={loan} tone="brand" />
      </div>

      {/* Present sell */}
      <Section title="Present Sell History" icon="📈" className="mt-5">
        {years.length === 0 ? (
          <p className="text-sm text-slate-400">No sales history recorded.</p>
        ) : (
          <div className="space-y-6">
            {years.map((yearBlock) => {
              const total = yearBlock.months.reduce(
                (sum, m) => sum + (Number(m.amount) || 0),
                0
              )
              return (
                <div key={yearBlock.year}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">{yearBlock.year}</h3>
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                      Total: {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                          <th className="text-left px-4 py-2 font-semibold">Month</th>
                          <th className="text-right px-4 py-2 font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {yearBlock.months.map((m, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-slate-700">{m.month}</td>
                            <td className="px-4 py-2 text-right font-medium text-slate-800">
                              {Number(m.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Images */}
      {agent.image && agent.image.length > 0 && (
        <Section title="Photos" icon="🖼️" className="mt-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {agent.image.map((img, i) => (
              <a
                key={i}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-slate-200 aspect-square"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name || `Photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </a>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700 transition"
    >
      ← Back to all agents
    </Link>
  )
}

function RecordSection({ title, icon, list, tone }) {
  const toneClasses = {
    rose: 'bg-rose-50 text-rose-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    brand: 'bg-brand-50 text-brand-700',
  }[tone]

  return (
    <Section title={title} icon={icon}>
      {list ? (
        <ul className="space-y-2">
          {list.map((item, i) => (
            <li key={i} className={`text-xs font-medium px-3 py-2 rounded-lg ${toneClasses}`}>
              {item.value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">None recorded.</p>
      )}
    </Section>
  )
}
