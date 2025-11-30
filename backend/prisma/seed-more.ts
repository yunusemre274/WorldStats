// Additional countries seed script - follows existing seed.ts pattern
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Country definitions
const additionalCountries = [
  { code: 'CA', code3: 'CAN', name: 'Canada', officialName: 'Canada', region: 'Americas', subregion: 'North America', capital: 'Ottawa', population: BigInt(38929902), area: 9984670, flagUrl: 'https://flagcdn.com/w320/ca.png', latitude: 45.4215, longitude: -75.6972 },
  { code: 'IT', code3: 'ITA', name: 'Italy', officialName: 'Italian Republic', region: 'Europe', subregion: 'Southern Europe', capital: 'Rome', population: BigInt(58853482), area: 301340, flagUrl: 'https://flagcdn.com/w320/it.png', latitude: 41.9028, longitude: 12.4964 },
  { code: 'ES', code3: 'ESP', name: 'Spain', officialName: 'Kingdom of Spain', region: 'Europe', subregion: 'Southern Europe', capital: 'Madrid', population: BigInt(47519628), area: 505992, flagUrl: 'https://flagcdn.com/w320/es.png', latitude: 40.4168, longitude: -3.7038 },
  { code: 'KR', code3: 'KOR', name: 'South Korea', officialName: 'Republic of Korea', region: 'Asia', subregion: 'Eastern Asia', capital: 'Seoul', population: BigInt(51784059), area: 100210, flagUrl: 'https://flagcdn.com/w320/kr.png', latitude: 37.5665, longitude: 126.978 },
  { code: 'MX', code3: 'MEX', name: 'Mexico', officialName: 'United Mexican States', region: 'Americas', subregion: 'Central America', capital: 'Mexico City', population: BigInt(128900000), area: 1964375, flagUrl: 'https://flagcdn.com/w320/mx.png', latitude: 19.4326, longitude: -99.1332 },
  { code: 'TR', code3: 'TUR', name: 'Turkey', officialName: 'Republic of Türkiye', region: 'Asia', subregion: 'Western Asia', capital: 'Ankara', population: BigInt(85279553), area: 783562, flagUrl: 'https://flagcdn.com/w320/tr.png', latitude: 39.9334, longitude: 32.8597 },
];

