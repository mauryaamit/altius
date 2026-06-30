import type { CitationData } from './types'

export interface RefIndicator {
  label: string
  value: string
  citation: CitationData
  note?: string
}

export interface RefSection {
  category: string
  indicators: RefIndicator[]
}

export const guesstimateRefData: RefSection[] = [
  {
    category: 'World Indicators',
    indicators: [
      {
        label: 'World Population',
        value: '8.03 Bn',
        citation: { id: 1, source: 'UN Population Division, World Population Prospects', date: '2026' }
      },
      {
        label: 'Asia Population',
        value: '4.78 Bn',
        citation: { id: 2, source: 'UN Population Division, World Population Prospects', date: '2026' }
      },
      {
        label: 'Africa Population',
        value: '1.52 Bn',
        citation: { id: 3, source: 'UN Population Division, World Population Prospects', date: '2026' }
      },
      {
        label: 'China Population',
        value: '1.41 Bn',
        citation: { id: 4, source: 'National Bureau of Statistics of China', date: '2025' }
      },
      {
        label: 'India Population',
        value: '1.44 Bn',
        citation: { id: 5, source: 'UN Population Division, World Population Prospects', date: '2026' }
      },
      {
        label: 'United States Population',
        value: '342 Mn',
        citation: { id: 6, source: 'US Census Bureau Population Clock', date: '2026' }
      },
      {
        label: 'World Nominal GDP',
        value: '$109.5 Trillion',
        citation: { id: 7, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      },
      {
        label: 'US Nominal GDP',
        value: '$28.7 Trillion',
        citation: { id: 8, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      },
      {
        label: 'China Nominal GDP',
        value: '$18.9 Trillion',
        citation: { id: 9, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      },
      {
        label: 'India Nominal GDP',
        value: '$3.93 Trillion',
        citation: { id: 10, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      }
    ]
  },
  {
    category: 'India — National',
    indicators: [
      {
        label: 'Total India Population',
        value: '1.44 Bn',
        citation: { id: 1, source: 'UN Population Division, World Population Prospects', date: '2026' }
      },
      {
        label: 'Urban Population Split',
        value: '36.5%',
        citation: { id: 2, source: 'Ministry of Housing and Urban Affairs (MoHUA) projection', date: '2024' },
        note: 'Based on Census 2011 baseline of 31.2% updated with urban migration models'
      },
      {
        label: 'Rural Population Split',
        value: '63.5%',
        citation: { id: 3, source: 'Ministry of Housing and Urban Affairs (MoHUA) projection', date: '2024' }
      },
      {
        label: 'Population Growth Rate',
        value: '0.8% YoY',
        citation: { id: 4, source: 'UN Population Division, World Population Prospects', date: '2025' }
      },
      {
        label: 'National Sex Ratio (Census)',
        value: '943 F / 1000 M',
        citation: { id: 5, source: 'Census of India (Census 2011)', date: '2011' },
        note: 'Census 2011 remains the most recent official state-wide census; Census 2021 was delayed indefinitely'
      },
      {
        label: 'National Sex Ratio (NFHS-5)',
        value: '1020 F / 1000 M',
        citation: { id: 6, source: 'Ministry of Health, National Family Health Survey (NFHS-5)', date: '2021' },
        note: 'Representative sample-survey based estimate; may overestimate female ratio due to sample design'
      },
      {
        label: 'Median Age of Population',
        value: '28.2 Years',
        citation: { id: 7, source: 'UN Population Division, World Population Prospects', date: '2025' }
      },
      {
        label: 'Age Dependency Ratio',
        value: '48.2%',
        citation: { id: 8, source: 'Ministry of Statistics and Programme Implementation (MoSPI)', date: '2024' }
      },
      {
        label: 'Labour Force Participation Rate (LFPR)',
        value: '41.3%',
        citation: { id: 9, source: 'NSSO, Periodic Labour Force Survey (PLFS) Annual Report', date: '2024-05' },
        note: 'Overall national rate across all age groups'
      },
      {
        label: 'Male Labour Force Participation (LFPR)',
        value: '78.8%',
        citation: { id: 10, source: 'NSSO, Periodic Labour Force Survey (PLFS) Annual Report', date: '2024-05' }
      },
      {
        label: 'Female Labour Force Participation (LFPR)',
        value: '35.6%',
        citation: { id: 11, source: 'NSSO, Periodic Labour Force Survey (PLFS) Annual Report', date: '2024-05' }
      },
      {
        label: 'India Nominal GDP',
        value: '$3.93 Trillion',
        citation: { id: 12, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      },
      {
        label: 'India GDP (PPP)',
        value: '$14.6 Trillion',
        citation: { id: 13, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      },
      {
        label: 'India Per Capita GDP (Nominal)',
        value: '$2,730',
        citation: { id: 14, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' }
      }
    ]
  },
  {
    category: 'India — State-wise Indicators',
    indicators: [
      {
        label: 'Uttar Pradesh Population',
        value: '241 Mn',
        citation: { id: 1, source: 'UIDAI state-wise Aadhaar saturation estimates', date: '2024' },
        note: 'Census 2011 baseline was 199.8 million'
      },
      {
        label: 'Bihar Population',
        value: '127 Mn',
        citation: { id: 2, source: 'UIDAI state-wise Aadhaar saturation estimates', date: '2024' },
        note: 'Census 2011 baseline was 104.1 million'
      },
      {
        label: 'Maharashtra Population',
        value: '126 Mn',
        citation: { id: 3, source: 'UIDAI state-wise Aadhaar saturation estimates', date: '2024' },
        note: 'Census 2011 baseline was 112.4 million'
      },
      {
        label: 'West Bengal Population',
        value: '99 Mn',
        citation: { id: 4, source: 'UIDAI state-wise Aadhaar saturation estimates', date: '2024' },
        note: 'Census 2011 baseline was 91.3 million'
      },
      {
        label: 'Kerala Sex Ratio (Highest State)',
        value: '1084 F / 1000 M',
        citation: { id: 5, source: 'Census of India (Census 2011)', date: '2011' },
        note: 'Census 2011 remains the most recent official state-level census'
      },
      {
        label: 'Haryana Sex Ratio (Lowest State)',
        value: '879 F / 1000 M',
        citation: { id: 6, source: 'Census of India (Census 2011)', date: '2011' },
        note: 'Census 2011 remains the most recent official state-level census'
      },
      {
        label: 'Goa Per Capita Net State GDP (Highest)',
        value: 'Rs. 5.2 Lakh',
        citation: { id: 7, source: 'MoSPI State-wise GDP Indicators', date: '2023-12' }
      },
      {
        label: 'Bihar Per Capita Net State GDP (Lowest)',
        value: 'Rs. 54,000',
        citation: { id: 8, source: 'MoSPI State-wise GDP Indicators', date: '2023-12' }
      }
    ]
  },
  {
    category: 'India — Metro Cities Agglomeration',
    indicators: [
      {
        label: 'Delhi Metropolitan Area Pop',
        value: '33.8 Mn',
        citation: { id: 1, source: 'UN World Urbanization Prospects', date: '2024' },
        note: 'Population figures represent the Urban Agglomeration (UA), not municipal corporation borders'
      },
      {
        label: 'Mumbai Metropolitan Area Pop',
        value: '21.3 Mn',
        citation: { id: 2, source: 'UN World Urbanization Prospects', date: '2024' }
      },
      {
        label: 'Kolkata Metropolitan Area Pop',
        value: '15.6 Mn',
        citation: { id: 3, source: 'UN World Urbanization Prospects', date: '2024' }
      },
      {
        label: 'Bangalore Metropolitan Area Pop',
        value: '14.0 Mn',
        citation: { id: 4, source: 'UN World Urbanization Prospects', date: '2024' }
      },
      {
        label: 'Chennai Metropolitan Area Pop',
        value: '12.1 Mn',
        citation: { id: 5, source: 'UN World Urbanization Prospects', date: '2024' }
      },
      {
        label: 'Hyderabad Metropolitan Area Pop',
        value: '10.8 Mn',
        citation: { id: 6, source: 'UN World Urbanization Prospects', date: '2024' }
      },
      {
        label: 'Mumbai share of National GDP',
        value: '6.1%',
        citation: { id: 7, source: 'Reserve Bank of India State Finance Database', date: '2023' }
      }
    ]
  },
  {
    category: 'India — Sector Snapshots',
    indicators: [
      {
        label: 'EV 3-Wheeler Sales Penetration',
        value: '53.2%',
        citation: { id: 1, source: 'Ministry of Road Transport (MoRTH) Vahan Dashboard', date: '2024-04' },
        note: 'Share of EVs in total registered 3-wheelers during FY24'
      },
      {
        label: 'EV 2-Wheeler Sales Penetration',
        value: '5.6%',
        citation: { id: 2, source: 'Ministry of Road Transport (MoRTH) Vahan Dashboard', date: '2024-04' }
      },
      {
        label: 'EV 4-Wheeler Sales Penetration',
        value: '2.3%',
        citation: { id: 3, source: 'Ministry of Road Transport (MoRTH) Vahan Dashboard', date: '2024-04' }
      },
      {
        label: 'Smartphone Penetration Rate',
        value: '71.2%',
        citation: { id: 4, source: 'Telecom Regulatory Authority of India (TRAI)', date: '2025' }
      },
      {
        label: 'Internet Penetration Rate',
        value: '58.6%',
        citation: { id: 5, source: 'Telecom Regulatory Authority of India (TRAI)', date: '2025' }
      },
      {
        label: 'Jan Dhan Bank Accounts Opened',
        value: '524 Mn',
        citation: { id: 6, source: 'PMJDY Official Portal, Ministry of Finance', date: '2024-05' }
      },
      {
        label: 'UPI Monthly Transaction Volume',
        value: '13.1 Bn',
        citation: { id: 7, source: 'National Payments Corporation of India (NPCI) Reports', date: '2026-05' }
      },
      {
        label: 'Registered Motor Vehicles',
        value: '340 Mn',
        citation: { id: 8, source: 'Ministry of Road Transport and Highways (MoRTH) annual statistics', date: '2023' }
      },
      {
        label: 'Organized Retail Market Share',
        value: '12.5%',
        citation: { id: 9, source: 'Retailers Association of India (RAI) Industry Note', date: '2024' },
        note: 'Comprises chain supermarkets, malls, and modern franchise trade'
      },
      {
        label: 'Unorganized Kirana Retail Share',
        value: '87.5%',
        citation: { id: 10, source: 'Retailers Association of India (RAI) Industry Note', date: '2024' }
      },
      {
        label: 'E-commerce Retail Penetration',
        value: '7.8%',
        citation: { id: 11, source: 'Invest India E-commerce Market Study', date: '2024-02' }
      }
    ]
  },
  {
    category: 'Global Sector Comparisons',
    indicators: [
      {
        label: 'China EV Market Penetration',
        value: '38.2%',
        citation: { id: 1, source: 'China Association of Automobile Manufacturers (CAAM)', date: '2024' },
        note: 'Share of New Energy Vehicles (NEVs) in total light-vehicle sales'
      },
      {
        label: 'US EV Market Penetration',
        value: '7.6%',
        citation: { id: 2, source: 'US Environmental Protection Agency (EPA) Trends Report', date: '2024' }
      },
      {
        label: 'India EV Market Penetration (Overall)',
        value: '6.3%',
        citation: { id: 3, source: 'MoRTH Vahan Dashboard FY24 summary', date: '2024-04' }
      }
    ]
  }
]
