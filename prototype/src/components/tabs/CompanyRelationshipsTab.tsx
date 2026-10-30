import React from 'react';
import { Company } from '../../types';
import { Network, Users } from 'lucide-react';

export function CompanyRelationshipsTab({ company }: { company: Company }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 py-20">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
        <Network className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-700">CRM Relationship Graph</h3>
      <p className="max-w-md text-center text-sm">Visualizing paths of connection between your recruiting team, existing candidates, and executives at {company.name}.</p>
    </div>
  );
}