// Demographics data
const demographicsData = [
  { countryCode: 'CA', totalPopulation: BigInt(38929902), malePopulation: BigInt(19200000), femalePopulation: BigInt(19729902), maleFemaleRatio: '49% / 51%', populationGrowthRate: 0.9, medianAge: 41.1, lifeExpectancy: 82.3, lifeExpectancyMale: 80.1, lifeExpectancyFemale: 84.4, birthRate: 10.2, deathRate: 8.0, fertilityRate: 1.47, infantMortalityRate: 4.3, urbanPopulationPercent: 81.6, childPopulationPercent: 16.0, workingAgePercent: 66.5, elderlyPercent: 17.5, averageIQ: 99 },
  { countryCode: 'IT', totalPopulation: BigInt(58853482), malePopulation: BigInt(28700000), femalePopulation: BigInt(30153482), maleFemaleRatio: '49% / 51%', populationGrowthRate: -0.4, medianAge: 47.3, lifeExpectancy: 83.5, lifeExpectancyMale: 81.1, lifeExpectancyFemale: 85.7, birthRate: 7.0, deathRate: 12.0, fertilityRate: 1.24, infantMortalityRate: 2.8, urbanPopulationPercent: 71.3, childPopulationPercent: 13.0, workingAgePercent: 63.5, elderlyPercent: 23.5, averageIQ: 102 },
  { countryCode: 'ES', totalPopulation: BigInt(47519628), malePopulation: BigInt(23200000), femalePopulation: BigInt(24319628), maleFemaleRatio: '49% / 51%', populationGrowthRate: 0.1, medianAge: 44.9, lifeExpectancy: 83.6, lifeExpectancyMale: 80.9, lifeExpectancyFemale: 86.2, birthRate: 7.3, deathRate: 9.7, fertilityRate: 1.19, infantMortalityRate: 2.6, urbanPopulationPercent: 81.1, childPopulationPercent: 14.5, workingAgePercent: 65.0, elderlyPercent: 20.5, averageIQ: 98 },
  { countryCode: 'KR', totalPopulation: BigInt(51784059), malePopulation: BigInt(25800000), femalePopulation: BigInt(25984059), maleFemaleRatio: '50% / 50%', populationGrowthRate: 0.0, medianAge: 44.3, lifeExpectancy: 83.7, lifeExpectancyMale: 80.6, lifeExpectancyFemale: 86.6, birthRate: 5.9, deathRate: 7.3, fertilityRate: 0.78, infantMortalityRate: 2.7, urbanPopulationPercent: 81.4, childPopulationPercent: 11.9, workingAgePercent: 70.7, elderlyPercent: 17.4, averageIQ: 106 },
  { countryCode: 'MX', totalPopulation: BigInt(128900000), malePopulation: BigInt(62800000), femalePopulation: BigInt(66100000), maleFemaleRatio: '49% / 51%', populationGrowthRate: 0.8, medianAge: 29.3, lifeExpectancy: 75.1, lifeExpectancyMale: 72.1, lifeExpectancyFemale: 78.2, birthRate: 16.5, deathRate: 6.5, fertilityRate: 1.8, infantMortalityRate: 12.0, urbanPopulationPercent: 80.7, childPopulationPercent: 25.3, workingAgePercent: 66.5, elderlyPercent: 8.2, averageIQ: 88 },
  { countryCode: 'TR', totalPopulation: BigInt(85279553), malePopulation: BigInt(42500000), femalePopulation: BigInt(42779553), maleFemaleRatio: '50% / 50%', populationGrowthRate: 0.7, medianAge: 32.2, lifeExpectancy: 78.0, lifeExpectancyMale: 75.4, lifeExpectancyFemale: 80.8, birthRate: 14.3, deathRate: 5.9, fertilityRate: 1.9, infantMortalityRate: 8.6, urbanPopulationPercent: 76.6, childPopulationPercent: 22.4, workingAgePercent: 68.0, elderlyPercent: 9.6, averageIQ: 90 },
];

// Economy data
const economyData = [
  { countryCode: 'CA', gdp: 2139840000000, gdpPerCapita: 54966, gdpGrowthRate: 3.4, gdpPpp: 2117000000000, inflation: 3.9, unemploymentRate: 5.4, povertyRate: 6.4, giniIndex: 33.3, publicDebt: 106.4, tradeBalance: -24500000000, exports: 598000000000, imports: 622500000000, minimumWage: 2400, averageIncome: 52000, currency: 'Canadian Dollar', currencyCode: 'CAD', gdpGrowthHistory: [2.9, -5.2, 5.0, 3.4] },
  { countryCode: 'IT', gdp: 2107703000000, gdpPerCapita: 35819, gdpGrowthRate: 3.7, gdpPpp: 2972000000000, inflation: 5.9, unemploymentRate: 7.8, povertyRate: 20.1, giniIndex: 35.9, publicDebt: 144.4, tradeBalance: 47000000000, exports: 660000000000, imports: 613000000000, minimumWage: 0, averageIncome: 35000, currency: 'Euro', currencyCode: 'EUR', gdpGrowthHistory: [0.5, -9.0, 7.0, 3.7] },
  { countryCode: 'ES', gdp: 1418000000000, gdpPerCapita: 29837, gdpGrowthRate: 5.5, gdpPpp: 2000000000000, inflation: 3.5, unemploymentRate: 12.9, povertyRate: 20.7, giniIndex: 34.7, publicDebt: 113.2, tradeBalance: -35000000000, exports: 468000000000, imports: 503000000000, minimumWage: 1260, averageIncome: 30000, currency: 'Euro', currencyCode: 'EUR', gdpGrowthHistory: [2.0, -11.3, 5.5, 5.5] },
  { countryCode: 'KR', gdp: 1804680000000, gdpPerCapita: 34801, gdpGrowthRate: 2.6, gdpPpp: 2740000000000, inflation: 5.1, unemploymentRate: 2.9, povertyRate: 14.4, giniIndex: 31.4, publicDebt: 51.3, tradeBalance: 25000000000, exports: 644000000000, imports: 619000000000, minimumWage: 1680, averageIncome: 42000, currency: 'South Korean Won', currencyCode: 'KRW', gdpGrowthHistory: [2.2, -0.7, 4.3, 2.6] },
  { countryCode: 'MX', gdp: 1414187000000, gdpPerCapita: 10948, gdpGrowthRate: 3.1, gdpPpp: 2707000000000, inflation: 7.9, unemploymentRate: 3.3, povertyRate: 41.9, giniIndex: 45.4, publicDebt: 49.6, tradeBalance: -26000000000, exports: 578000000000, imports: 604000000000, minimumWage: 340, averageIncome: 15000, currency: 'Mexican Peso', currencyCode: 'MXN', gdpGrowthHistory: [-0.3, -8.0, 4.7, 3.1] },
  { countryCode: 'TR', gdp: 905988000000, gdpPerCapita: 10616, gdpGrowthRate: 5.6, gdpPpp: 3212000000000, inflation: 72.3, unemploymentRate: 9.4, povertyRate: 14.4, giniIndex: 41.9, publicDebt: 31.7, tradeBalance: -88000000000, exports: 254000000000, imports: 342000000000, minimumWage: 520, averageIncome: 12000, currency: 'Turkish Lira', currencyCode: 'TRY', gdpGrowthHistory: [0.9, 1.9, 11.4, 5.6] },
];

