import re

# 1. Update RestrictedContext.tsx
with open('src/context/RestrictedContext.tsx', 'r') as f:
    ctx_content = f.read()

ctx_content = ctx_content.replace("'Apple'", "'Meta'")

with open('src/context/RestrictedContext.tsx', 'w') as f:
    f.write(ctx_content)


# 2. Update mockData.ts
with open('src/data/mockData.ts', 'r') as f:
    mock_content = f.read()

new_candidate = """  {
    id: 'c-2',
    firstName: 'Sarah',
    lastName: 'Sandberg',
    role: 'Chief Marketing Officer',
    company: 'Meta',
    email: 'sarahs@meta.example.com',
    phone: '+1 555-0299',
    location: 'Menlo Park, California, United States',
    trafficSource: 'Direct',
    linkedinUrl: 'https://linkedin.com/in/sarahsandberg',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&q=80',
    emiScore: 88,
    behavioralScore: 92,
    executiveData: {
      executiveLevel: 'C-Suite',
      function: 'Marketing',
      currentCompanyTenure: '4 years',
      currentRoleTenure: '2 years',
      careerVelocity: 'High',
      industryExperience: 'Technology, Social Media',
      companySizeExperience: '100K+ employees',
      publicCompanyExperience: 'Yes',
      peBackedExperience: 'No',
      geographicExperience: 'Global',
      globalExperience: 'Global Marketing',
      boardExperience: 'N/A',
      education: 'MBA, Harvard',
      certifications: 'N/A',
      areasOfExpertise: 'Digital Marketing, Brand Strategy',
      currentCompensation: '$8.5M',
      currentEquityType: 'RSU',
      currentEquityShares: '40,000',
      mobilityIndicator: 'Medium',
      careerTrajectory: 'VP -> CMO',
      executiveArchetype: 'Growth Marketer',
      likelyNextRole: 'CEO',
      candidatePandL: 'N/A',
      relocationWillingness: 'No',
      noticePeriod: '6 months',
      nonCompete: 'Yes',
      gardenLeave: 'Yes',
    }
  },
"""

new_company = """  {
    id: 'comp-5',
    name: 'Meta',
    industry: 'Technology',
    size: '10,001+ employees',
    revenue: '$116.6B',
    headquarters: 'Menlo Park, CA',
    website: 'meta.com',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
    executivesCount: 320,
    relevantCandidatesCount: 85,
    crmCandidatesCount: 210,
    activeLeadershipChanges: 4,
    activeSearchesCount: 5,
    lastUpdated: '5 hours ago',
    growthIndicators: ['VR/AR expansion', 'AI investments'],
    recentAcquisitions: [],
    activeOpenings: ['VP of Engineering', 'Director of AI Research'],
    strategicInitiatives: ['Llama 3 rollout', 'Metaverse development'],
  },
"""

mock_content = mock_content.replace("export const mockCandidates: Candidate[] = [\n", "export const mockCandidates: Candidate[] = [\n" + new_candidate)
mock_content = mock_content.replace("export const mockCompanies: Company[] = [\n", "export const mockCompanies: Company[] = [\n" + new_company)

with open('src/data/mockData.ts', 'w') as f:
    f.write(mock_content)

