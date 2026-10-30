import re

with open('src/components/CandidatesView.tsx', 'r') as f:
    content = f.read()

# I will replace the <thead> and <tbody> sections.

new_thead = """
            <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 shadow-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Candidate Info</th>
                <th className="px-6 py-4">Company & Scale</th>
                <th className="px-6 py-4">EMI Assessment</th>
                <th className="px-6 py-4">Mobility & Nurture</th>
                <th className="px-6 py-4">Relationship</th>
                <th className="px-6 py-4">Compliance</th>
              </tr>
            </thead>
"""

new_tbody_content = """
              {mockCandidates.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  onClick={() => onSelectCandidate(candidate.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group border-b border-slate-100 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {candidate.avatarUrl ? (
                        <img src={candidate.avatarUrl} alt={candidate.firstName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600">{candidate.firstName} {candidate.lastName}</div>
                        <div className="text-sm text-slate-500">{candidate.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium text-slate-800">{candidate.company}</div>
                      {candidate.revenueScale && (
                        <div className="text-xs text-slate-500 font-medium">
                          {candidate.revenueScale}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-2">
                        {candidate.emiScore !== null ? (
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                            candidate.emiBadgeColor === 'Green' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            candidate.emiBadgeColor === 'Blue' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            candidate.emiBadgeColor === 'Gray' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                            candidate.emiBadgeColor === 'Red' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-purple-100 text-purple-700 border border-purple-200'
                          }`}>
                            {candidate.emiScore}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                            N/A
                          </span>
                        )}
                      </div>
                      <div className={`text-xs font-bold ${
                        candidate.emiBadgeColor === 'Green' ? 'text-emerald-700' :
                        candidate.emiBadgeColor === 'Blue' ? 'text-blue-700' :
                        candidate.emiBadgeColor === 'Gray' ? 'text-slate-600' :
                        candidate.emiBadgeColor === 'Red' ? 'text-red-700' :
                        'text-purple-700'
                      }`}>
                        {candidate.emiTierLabel}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-slate-800">{candidate.topMobilityTrigger}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                        {candidate.agentNurturePosture}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">
                      {candidate.relationshipLeverage}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {candidate.complianceStatus ? (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                        candidate.complianceStatus.isClean 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {candidate.complianceStatus.badge}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Unknown</span>
                    )}
                  </td>
                </tr>
              ))}
"""

# Replace the thead
content = re.sub(r'<thead.*?</thead>', new_thead, content, flags=re.DOTALL)

# Replace the tbody
content = re.sub(r'<tbody className="divide-y divide-slate-100">.*?</tbody>', f'<tbody className="divide-y divide-slate-100">{new_tbody_content}</tbody>', content, flags=re.DOTALL)

with open('src/components/CandidatesView.tsx', 'w') as f:
    f.write(content)