// Military data
const militaryData = [
  { countryCode: 'CA', globalRank: 27, totalMilitaryPersonnel: 95000, activeSoldiers: 68000, reservePersonnel: 27000, defenseSpending: 26900000000, defenseSpendingPercent: 1.3, tanks: 82, armoredVehicles: 1900, totalAircraft: 391, fighters: 77, navalVessels: 63, aircraftCarriers: 0, submarines: 4, nuclearWeapons: false, isNatoMember: true },
  { countryCode: 'IT', globalRank: 10, totalMilitaryPersonnel: 183800, activeSoldiers: 165500, reservePersonnel: 18300, defenseSpending: 29000000000, defenseSpendingPercent: 1.5, tanks: 200, armoredVehicles: 6100, totalAircraft: 862, fighters: 94, navalVessels: 184, aircraftCarriers: 2, submarines: 8, nuclearWeapons: false, isNatoMember: true },
  { countryCode: 'ES', globalRank: 19, totalMilitaryPersonnel: 135000, activeSoldiers: 120000, reservePersonnel: 15000, defenseSpending: 15000000000, defenseSpendingPercent: 1.2, tanks: 327, armoredVehicles: 2200, totalAircraft: 520, fighters: 138, navalVessels: 137, aircraftCarriers: 1, submarines: 4, nuclearWeapons: false, isNatoMember: true },
  { countryCode: 'KR', globalRank: 6, totalMilitaryPersonnel: 3600000, activeSoldiers: 500000, reservePersonnel: 3100000, defenseSpending: 46000000000, defenseSpendingPercent: 2.7, tanks: 2130, armoredVehicles: 3100, totalAircraft: 1576, fighters: 402, navalVessels: 234, aircraftCarriers: 0, submarines: 22, nuclearWeapons: false, isNatoMember: false },
  { countryCode: 'MX', globalRank: 31, totalMilitaryPersonnel: 359000, activeSoldiers: 277000, reservePersonnel: 82000, defenseSpending: 8500000000, defenseSpendingPercent: 0.5, tanks: 0, armoredVehicles: 695, totalAircraft: 478, fighters: 0, navalVessels: 143, aircraftCarriers: 0, submarines: 0, nuclearWeapons: false, isNatoMember: false },
  { countryCode: 'TR', globalRank: 8, totalMilitaryPersonnel: 733900, activeSoldiers: 355200, reservePersonnel: 378700, defenseSpending: 10600000000, defenseSpendingPercent: 1.2, tanks: 3022, armoredVehicles: 9500, totalAircraft: 1067, fighters: 207, navalVessels: 156, aircraftCarriers: 0, submarines: 12, nuclearWeapons: false, isNatoMember: true },
];

