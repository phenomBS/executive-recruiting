import React, { createContext, useContext, useState } from 'react';

export type RestrictedCompany = {
  name: string;
  reason: string;
  dateAdded: string;
};

interface RestrictedContextType {
  restrictedCompanies: RestrictedCompany[];
  addRestrictedCompany: (company: RestrictedCompany) => void;
  removeRestrictedCompany: (name: string) => void;
}

export const RestrictedContext = createContext<RestrictedContextType>({
  restrictedCompanies: [],
  addRestrictedCompany: () => {},
  removeRestrictedCompany: () => {}
});

export function RestrictedProvider({ children }: { children: React.ReactNode }) {
  const [restrictedCompanies, setRestrictedCompanies] = useState<RestrictedCompany[]>([
    { name: 'Meta', reason: 'Active Client - Off Limits for 12 months', dateAdded: '2026-08-15' },
    { name: 'Broadcom', reason: 'Non-Solicit Agreement - Client Advisory Tier', dateAdded: '2026-09-01' }
  ]);

  const addRestrictedCompany = (company: RestrictedCompany) => {
    if (!restrictedCompanies.find(c => c.name === company.name)) {
      setRestrictedCompanies([...restrictedCompanies, company]);
    }
  };

  const removeRestrictedCompany = (name: string) => {
    setRestrictedCompanies(restrictedCompanies.filter(c => c.name !== name));
  };

  return (
    <RestrictedContext.Provider value={{ restrictedCompanies, addRestrictedCompany, removeRestrictedCompany }}>
      {children}
    </RestrictedContext.Provider>
  );
}

export const useRestricted = () => useContext(RestrictedContext);
