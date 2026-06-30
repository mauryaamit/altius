import type { IndiaFactSection } from './types'

export const indiaFactSections: IndiaFactSection[] = [
  {
    category: 'Macro',
    facts: [
      {
        label: 'GDP (nominal, FY26)',
        value: 'USD 3.93 Trillion',
        citation: { id: 1, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' },
        trend: 'up',
      },
      {
        label: 'GDP per capita (nominal, FY26)',
        value: 'USD 2,730',
        citation: { id: 2, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' },
        trend: 'up',
      },
      {
        label: 'Real GDP growth rate (FY26)',
        value: '7.0%',
        citation: { id: 3, source: 'Ministry of Statistics & Programme Implementation (MoSPI)', date: '2026-05' },
        trend: 'up',
      },
      {
        label: 'Fiscal deficit (% of GDP, FY26)',
        value: '5.1%',
        citation: { id: 4, source: 'Controller General of Accounts (CGA), Ministry of Finance', date: '2026-05' },
        trend: 'down',
      },
      {
        label: 'Current account deficit (% of GDP, FY26)',
        value: '1.1%',
        citation: { id: 5, source: 'Reserve Bank of India (RBI) Balance of Payments Data', date: '2026-06' },
        trend: 'down',
      },
      {
        label: 'Forex reserves',
        value: 'USD 655 Bn',
        citation: { id: 6, source: 'RBI Weekly Statistical Supplement', date: '2026-06-12' },
        trend: 'up',
      },
      {
        label: 'Repo rate',
        value: '6.5%',
        citation: { id: 7, source: 'RBI Monetary Policy Committee Statement', date: '2026-06-07' },
        trend: 'flat',
      },
      {
        label: 'CPI inflation (May 2026)',
        value: '4.75%',
        citation: { id: 8, source: 'MoSPI Consumer Price Index Release', date: '2026-06-12' },
        trend: 'down',
      },
    ],
  },
  {
    category: 'Demographics',
    facts: [
      {
        label: 'Total population (2026 estimate)',
        value: '1.44 Billion',
        citation: { id: 1, source: 'UN Population Division, World Population Prospects', date: '2026' },
        trend: 'up',
      },
      {
        label: 'Urban population share',
        value: '36.5%',
        citation: { id: 2, source: 'Ministry of Housing and Urban Affairs (MoHUA) projection', date: '2024' },
        trend: 'up',
        note: 'Calculated using Census 2011 baseline (31.2%) adjusted for urban migration; the official decennial Census 2021 remains delayed indefinitely post-pandemic.'
      },
      {
        label: 'Median age',
        value: '28.2 years',
        citation: { id: 3, source: 'UN Population Division, World Population Prospects', date: '2025' },
        trend: 'up',
      },
      {
        label: 'Working-age population (15-64 years)',
        value: '67.8%',
        citation: { id: 4, source: 'UN Population Division database', date: '2025' },
        trend: 'up',
        note: 'Represents India\'s ongoing demographic dividend phase, projected to peak around 2030.'
      },
      {
        label: 'Dependency ratio',
        value: '48.2 per 100 working-age',
        citation: { id: 5, source: 'MoSPI Demographic Statistics', date: '2024' },
        trend: 'down',
      },
    ],
  },
  {
    category: 'Labour',
    facts: [
      {
        label: 'Labour force participation rate (LFPR)',
        value: '41.3%',
        citation: { id: 1, source: 'Periodic Labour Force Survey (PLFS) Annual Report, MoSPI', date: '2024-05' },
        trend: 'up',
        note: 'Overall national LFPR across all age groups. Note: The decennial Census 2021 delay limits exact population-weighted calibration.'
      },
      {
        label: 'Female LFPR',
        value: '35.6%',
        citation: { id: 2, source: 'PLFS Annual Report, MoSPI', date: '2024-05' },
        trend: 'up',
        note: 'Reflects a gradual increase from 23.3% in 2017-18, driven primarily by self-employment in rural agriculture.'
      },
      {
        label: 'Urban unemployment rate',
        value: '6.7%',
        citation: { id: 3, source: 'PLFS Quarterly Bulletin, MoSPI', date: '2026-05' },
        trend: 'down',
      },
      {
        label: 'Informal sector employment share',
        value: '89.2%',
        citation: { id: 4, source: 'International Labour Organization (ILO) India Employment Report', date: '2024' },
        trend: 'flat',
        note: 'Reflects the persistent structural share of unorganized enterprises and contract labor in non-agricultural sectors.'
      },
    ],
  },
  {
    category: 'Social',
    facts: [
      {
        label: 'Literacy rate',
        value: '77.7%',
        citation: { id: 1, source: 'National Family Health Survey (NFHS-5)', date: '2021' },
        trend: 'up',
        note: 'Calculated from NFHS-5 survey microdata; Census 2011 reported 73.0%.'
      },
      {
        label: 'Human Development Index (HDI) rank',
        value: '134 of 193',
        citation: { id: 2, source: 'UNDP Human Development Report', date: '2024-03' },
        trend: 'up',
      },
      {
        label: 'Multidimensional Poverty Index headcount',
        value: '11.3%',
        citation: { id: 3, source: 'NITI Aayog National Multidimensional Poverty Index Report', date: '2023-07' },
        trend: 'down',
        note: 'Represents individuals below the poverty threshold across health, education, and standard of living dimensions.'
      },
      {
        label: 'Active Internet users',
        value: '820 Million',
        citation: { id: 4, source: 'Internet and Mobile Association of India (IAMAI)', date: '2024-03' },
        trend: 'up',
      },
    ],
  },
  {
    category: 'Global Standing',
    facts: [
      {
        label: 'GDP rank (nominal)',
        value: '5th globally',
        citation: { id: 1, source: 'IMF World Economic Outlook (WEO)', date: '2025-10' },
        trend: 'up',
        note: 'Behind US, China, Germany, and Japan.'
      },
      {
        label: 'Exports (goods + services, FY25)',
        value: 'USD 776 Billion',
        citation: { id: 2, source: 'Ministry of Commerce & Industry annual summary', date: '2025-04' },
        trend: 'up',
      },
      {
        label: 'FDI inflows (FY25)',
        value: 'USD 44.4 Billion',
        citation: { id: 3, source: 'DPIIT Foreign Direct Investment Statistics', date: '2025-06' },
        trend: 'down',
      },
      {
        label: 'Ease of Doing Business rank (last official)',
        value: '63 of 190',
        citation: { id: 4, source: 'World Bank Doing Business Report', date: '2020' },
        trend: 'up',
        note: 'The World Bank discontinued the Ease of Doing Business index in 2021; this remains the last official comparative rank.'
      },
    ],
  },
]