// Politics data
const politicsData = [
  { countryCode: 'CA', governmentType: 'Federal Parliamentary Constitutional Monarchy', chiefOfState: 'King CHARLES III', headOfGovernment: 'Prime Minister Justin TRUDEAU', isEU: false, isUN: true, isNato: true, isG7: true, isG20: true, isBrics: false, passportRanking: 7, passportVisaFree: 185, democracyIndex: 8.88, corruptionIndex: 74, humanDevelopmentIndex: 0.936 },
  { countryCode: 'IT', governmentType: 'Parliamentary Republic', chiefOfState: 'President Sergio MATTARELLA', headOfGovernment: 'Prime Minister Giorgia MELONI', isEU: true, isUN: true, isNato: true, isG7: true, isG20: true, isBrics: false, passportRanking: 3, passportVisaFree: 192, democracyIndex: 7.68, corruptionIndex: 56, humanDevelopmentIndex: 0.895 },
  { countryCode: 'ES', governmentType: 'Parliamentary Constitutional Monarchy', chiefOfState: 'King FELIPE VI', headOfGovernment: 'Prime Minister Pedro SÁNCHEZ', isEU: true, isUN: true, isNato: true, isG7: false, isG20: true, isBrics: false, passportRanking: 3, passportVisaFree: 192, democracyIndex: 8.07, corruptionIndex: 60, humanDevelopmentIndex: 0.905 },
  { countryCode: 'KR', governmentType: 'Presidential Republic', chiefOfState: 'President YOON Suk Yeol', headOfGovernment: 'Prime Minister HAN Duck-soo', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: false, passportRanking: 2, passportVisaFree: 193, democracyIndex: 8.16, corruptionIndex: 63, humanDevelopmentIndex: 0.925 },
  { countryCode: 'MX', governmentType: 'Federal Presidential Republic', chiefOfState: 'President Claudia SHEINBAUM', headOfGovernment: 'President Claudia SHEINBAUM', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: false, passportRanking: 24, passportVisaFree: 159, democracyIndex: 5.57, corruptionIndex: 31, humanDevelopmentIndex: 0.758 },
  { countryCode: 'TR', governmentType: 'Presidential Republic', chiefOfState: 'President Recep Tayyip ERDOGAN', headOfGovernment: 'President Recep Tayyip ERDOGAN', isEU: false, isUN: true, isNato: true, isG7: false, isG20: true, isBrics: false, passportRanking: 52, passportVisaFree: 118, democracyIndex: 4.35, corruptionIndex: 36, humanDevelopmentIndex: 0.838 },
];

// Crime data
const crimeData = [
  { countryCode: 'CA', crimeIndex: 43.0, safetyIndex: 57.0, totalCrimeRate: 35.2, homicideRate: 2.0, categories: [{ category: 'Property Crime', percentage: 42 }, { category: 'Drug Offenses', percentage: 15 }, { category: 'Violent Crime', percentage: 18 }, { category: 'Fraud', percentage: 14 }, { category: 'Cyber Crime', percentage: 11 }] },
  { countryCode: 'IT', crimeIndex: 46.0, safetyIndex: 54.0, totalCrimeRate: 40.5, homicideRate: 0.5, categories: [{ category: 'Property Crime', percentage: 45 }, { category: 'Fraud', percentage: 18 }, { category: 'Drug Offenses', percentage: 12 }, { category: 'Violent Crime', percentage: 15 }, { category: 'Cyber Crime', percentage: 10 }] },
  { countryCode: 'ES', crimeIndex: 32.0, safetyIndex: 68.0, totalCrimeRate: 35.0, homicideRate: 0.6, categories: [{ category: 'Property Crime', percentage: 50 }, { category: 'Drug Offenses', percentage: 12 }, { category: 'Fraud', percentage: 15 }, { category: 'Violent Crime', percentage: 13 }, { category: 'Cyber Crime', percentage: 10 }] },
  { countryCode: 'KR', crimeIndex: 27.8, safetyIndex: 72.2, totalCrimeRate: 22.5, homicideRate: 0.6, categories: [{ category: 'Property Crime', percentage: 35 }, { category: 'Fraud', percentage: 22 }, { category: 'Drug Offenses', percentage: 8 }, { category: 'Violent Crime', percentage: 20 }, { category: 'Cyber Crime', percentage: 15 }] },
  { countryCode: 'MX', crimeIndex: 53.8, safetyIndex: 46.2, totalCrimeRate: 52.0, homicideRate: 26.6, categories: [{ category: 'Violent Crime', percentage: 35 }, { category: 'Drug Offenses', percentage: 25 }, { category: 'Property Crime', percentage: 22 }, { category: 'Kidnapping', percentage: 8 }, { category: 'Other', percentage: 10 }] },
  { countryCode: 'TR', crimeIndex: 40.5, safetyIndex: 59.5, totalCrimeRate: 38.0, homicideRate: 2.5, categories: [{ category: 'Property Crime', percentage: 40 }, { category: 'Violent Crime', percentage: 20 }, { category: 'Drug Offenses', percentage: 15 }, { category: 'Fraud', percentage: 15 }, { category: 'Other', percentage: 10 }] },
];

