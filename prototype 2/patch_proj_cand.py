import re

with open('src/components/tabs/ProjectCandidatesTab.tsx', 'r') as f:
    content = f.read()

# Filter the list before rendering
new_render_logic = """
export function ProjectCandidatesTab() {
  const { restrictedCompanies } = useRestricted();
  const isRestricted = (companyName: string) => restrictedCompanies.some(rc => rc.name === companyName);

  const displayedPipeline = projectPipeline.filter(c => !isRestricted(c.company));

  const getStatusBadge = (status: string) => {
"""

content = re.sub(r'export function ProjectCandidatesTab\(\) \{\n\s*const \{ restrictedCompanies \} = useRestricted\(\);\n\s*const isRestricted = \(companyName: string\) => restrictedCompanies\.some\(rc => rc\.name === companyName\);\n\n\s*const getStatusBadge = \(status: string\) => \{', new_render_logic.strip(), content)

# Change the map loop and remove the badge logic
content = content.replace("projectPipeline.map((candidate)", "displayedPipeline.map((candidate)")

badge_logic = """                          {isRestricted(candidate.company) && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                              <ShieldAlert className="w-3 h-3" /> RESTRICTED
                            </span>
                          )}"""

content = content.replace(badge_logic, "")

with open('src/components/tabs/ProjectCandidatesTab.tsx', 'w') as f:
    f.write(content)
