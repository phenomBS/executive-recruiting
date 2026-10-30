import re

with open('src/components/ExecutiveSearchProjectDetail.tsx', 'r') as f:
    content = f.read()

# Replace the placeholder for "candidates"
old_placeholder = """
          {['candidates', 'relationships', 'nurture', 'search-intelligence'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 capitalize">{activeTab.replace('-', ' ')} Workspace</h3>
              <p className="max-w-md text-center text-sm">Specialized Executive Search tooling for this module will be rendered here.</p>
            </div>
          )}
"""

new_placeholder = """
          {activeTab === 'candidates' && (
            <ProjectCandidatesTab />
          )}

          {['relationships', 'nurture', 'search-intelligence'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 capitalize">{activeTab.replace('-', ' ')} Workspace</h3>
              <p className="max-w-md text-center text-sm">Specialized Executive Search tooling for this module will be rendered here.</p>
            </div>
          )}
"""

content = content.replace(old_placeholder.strip(), new_placeholder.strip())

with open('src/components/ExecutiveSearchProjectDetail.tsx', 'w') as f:
    f.write(content)