// Health data
const healthData = [
  { countryCode: 'CA', smokingRate: 10.3, alcoholConsumption: 8.9, alcoholDependencyRate: 3.0, drugUseRate: 3.2, obesityRate: 29.4, healthcareSpendingPercent: 12.0, hospitalBedsPer1000: 2.5, physiciansPer1000: 2.7, suicideRate: 11.8, diabetesPrevalence: 7.6 },
  { countryCode: 'IT', smokingRate: 19.0, alcoholConsumption: 7.5, alcoholDependencyRate: 2.8, drugUseRate: 1.5, obesityRate: 19.9, healthcareSpendingPercent: 8.7, hospitalBedsPer1000: 3.2, physiciansPer1000: 4.0, suicideRate: 5.5, diabetesPrevalence: 5.0 },
  { countryCode: 'ES', smokingRate: 22.0, alcoholConsumption: 10.0, alcoholDependencyRate: 3.5, drugUseRate: 2.0, obesityRate: 23.8, healthcareSpendingPercent: 9.1, hospitalBedsPer1000: 3.0, physiciansPer1000: 4.4, suicideRate: 7.5, diabetesPrevalence: 6.9 },
  { countryCode: 'KR', smokingRate: 16.4, alcoholConsumption: 10.2, alcoholDependencyRate: 4.5, drugUseRate: 0.5, obesityRate: 4.7, healthcareSpendingPercent: 8.4, hospitalBedsPer1000: 12.4, physiciansPer1000: 2.5, suicideRate: 24.6, diabetesPrevalence: 6.9 },
  { countryCode: 'MX', smokingRate: 7.6, alcoholConsumption: 5.5, alcoholDependencyRate: 4.0, drugUseRate: 2.5, obesityRate: 28.9, healthcareSpendingPercent: 5.4, hospitalBedsPer1000: 1.0, physiciansPer1000: 2.4, suicideRate: 5.3, diabetesPrevalence: 13.1 },
  { countryCode: 'TR', smokingRate: 28.0, alcoholConsumption: 2.0, alcoholDependencyRate: 2.5, drugUseRate: 0.5, obesityRate: 32.1, healthcareSpendingPercent: 4.3, hospitalBedsPer1000: 2.9, physiciansPer1000: 2.2, suicideRate: 2.4, diabetesPrevalence: 11.1 },
];

// Education data
const educationData = [
  { countryCode: 'CA', literacyRate: 99.0, educationSpendingPercent: 5.3, primaryEnrollmentRate: 99.5, secondaryEnrollmentRate: 99.2, tertiaryEnrollmentRate: 70.0, averageSchoolingYears: 13.3 },
  { countryCode: 'IT', literacyRate: 99.2, educationSpendingPercent: 4.0, primaryEnrollmentRate: 98.0, secondaryEnrollmentRate: 97.0, tertiaryEnrollmentRate: 64.0, averageSchoolingYears: 10.2 },
  { countryCode: 'ES', literacyRate: 98.4, educationSpendingPercent: 4.3, primaryEnrollmentRate: 99.0, secondaryEnrollmentRate: 98.0, tertiaryEnrollmentRate: 91.0, averageSchoolingYears: 10.3 },
  { countryCode: 'KR', literacyRate: 99.0, educationSpendingPercent: 4.7, primaryEnrollmentRate: 99.0, secondaryEnrollmentRate: 99.0, tertiaryEnrollmentRate: 98.0, averageSchoolingYears: 12.2 },
  { countryCode: 'MX', literacyRate: 94.9, educationSpendingPercent: 4.3, primaryEnrollmentRate: 97.0, secondaryEnrollmentRate: 83.0, tertiaryEnrollmentRate: 40.0, averageSchoolingYears: 8.8 },
  { countryCode: 'TR', literacyRate: 96.7, educationSpendingPercent: 4.3, primaryEnrollmentRate: 95.0, secondaryEnrollmentRate: 88.0, tertiaryEnrollmentRate: 94.0, averageSchoolingYears: 8.0 },
];

