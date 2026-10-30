import re

with open('src/components/CompaniesList.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace("import { RestrictedCompaniesModal } from './RestrictedCompaniesModal';", "import { RestrictedCompaniesModal } from './RestrictedCompaniesModal';\nimport { useRestricted } from '../context/RestrictedContext';\nimport { cn } from '../lib/utils';")

# 2. Add state and modify filtering
new_logic = """
export function CompaniesList({ companies, onSelectCompany }: CompaniesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { restrictedCompanies } = useRestricted();

  const isRestricted = (companyName: string) => restrictedCompanies.some(rc => rc.name === companyName);

  const displayedCompanies = companies.filter(c => {
    const restricted = isRestricted(c.name);
    if (activeTab === 'restricted') return restricted;
    return !restricted;
  }).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
"""

content = re.sub(
    r"export function CompaniesList\(\{ companies, onSelectCompany \}: CompaniesListProps\) \{\n.*?const filteredCompanies = companies\.filter\(c => c\.name\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\);",
    new_logic,
    content,
    flags=re.DOTALL
)

# 3. Replace tabs with functional ones
new_tabs = """        {/* Phenom-style Horizontal Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/50">
          <div className="flex whitespace-nowrap min-w-max">
            <button 
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200",
                activeTab === 'all' ? "bg-white text-slate-800" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              All Companies <span className="text-slate-500 font-normal ml-1">1,250</span>
            </button>
            <button 
              onClick={() => setActiveTab('restricted')}
              className={cn(
                "px-5 py-3 text-sm font-semibold border-r border-slate-200 flex items-center gap-1",
                activeTab === 'restricted' ? "bg-white text-red-700" : "bg-transparent text-slate-600 hover:bg-slate-100 font-medium"
              )}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Restricted Companies <span className="text-slate-500 font-normal ml-1">{restrictedCompanies.length}</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Target List <span className="text-slate-500 font-normal ml-1">42</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Enterprise <span className="text-slate-500 font-normal ml-1">315</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Recent Funding <span className="text-slate-500 font-normal ml-1">89</span>
            </button>
            <button className="px-5 py-3 text-sm font-medium text-slate-600 border-r border-slate-200 hover:bg-slate-100">
              Competitors <span className="text-slate-500 font-normal ml-1">24</span>
            </button>
          </div>
        </div>"""

content = re.sub(
    r"\{\/\* Phenom-style Horizontal Tabs \*\/\}[\s\S]*?<\/div>\n        <\/div>",
    new_tabs,
    content
)

# 4. Update the tbody mapping from filteredCompanies to displayedCompanies and add restricted badge
content = content.replace("filteredCompanies.map", "displayedCompanies.map")
content = content.replace("filteredCompanies.length", "displayedCompanies.length")

new_td = """                  <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600">
                    <div className="flex items-center gap-2">
                      {company.name}
                      {isRestricted(company.name) && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                          <ShieldAlert className="w-3 h-3" /> RESTRICTED
                        </span>
                      )}
                    </div>
                  </td>"""

content = re.sub(
    r"<td className=\"px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600\">\{company\.name\}<\/td>",
    new_td,
    content
)

with open('src/components/CompaniesList.tsx', 'w') as f:
    f.write(content)

