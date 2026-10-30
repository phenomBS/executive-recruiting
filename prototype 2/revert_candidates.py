import re

# 1. Revert types.ts
with open('src/types.ts', 'r') as f:
    types_content = f.read()

types_content = re.sub(
    r"emiScore: number \| null;\n  behavioralScore: number;\n  revenueScale\?: string;\n  emiTierLabel\?: string;\n  emiBadgeColor\?: 'Purple' \| 'Green' \| 'Blue' \| 'Gray' \| 'Red';\n  topMobilityTrigger\?: string;\n  agentNurturePosture\?: string;\n  relationshipLeverage\?: string;\n  complianceStatus\?: \{\n    isClean: boolean;\n    badge: string;\n  \};\n  executiveData: \{",
    r"emiScore: number;\n  behavioralScore: number;\n  executiveData: {",
    types_content
)

with open('src/types.ts', 'w') as f:
    f.write(types_content)

# 2. Revert mockData.ts
with open('src/data/mockData.ts', 'r') as f:
    mock_content = f.read()

# Restore emiScore for e-1
mock_content = re.sub(r"emiScore: null,\n\s*behavioralScore: 95,", r"emiScore: 84,\n    behavioralScore: 95,", mock_content)

# Remove added fields
mock_content = re.sub(r"\s*revenueScale:.*?badge: '.*?'\n\s*\},", "", mock_content, flags=re.DOTALL)

# Revert avatars
def revert_avatar(m):
    id_str = m.group(1)
    if id_str != 'c-1':
        return m.group(0).replace('avatarUrl: executivePhoto', 'avatarUrl: undefined')
    return m.group(0)

mock_content = re.sub(r"(id: '([^']+)',[\s\S]*?avatarUrl: [^,]+,)", revert_avatar, mock_content)

with open('src/data/mockData.ts', 'w') as f:
    f.write(mock_content)

# 3. Revert CandidatesView.tsx
with open('src/components/CandidatesView.tsx', 'r') as f:
    view_content = f.read()

new_thead = """            <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 shadow-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">EMI Score</th>
              </tr>
            </thead>"""

new_tbody = """            <tbody className="divide-y divide-slate-100">
              {mockCandidates.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  onClick={() => onSelectCandidate(candidate.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600">
                    <div className="flex items-center gap-3">
                      {candidate.avatarUrl ? (
                        <img src={candidate.avatarUrl} alt={candidate.firstName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      {candidate.firstName} {candidate.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{candidate.role}</td>
                  <td className="px-6 py-4 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      {candidate.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {candidate.location.split(',')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {candidate.emiScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>"""

view_content = re.sub(r'<thead.*?</thead>', new_thead, view_content, flags=re.DOTALL)
view_content = re.sub(r'<tbody.*?</tbody>', new_tbody, view_content, flags=re.DOTALL)

with open('src/components/CandidatesView.tsx', 'w') as f:
    f.write(view_content)