async function seedMoreCountries() {
  console.log('🌱 Adding additional countries...\n');

  try {
    // Create countries
    console.log('Creating countries...');
    for (const country of additionalCountries) {
      // Check if country already exists
      const existing = await prisma.country.findFirst({ where: { code: country.code } });
      if (existing) {
        console.log(`  ⏭️  Skipped: ${country.name} (already exists)`);
        continue;
      }
      
      const created = await prisma.country.create({ data: country });
      console.log(`  ✅ Created: ${created.name}`);
    }

    // Create demographics
    console.log('\nCreating demographics...');
    for (const demo of demographicsData) {
      const country = await prisma.country.findFirst({ where: { code: demo.countryCode } });
      if (country) {
        const existing = await prisma.demographics.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, ...data } = demo;
        await prisma.demographics.create({ data: { ...data, countryId: country.id } });
      }
    }

    // Create economy
    console.log('Creating economy data...');
    for (const econ of economyData) {
      const country = await prisma.country.findFirst({ where: { code: econ.countryCode } });
      if (country) {
        const existing = await prisma.economy.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, gdpGrowthHistory, ...data } = econ;
        await prisma.economy.create({
          data: { ...data, countryId: country.id, gdpGrowthHistory: JSON.stringify(gdpGrowthHistory) },
        });
      }
    }

    // Create military
    console.log('Creating military data...');
    for (const mil of militaryData) {
      const country = await prisma.country.findFirst({ where: { code: mil.countryCode } });
      if (country) {
        const existing = await prisma.military.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, ...data } = mil;
        await prisma.military.create({ data: { ...data, countryId: country.id } });
      }
    }

    // Create politics
    console.log('Creating politics data...');
    for (const pol of politicsData) {
      const country = await prisma.country.findFirst({ where: { code: pol.countryCode } });
      if (country) {
        const existing = await prisma.politics.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, ...data } = pol;
        await prisma.politics.create({ data: { ...data, countryId: country.id } });
      }
    }

    // Create crime
    console.log('Creating crime data...');
    for (const cri of crimeData) {
      const country = await prisma.country.findFirst({ where: { code: cri.countryCode } });
      if (country) {
        const existing = await prisma.crime.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, categories, ...data } = cri;
        const crime = await prisma.crime.create({ data: { ...data, countryId: country.id } });
        
        // Create crime categories
        for (const cat of categories) {
          await prisma.crimeCategory.create({
            data: { crimeId: crime.id, category: cat.category, percentage: cat.percentage },
          });
        }
      }
    }

    // Create health stats
    console.log('Creating health data...');
    for (const health of healthData) {
      const country = await prisma.country.findFirst({ where: { code: health.countryCode } });
      if (country) {
        const existing = await prisma.healthStats.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, ...data } = health;
        await prisma.healthStats.create({ data: { ...data, countryId: country.id } });
      }
    }

    // Create education
    console.log('Creating education data...');
    for (const edu of educationData) {
      const country = await prisma.country.findFirst({ where: { code: edu.countryCode } });
      if (country) {
        const existing = await prisma.education.findFirst({ where: { countryId: country.id } });
        if (existing) continue;
        
        const { countryCode, ...data } = edu;
        await prisma.education.create({ data: { ...data, countryId: country.id } });
      }
    }

    console.log('\n✨ Additional countries seeded successfully!');
    console.log(`   - ${additionalCountries.length} new countries added`);

  } catch (err) {
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

seedMoreCountries();
