import re

with open('src/data/mockData.ts', 'r') as f:
    content = f.read()

# Replace `avatarUrl: undefined,` with `avatarUrl: executivePhoto,`
content = content.replace('avatarUrl: undefined,', 'avatarUrl: executivePhoto,')

# Add the new fields to each candidate
def repl(m):
    id_str = m.group(1)
    
    if id_str == 'c-1': # John Ternus
        fields = """
    revenueScale: '$383B Public',
    emiTierLabel: 'Tier 1: Active Conversion',
    emiBadgeColor: 'Green',
    topMobilityTrigger: '45d Vesting Cliff',
    agentNurturePosture: 'Queued for Intro',
    relationshipLeverage: 'Board Member Warm Lead',
    complianceStatus: {
      isClean: true,
      badge: 'Clean'
    },
"""
    elif id_str == 'e-1': # Jensen
        fields = """
    emiScore: null,
    revenueScale: '$60.9B Public',
    emiTierLabel: 'Always On: Keep Warm',
    emiBadgeColor: 'Purple',
    topMobilityTrigger: 'Recent Publication',
    agentNurturePosture: 'Monitoring Signal',
    relationshipLeverage: 'Cold',
    complianceStatus: {
      isClean: true,
      badge: 'Clean'
    },
"""
    elif id_str == 'e-2': # Colette
        fields = """
    revenueScale: '$60.9B Public',
    emiTierLabel: 'Tier 1: Active Conversion',
    emiBadgeColor: 'Green',
    topMobilityTrigger: 'Tenure 4+ Yrs',
    agentNurturePosture: 'Drafting Publication Commentary',
    relationshipLeverage: 'Direct CRM Contact',
    complianceStatus: {
      isClean: true,
      badge: 'Clean'
    },
"""
    elif id_str == 'e-3': # Debora
        fields = """
    revenueScale: '$60.9B Public',
    emiTierLabel: 'Tier 2: Strategic Probe',
    emiBadgeColor: 'Blue',
    topMobilityTrigger: 'Stock -22% Q3',
    agentNurturePosture: 'Monitoring Signal',
    relationshipLeverage: 'Cold',
    complianceStatus: {
      isClean: true,
      badge: 'Clean'
    },
"""
    elif id_str == 'e-4': # Timothy
        fields = """
    revenueScale: '$60.9B Public',
    emiTierLabel: 'Tier 3: Passive Bench',
    emiBadgeColor: 'Gray',
    topMobilityTrigger: 'Low Mobility',
    agentNurturePosture: 'Suppressed',
    relationshipLeverage: 'Cold',
    complianceStatus: {
      isClean: false,
      badge: 'Off-Limits (Exp: 12/26)'
    },
"""
    else:
        fields = ""

    # Note: Jensen's emiScore might need to be replaced if we use emiScore: null
    # But it's easier to just inject this before `executiveData`
    
    return m.group(0) + fields

content = re.sub(r"(id: '([^']+)',[\s\S]*?behavioralScore: \d+,)", repl, content)

with open('src/data/mockData.ts', 'w') as f:
    f.write(content)
