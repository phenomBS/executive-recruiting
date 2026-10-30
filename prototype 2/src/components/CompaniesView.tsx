import React, { useState, useMemo } from 'react';
import { CompaniesList } from './CompaniesList';
import { CompanyDetail } from './CompanyDetail';
import { RecommendedCompanyDetail } from './RecommendedCompanyDetail';
import { Company, RecommendedCompany } from '../types';
import { mockCompanies, mockRecommendedCompanies } from '../data/mockData';
import { useRouter } from '../context/RouterContext';

export function CompaniesView() {
  const router = useRouter();
  const [recommendedCompaniesList, setRecommendedCompaniesList] = useState<RecommendedCompany[]>(mockRecommendedCompanies);
  const [companiesList, setCompaniesList] = useState<Company[]>(mockCompanies);
  
  const selectedCompanyId = router.companyId;
  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return (
      companiesList.find(c => c.id === selectedCompanyId) || 
      recommendedCompaniesList.find(c => c.id === selectedCompanyId) || 
      null
    );
  }, [selectedCompanyId, companiesList, recommendedCompaniesList]);

  const handleAddToCrm = (id: string) => {
    setRecommendedCompaniesList(prev => prev.map(rc => rc.id === id ? { ...rc, addedToCrm: true } : rc));
    const recComp = recommendedCompaniesList.find(rc => rc.id === id);
    if (recComp) {
      setCompaniesList(prev => {
        if (!prev.some(c => c.name.toLowerCase() === recComp.name.toLowerCase())) {
          return [...prev, recComp];
        }
        return prev;
      });
    }
  };

  if (selectedCompany) {
    const isRecommended = 'recommendationReason' in selectedCompany || recommendedCompaniesList.some(r => r.id === selectedCompany.id);
    
    if (isRecommended) {
      return (
        <RecommendedCompanyDetail 
          company={selectedCompany as RecommendedCompany} 
          onBack={() => router.setCompanyId(null)}
          onAddToCrm={() => handleAddToCrm(selectedCompany.id)}
        />
      );
    }
    return (
      <CompanyDetail 
        company={selectedCompany as Company} 
        onBack={() => router.setCompanyId(null)} 
      />
    );
  }

  return (
    <CompaniesList 
      companies={companiesList} 
      recommendedCompanies={recommendedCompaniesList}
      onUpdateRecommendedCompanies={setRecommendedCompaniesList}
      onUpdateCompanies={setCompaniesList}
      onSelectCompany={(c) => router.setCompanyId(c.id)} 
    />
  );
}
