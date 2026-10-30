import re

with open('src/components/CompanyDetail.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { ArrowLeft, Building2, MapPin, Users, Globe, LineChart, Sparkles, Plus, Star, Map, X, Send } from 'lucide-react';",
    "import { ArrowLeft, Building2, MapPin, Users, Globe, LineChart, Sparkles, Plus, Star, Map, X, Send, AlertTriangle } from 'lucide-react';\nimport { useRestricted } from '../context/RestrictedContext';"
)

# 2. Hook and variable
content = content.replace(
    "const [activeTab, setActiveTab] = useState<TabType>('overview');",
    "const [activeTab, setActiveTab] = useState<TabType>('overview');\n  const { restrictedCompanies } = useRestricted();\n  const restrictedInfo = restrictedCompanies.find(rc => rc.name === company.name);"
)

# 3. Render banner
banner_html = """
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Companies
            </button>
            
            {restrictedInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider">Restricted: Do Not Contact</h4>
                  <p className="text-sm text-red-600 mt-0.5">This company is on the restricted list. Reason: <span className="font-medium">{restrictedInfo.reason}</span></p>
                </div>
              </div>
            )}
"""
content = re.sub(
    r'<button \s*onClick=\{onBack\}\s*className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold mb-4"\s*>\s*<ArrowLeft className="w-4 h-4" /> Back to Companies\s*</button>',
    banner_html,
    content
)

with open('src/components/CompanyDetail.tsx', 'w') as f:
    f.write(content)
