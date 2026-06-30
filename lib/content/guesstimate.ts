import type { GuesstimateProblem, InterpretEntry, AssumptionRow } from './types'

// List of 6 Indian cities with population and banking density metrics
export const CITIES = [
  { name: 'Mumbai', population: '21 Mn', adults: '15 Mn', bankBranches: 2400, EVPenetration: '4%', dailyMetroTrips: '3.5 Mn', kiranas: 120000, avgCoffeeDrinkers: '12%', coffeeOutlets: 180 },
  { name: 'Delhi', population: '33 Mn', adults: '24 Mn', bankBranches: 3200, EVPenetration: '6%', dailyMetroTrips: '6.0 Mn', kiranas: 180000, avgCoffeeDrinkers: '8%', coffeeOutlets: 240 },
  { name: 'Bangalore', population: '14 Mn', adults: '10.5 Mn', bankBranches: 1800, EVPenetration: '12%', dailyMetroTrips: '0.8 Mn', kiranas: 90000, avgCoffeeDrinkers: '25%', coffeeOutlets: 350 },
  { name: 'Kolkata', population: '15 Mn', adults: '11.5 Mn', bankBranches: 1600, EVPenetration: '2%', dailyMetroTrips: '2.2 Mn', kiranas: 110000, avgCoffeeDrinkers: '5%', coffeeOutlets: 90 },
  { name: 'Chennai', population: '12 Mn', adults: '9 Mn', bankBranches: 1400, EVPenetration: '5%', dailyMetroTrips: '0.3 Mn', kiranas: 75000, avgCoffeeDrinkers: '30%', coffeeOutlets: 280 },
  { name: 'Hyderabad', population: '11 Mn', adults: '8 Mn', bankBranches: 1300, EVPenetration: '8%', dailyMetroTrips: '0.5 Mn', kiranas: 70000, avgCoffeeDrinkers: '18%', coffeeOutlets: 210 }
]

