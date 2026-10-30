import re
import os

files_to_patch = ['src/components/CandidatesView.tsx', 'src/components/CompaniesList.tsx']

for file_path in files_to_patch:
    with open(file_path, 'r') as f:
        content = f.read()

    # We want to replace `<div className="overflow-x-auto flex-1">` with a more robust scrolling container setup
    # Because it is inside `<div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-0 overflow-hidden">`
    # We can replace the `overflow-x-auto flex-1` with `flex-1 min-h-0 min-w-0 relative` and an inner `absolute inset-0 overflow-auto`
    
    pattern = r'<div className="overflow-x-auto flex-1">(.*?)</table>\s*(?:\{filteredCompanies\.length === 0 && \(.*?\)\}\s*)?</div>'
    
    def repl(m):
        inner_content = m.group(1) + '</table>'
        
        # Preserve the empty state if it's there
        empty_state = ''
        if 'filteredCompanies.length === 0' in m.group(0):
            empty_state = """
          {filteredCompanies.length === 0 && (
            <div className="p-8 text-center text-slate-500">No companies found matching your search.</div>
          )}"""

        return f"""<div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-auto">
            {inner_content}{empty_state}
          </div>
        </div>"""

    content = re.sub(pattern, repl, content, flags=re.DOTALL)

    with open(file_path, 'w') as f:
        f.write(content)
