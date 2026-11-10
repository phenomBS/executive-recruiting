import React from 'react';
import { Company } from '../../types';
import { Network, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { OrgChartNode, getCompanyOrgChartTree } from '../../data/companyOrgCharts';

function OrgNode({ node, isRoot = false }: { node: OrgChartNode; isRoot?: boolean }) {
  return (
    <div
      className={cn(
        'bg-white border rounded-xl p-4 shadow-sm w-[260px] relative z-10',
        isRoot ? 'border-(--color-secondary-200) border-2' : 'border-(--border-light) hover:border-(--color-secondary-100) transition-colors'
      )}
    >
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-(--bg-neutral-soft) border border-(--border-light) flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-(--text-subtle)" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-(--text-strong) text-sm truncate mb-0">{node.name}</h4>
          <p className="text-sm text-(--text-default) truncate">{node.title}</p>
        </div>
      </div>
      <span className="phx-tag absolute -top-3 left-1/2 -translate-x-1/2" data-size="sm">{node.level}</span>
    </div>
  );
}

/** A node with its reports laid out underneath, joined by connector lines. */
function Branch({ node, isRoot = false }: { node: OrgChartNode; isRoot?: boolean }) {
  const kids = node.children ?? [];
  return (
    <div className="flex flex-col items-center">
      <OrgNode node={node} isRoot={isRoot} />
      {kids.length > 0 && (
        <>
          <div className="w-px h-8 bg-(--border-default)" />
          <div className="flex items-start gap-6">
            {kids.map((kid, i) => (
              <div key={`${kid.name}-${i}`} className="relative flex flex-col items-center pt-8">
                {kids.length > 1 && (
                  <div
                    className={cn(
                      'absolute top-0 h-px bg-(--border-default)',
                      i === 0 ? 'left-1/2 right-[-12px]' : i === kids.length - 1 ? 'left-[-12px] right-1/2' : 'left-[-12px] right-[-12px]'
                    )}
                  />
                )}
                <div className="absolute top-0 left-1/2 w-px h-8 bg-(--border-default)" />
                <Branch node={kid} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CompanyOrganizationTab({ company }: { company: Company }) {
  const tree = getCompanyOrgChartTree(company.name);

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-(--text-strong)">Leadership organization</h2>
          <p className="text-sm text-(--text-default)">Executive reporting lines at {company.name}.</p>
        </div>
        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">
          <Network className="w-4 h-4" aria-hidden="true" /> Filter by function
        </button>
      </div>
      <div className="overflow-x-auto pb-6">
        <div className="flex justify-center min-w-max py-6 px-6">
          <Branch node={tree} isRoot />
        </div>
      </div>
    </div>
  );
}