// Parameterized Guesstimate Generator
export function generateGuesstimateProblem(templateIdx: number, cityIdx: number): GuesstimateProblem {
  const city = CITIES[cityIdx % CITIES.length]
  const popVal = parseFloat(city.population)
  const adultVal = parseFloat(city.adults)

  if (templateIdx === 0) {
    // 1. ATMs
    const impliedATMs = Math.round((adultVal * 0.78 * 0.5 * 2) / (150 * 30) * 1000000)
    const branchATMs = Math.round(city.bankBranches * 1.5)
    const totalATMs = Math.round(branchATMs / 0.75 * 0.65)
    return {
      question: `How many ATMs are operational in ${city.name} right now?`,
      approach1: {
        name: 'Population and Banking Penetration (Top-Down)',
        rows: [
          { parameter: `${city.name} adult population (18+)`, value: `${city.adults}`, source: { id: 1, source: 'Census projected, MoSPI', date: '2026' }, sensitivity: 'Low' },
          { parameter: 'Bank account holders (% of adults)', value: '78%', source: { id: 2, source: 'RBI Report on Trend & Progress', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Cash users reliant on ATMs (est. 50%)', value: `${(adultVal * 0.78 * 0.5).toFixed(1)} Mn`, source: { id: 3, source: 'UPI adoption survey', date: '2026' }, sensitivity: 'High' },
          { parameter: 'Cash ATM transactions per user per month', value: '2', source: { id: 4, source: 'Assumption', date: '2026' }, sensitivity: 'High' },
          { parameter: 'Daily transactions (Mn)', value: `${((adultVal * 0.78 * 0.5 * 2) / 30).toFixed(2)} Mn`, source: { id: 5, source: 'Derived', date: '2026' }, sensitivity: 'Derived' },
          { parameter: 'ATM transactions per ATM per day', value: '150', source: { id: 6, source: 'RBI Payment System Indicators', date: '2025' }, sensitivity: 'Medium' }
        ],
        result: `Estimate: ~${impliedATMs.toLocaleString('en-IN')} ATMs`
      },
      approach2: {
        name: 'Bank Branch Density (Bottom-Up)',
        rows: [
          { parameter: `Total bank branches in ${city.name}`, value: `${city.bankBranches}`, source: { id: 7, source: 'RBI Branch Directory', date: '2025' }, sensitivity: 'Low' },
          { parameter: 'ATMs per branch (blended)', value: '1.5', source: { id: 8, source: 'Industry average', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Branch-based ATMs', value: `${branchATMs.toLocaleString('en-IN')}`, source: { id: 5, source: 'Derived', date: '2026' }, sensitivity: 'Derived' },
          { parameter: 'Off-site / standalone ATMs (% of total)', value: '25%', source: { id: 9, source: 'RBI Payments Indicator', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Operational adjustment (non-idle)', value: '65%', source: { id: 10, source: 'National uptime survey', date: '2025' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${totalATMs.toLocaleString('en-IN')} ATMs`
      },
      citations: [
        { id: 1, source: 'RBI Payments Report', date: '2025' },
        { id: 2, source: 'MoSPI Census Projections', date: '2026' }
      ]
    }
  } else if (templateIdx === 1) {
    // 2. Smartphones Sold Daily
    const dailySalesTopDown = Math.round((adultVal * 0.65) / (2 * 365) * 1000000)
    const storeSales = Math.round((adultVal * 15) * 0.45 / 365 * 1000)
    return {
      question: `How many smartphones are sold in ${city.name} daily?`,
      approach1: {
        name: 'User Replacement Cycle (Top-Down)',
        rows: [
          { parameter: `${city.name} smartphone users (est. 65% of adults)`, value: `${(adultVal * 0.65).toFixed(1)} Mn`, source: { id: 1, source: 'IAMAI report', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Average replacement cycle (years)', value: '2.0', source: { id: 2, source: 'IDC India Smartphone Tracker', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Annual replacement volume', value: `${((adultVal * 0.65) / 2).toFixed(2)} Mn/year`, source: { id: 3, source: 'Derived', date: '2026' }, sensitivity: 'Derived' },
          { parameter: 'New smartphone adopters (% growth/year)', value: '5%', source: { id: 4, source: 'Industry research', date: '2025' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${dailySalesTopDown.toLocaleString('en-IN')} smartphones/day`
      },
      approach2: {
        name: 'Retail Channel Sales (Bottom-Up)',
        rows: [
          { parameter: `Mobile retail counters (est. 15 per 10k adults)`, value: `${Math.round(adultVal * 1500)}`, source: { id: 5, source: 'Retail trade database', date: '2025' }, sensitivity: 'High' },
          { parameter: 'Average daily sales per counter', value: '4 units', source: { id: 6, source: 'Shopkeeper survey estimate', date: '2026' }, sensitivity: 'High' },
          { parameter: 'Online sales contribution share', value: '45%', source: { id: 7, source: 'Counterpoint Research', date: '2025' }, sensitivity: 'Medium' }
        ],
        result: `Estimate: ~${storeSales.toLocaleString('en-IN')} smartphones/day`
      },
      citations: [
        { id: 1, source: 'IDC India smartphone data', date: '2025' },
        { id: 2, source: 'Counterpoint Online Retail Share', date: '2025' }
      ]
    }
  } else if (templateIdx === 2) {
    // 3. Cups of Coffee
    const coffeeDrinkers = parseFloat(city.avgCoffeeDrinkers) / 100
    const topDownCups = Math.round(adultVal * coffeeDrinkers * 1.5 * 1000000)
    const bottomUpCups = Math.round(city.coffeeOutlets * 450 + (city.kiranas * 0.1 * 40))
    return {
      question: `How many cups of coffee are consumed in ${city.name} daily?`,
      approach1: {
        name: 'Demographic Coffee Drinkers (Top-Down)',
        rows: [
          { parameter: `${city.name} adult population`, value: `${city.adults}`, source: { id: 1, source: 'Census projected', date: '2026' }, sensitivity: 'Low' },
          { parameter: 'Active coffee drinkers (% of adults)', value: `${city.avgCoffeeDrinkers}`, source: { id: 2, source: 'Beverage Association Survey', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Average cups per drinker per day', value: '1.5', source: { id: 3, source: 'Assumption', date: '2026' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${topDownCups.toLocaleString('en-IN')} cups/day`
      },
      approach2: {
        name: 'Outlet Sales (Bottom-Up)',
        rows: [
          { parameter: `Specialty cafe outlets (Starbucks, Blue Tokai, etc.)`, value: `${city.coffeeOutlets}`, source: { id: 4, source: 'Zomato directory scrape', date: '2026' }, sensitivity: 'Medium' },
          { parameter: 'Average cups sold per cafe per day', value: '450', source: { id: 5, source: 'Industry interviews', date: '2025' }, sensitivity: 'High' },
          { parameter: `Local tea/coffee stalls selling filter coffee (10% of Kiranas)`, value: `${Math.round(city.kiranas * 0.1)}`, source: { id: 6, source: 'Estimated', date: '2026' }, sensitivity: 'High' },
          { parameter: 'Average cups sold per local stall daily', value: '40', source: { id: 7, source: 'Estimated', date: '2026' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${bottomUpCups.toLocaleString('en-IN')} cups/day`
      },
      citations: [
        { id: 1, source: 'India Coffee Board Beverage Survey', date: '2025' }
      ]
    }
  } else if (templateIdx === 3) {
    // 4. EV Chargers
    const evPen = parseFloat(city.EVPenetration) / 100
    const evCount = Math.round(adultVal * 0.05 * evPen * 1000000)
    const impliedChargers = Math.round(evCount / 22)
    const gridChargers = Math.round(city.bankBranches * 0.25 * 4)
    return {
      question: `What is the total number of public EV charging stations in ${city.name}?`,
      approach1: {
        name: 'EV Vehicle Population Ratio (Top-Down)',
        rows: [
          { parameter: `Estimated total cars in ${city.name} (5% of adults)`, value: `${(adultVal * 0.05).toFixed(2)} Mn`, source: { id: 1, source: 'RTO Registration database', date: '2026' }, sensitivity: 'Medium' },
          { parameter: `EV penetration in passenger cars`, value: `${city.EVPenetration}`, source: { id: 2, source: 'Vahan Dashboard', date: '2026' }, sensitivity: 'Low' },
          { parameter: `Total operational EVs in ${city.name}`, value: `${evCount.toLocaleString('en-IN')}`, source: { id: 3, source: 'Derived', date: '2026' }, sensitivity: 'Derived' },
          { parameter: 'EV to public charger ratio (target index)', value: '22 vehicles per charger', source: { id: 4, source: 'NITI Aayog blueprint', date: '2025' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${impliedChargers.toLocaleString('en-IN')} charging stations`
      },
      approach2: {
        name: 'Infrastructure Nodes (Bottom-Up)',
        rows: [
          { parameter: `Fuel stations in ${city.name} (proxy: 25% of bank count)`, value: `${Math.round(city.bankBranches * 0.25)}`, source: { id: 5, source: 'Petroleum Ministry directory', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'EV charging points per fuel station (average)', value: '4', source: { id: 6, source: 'Oil marketing company press releases', date: '2026' }, sensitivity: 'High' },
          { parameter: 'Corporate parks & mall installations', value: `${Math.round(city.bankBranches * 0.15 * 6)}`, source: { id: 7, source: 'Assumption', date: '2026' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${(gridChargers + Math.round(city.bankBranches * 0.15 * 6)).toLocaleString('en-IN')} charging stations`
      },
      citations: [
        { id: 1, source: 'NITI Aayog EV Charging Infrastructure report', date: '2025' },
        { id: 2, source: 'Vahan Dashboard, Ministry of Road Transport', date: '2026' }
      ]
    }
  } else if (templateIdx === 4) {
    // 5. Metro Ridership
    const dailyTrips = parseFloat(city.dailyMetroTrips)
    const topDownTrips = Math.round(adultVal * 0.22 * 1.3 * 1000000)
    return {
      question: `How many passenger trips are completed on the ${city.name} metro network daily?`,
      approach1: {
        name: 'Commuter Demographic Share (Top-Down)',
        rows: [
          { parameter: `${city.name} adult population`, value: `${city.adults}`, source: { id: 1, source: 'Census projected', date: '2026' }, sensitivity: 'Low' },
          { parameter: 'Public transit commuters (% of adults)', value: '55%', source: { id: 2, source: 'Urban Mobility study', date: '2025' }, sensitivity: 'Medium' },
          { parameter: 'Metro share of public transit commuters', value: '40%', source: { id: 3, source: 'Metro ridership survey', date: '2026' }, sensitivity: 'High' },
          { parameter: 'Average trips per commuter per day', value: '1.3', source: { id: 4, source: 'Derived from ticketing data', date: '2025' }, sensitivity: 'Medium' }
        ],
        result: `Estimate: ~${topDownTrips.toLocaleString('en-IN')} trips/day`
      },
      approach2: {
        name: 'Transit Network Capacity (Bottom-Up)',
        rows: [
          { parameter: `Reported average daily metro passenger trips`, value: `${city.dailyMetroTrips}`, source: { id: 5, source: 'Metro Rail Corporation releases', date: '2026' }, sensitivity: 'Low' }
        ],
        result: `Actual/Estimate: ~${(dailyTrips * 1000000).toLocaleString('en-IN')} trips/day`
      },
      citations: [
        { id: 1, source: 'Ministry of Housing and Urban Affairs Transit reports', date: '2025' }
      ]
    }
  } else {
    // 6. Kiranas
    const householdCount = Math.round(popVal * 1000000 / 4.5)
    const kiranasTopDown = Math.round(householdCount / 100)
    return {
      question: `How many local Kirana stores are active in ${city.name}?`,
      approach1: {
        name: 'Household Density Service Ratio (Top-Down)',
        rows: [
          { parameter: `${city.name} population`, value: `${city.population}`, source: { id: 1, source: 'Census projected', date: '2026' }, sensitivity: 'Low' },
          { parameter: 'Average household size', value: '4.5 members', source: { id: 2, source: 'NFHS-5 survey data', date: '2022' }, sensitivity: 'Medium' },
          { parameter: 'Total households', value: `${householdCount.toLocaleString('en-IN')}`, source: { id: 3, source: 'Derived', date: '2026' }, sensitivity: 'Derived' },
          { parameter: 'Households served per Kirana store', value: '100', source: { id: 4, source: 'FMCG retail audit', date: '2025' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${kiranasTopDown.toLocaleString('en-IN')} Kirana stores`
      },
      approach2: {
        name: 'Local Street Grid density (Bottom-Up)',
        rows: [
          { parameter: `Approximate total street length in ${city.name} (km)`, value: `${Math.round(popVal * 180)} km`, source: { id: 5, source: 'Municipal corporation records', date: '2025' }, sensitivity: 'High' },
          { parameter: 'Average Kirana stores per km of street', value: '4', source: { id: 6, source: 'FMCG distributor route maps', date: '2025' }, sensitivity: 'High' }
        ],
        result: `Estimate: ~${city.kiranas.toLocaleString('en-IN')} Kirana stores`
      },
      citations: [
        { id: 1, source: 'Retailers Association of India FMCG audit', date: '2025' }
      ]
    }
  }
}

// 1. Initial Guesstimate ATM problem preserved
export const guesstimateProblemPool: GuesstimateProblem[] = [
  {
    question: 'How many ATMs are operational in India right now?',
    approach1: {
      name: 'Population and Banking Penetration (Top-Down)',
      rows: [
        { parameter: 'India adult population (18+)', value: '1,000 Mn', source: { id: 1, source: 'Census 2011 + projected, MoSPI', date: '2024' }, sensitivity: 'Low' },
        { parameter: 'Bank account holders (% of adults)', value: '78% (780 Mn)', source: { id: 2, source: 'RBI Report on Trend & Progress of Banking', date: '2023' }, sensitivity: 'Medium' },
        { parameter: 'Cash users reliant on ATMs (est. 50% of account holders)', value: '390 Mn users', source: { id: 1, source: 'Assumption based on UPI adoption', date: '2024' }, sensitivity: 'High' },
        { parameter: 'ATM transactions per ATM per day', value: '~150 transactions', source: { id: 3, source: 'RBI Payment System Indicators', date: '2023' }, sensitivity: 'Medium' },
        { parameter: 'Cash ATM transactions per user per month', value: '2 per month', source: { id: 1, source: 'Assumption', date: '2024' }, sensitivity: 'High' },
        { parameter: 'Implied monthly transactions (390 Mn x 2)', value: '780 Mn/month = 26 Mn/day', source: { id: 1, source: 'Derived', date: '2024' }, sensitivity: 'Derived' },
        { parameter: 'Implied ATMs (26 Mn / 150 per ATM)', value: '~173,000 ATMs', source: { id: 1, source: 'Derived', date: '2024' }, sensitivity: 'Derived' }
      ],
      result: 'Estimate: ~1,70,000-1,80,000 ATMs',
    },
    approach2: {
      name: 'Bank Branch Density (Bottom-Up)',
      rows: [
        { parameter: 'Total scheduled bank branches in India', value: '~1,60,000', source: { id: 2, source: 'RBI Report on Trend & Progress of Banking', date: '2023' }, sensitivity: 'Low' },
        { parameter: 'ATMs per branch (urban branches ~3-4, rural ~1)', value: 'Blended ~1.5 ATMs per branch', source: { id: 1, source: 'Industry assumption', date: '2024' }, sensitivity: 'Medium' },
        { parameter: 'Branch-based ATMs', value: '1,60,000 x 1.5 = 2,40,000', source: { id: 1, source: 'Derived', date: '2024' }, sensitivity: 'Derived' },
        { parameter: 'Off-site / standalone ATMs (malls, railways, etc.)', value: '~25% of total', source: { id: 3, source: 'RBI Payment System Indicators', date: '2023' }, sensitivity: 'Medium' },
        { parameter: 'Total implied', value: '~2,40,000 / 0.75 = ~3,20,000 (gross); adjust for ~35% idle/non-operational', source: { id: 1, source: 'Derived', date: '2024' }, sensitivity: 'Derived' }
      ],
      result: 'Estimate: ~2,10,000 operational ATMs (applying ~35% non-operational adjustment)',
    },
    citations: [
      { id: 1, source: 'Assumption / derived', date: '2024' },
      { id: 2, source: 'RBI Report on Trend & Progress of Banking', date: '2023' },
      { id: 3, source: 'RBI Payment System Indicators', date: '2023' }
    ]
  }
]

export const interpretPool: InterpretEntry[] = [
  {
    title: 'India UPI vs Cash Withdrawal Trends (FY19-FY24)',
    description:
      'The table below shows the five-year trajectory of UPI transaction volume and value alongside ATM cash withdrawal volume and value. Interpret the trend and its business implications.',
    tableData: {
      headers: ['Financial Year', 'UPI Transactions (Bn)', 'UPI Value (Rs. Lakh Cr)', 'ATM Withdrawals (Bn)', 'ATM Value (Rs. Lakh Cr)'],
      rows: [
        ['FY19', '5.4', '8.8', '9.1', '29.3'],
        ['FY20', '12.5', '21.3', '8.9', '28.7'],
        ['FY21', '22.3', '41.0', '7.8', '24.5'],
        ['FY22', '46.0', '84.2', '8.2', '26.1'],
        ['FY23', '83.8', '139.1', '8.8', '28.2'],
        ['FY24', '131.0', '199.9', '9.3', '30.1'],
      ],
    },
    questions: [
      {
        question: 'What does the trajectory of ATM cash withdrawals between FY21 and FY24 tell you?',
        answer: 'ATM withdrawals dipped in FY21 (likely Covid lockdown effect — less physical commerce) but recovered to near FY19 levels by FY23-24. This tells you that despite UPI\'s explosive growth, absolute cash withdrawal demand has not declined — India is not substituting cash with digital, it is adding digital on top. This is a key insight: UPI is growing the total payments pie, not cannibalizing cash.',
      },
      {
        question: 'If you were advising a bank on ATM network investment, what would you recommend based on this data?',
        answer: 'The data supports maintaining the ATM network rather than aggressive rationalization. Cash demand is stable in absolute terms (Rs. 28-30 lakh crore annually). However, the investment priority should shift from urban ATM expansion (where UPI penetration is highest) to rural ATM placement (where cash remains dominant). Micro-ATM (handheld BC agent-operated ATMs) may be more economical than full ATMs in underserved rural areas.',
      },
      {
        question: 'What additional data would you want before making a definitive recommendation on ATM investment?',
        answer: 'ATM profitability by geography (urban vs. rural vs. semi-urban), ATM uptime / availability rates, cost per transaction at ATM vs. digital alternatives for the bank, and demographic breakdown of cash vs. digital users by income tier. Aggregate data masks the heterogeneity that drives the actual business decision.',
      },
    ],
    citations: [
      { id: 1, source: 'RBI Payment System Indicators, FY24 Annual Report', date: '2024' },
      { id: 2, source: 'NPCI UPI Transaction Statistics', date: '2024' },
    ],
  },
  {
    title: 'EV Passenger Car Sales in India vs China (2020-2025)',
    description:
      'Compare the growth trajectory, sales volumes, and market penetration percentages of electric passenger vehicles between the two largest developing automotive markets.',
    tableData: {
      headers: ['Year', 'India EV Sales (Units)', 'India EV Penetration (%)', 'China EV Sales (Mn Units)', 'China EV Penetration (%)'],
      rows: [
        ['2020', '3,000', '0.1%', '1.1', '5.4%'],
        ['2021', '14,800', '0.5%', '2.9', '14.8%'],
        ['2022', '48,000', '1.3%', '5.4', '25.6%'],
        ['2023', '82,000', '2.1%', '7.2', '35.7%'],
        ['2024', '1,10,000', '2.8%', '9.1', '42.2%'],
        ['2025', '1,45,000', '3.6%', '10.5', '48.5%'],
      ]
    },
    questions: [
      {
        question: 'Analyze the penetration gap between India and China. What structural issues does this highlight?',
        answer: 'China\'s EV penetration reached nearly 50% by 2025, while India is at 3.6%. This highlights massive differences in: (1) charging grid density, (2) upfront purchase incentives (China had multi-year national consumer subsidies), and (3) product availability (China has over 100 active EV brands at diverse price segments; India is highly consolidated with one dominant vendor Tata Motors holding ~70% market share).'
      },
      {
        question: 'What is the implied market size CAGR of India EV sales based on this 5-year trajectory?',
        answer: 'India EV sales grew from 3,000 in 2020 to 1,45,000 in 2025. This represents an incredible CAGR of over 115% per year, albeit starting from a near-zero base. For a component manufacturer or charging provider, this indicates high structural growth opportunity despite low absolute penetration.'
      }
    ],
    citations: [
      { id: 1, source: 'Vahan Dashboard, MoRTH India', date: '2026' },
      { id: 2, source: 'China Association of Automobile Manufacturers (CAAM)', date: '2026' }
    ]
  },
  {
    title: 'FMCG Retail Share in India: Kiranas vs E-commerce & Q-comm (2018-2024)',
    description:
      'The data tracks the percentage share of retail sales in the Fast-Moving Consumer Goods (FMCG) sector across three channels: traditional mom-and-pop Kirana stores, modern trade (supermarkets), and digital/quick-commerce networks.',
    tableData: {
      headers: ['Year', 'Kirana Share (%)', 'Supermarket Share (%)', 'E-commerce & Q-comm (%)'],
      rows: [
        ['2018', '88.0%', '10.5%', '1.5%'],
        ['2020', '85.5%', '11.0%', '3.5%'],
        ['2021', '83.0%', '11.5%', '5.5%'],
        ['2022', '81.0%', '12.0%', '7.0%'],
        ['2023', '78.5%', '12.5%', '9.0%'],
        ['2024', '74.0%', '13.0%', '13.0%'],
      ]
    },
    questions: [
      {
        question: 'Interpret the shift in channel shares between 2023 and 2024. What accelerated the change?',
        answer: 'Between 2023 and 2024, traditional Kirana share saw its largest single-year drop (78.5% to 74.0%), while E-commerce and Quick-commerce surged to tie modern supermarkets at 13.0% share. This was driven by the hyper-expansion of Quick-Commerce (Blinkit, Zepto, Swiggy Instamart) in metro areas, shifting high-frequency grocery replenishment purchases away from neighborhood mom-and-pop stores.'
      },
      {
        question: 'Is the traditional Kirana network dying, or is it structurally resilient?',
        answer: 'While Kirana share fell from 88% to 74% in percentage terms, the absolute value of the Indian retail market grew by ~50% in this period. Thus, absolute Kirana revenues actually increased or remained flat. The traditional network is resilient due to: (1) offering instant interest-free consumer credit (Khata system), (2) high density inside local colonies, and (3) very low operational overhead (family-run, zero rent).'
      }
    ],
    citations: [
      { id: 1, source: 'NielsenIQ India FMCG Retail Audit', date: '2025' }
    ]
  }
]
