// Database Seed Script - Populates database with 10 example countries
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CountryData {
  code: string;
  code3: string;
  name: string;
  officialName: string;
  region: string;
  subregion: string;
  capital: string;
  population: bigint;
  area: number;
  flagUrl: string;
  latitude: number;
  longitude: number;
}

const countries: CountryData[] = [
  {
    code: 'US',
    code3: 'USA',
    name: 'United States',
    officialName: 'United States of America',
    region: 'Americas',
    subregion: 'North America',
    capital: 'Washington, D.C.',
    population: BigInt(334914895),
    area: 9833520,
    flagUrl: 'https://flagcdn.com/w320/us.png',
    latitude: 38.8951,
    longitude: -77.0364,
  },
  {
    code: 'DE',
    code3: 'DEU',
    name: 'Germany',
    officialName: 'Federal Republic of Germany',
    region: 'Europe',
    subregion: 'Western Europe',
    capital: 'Berlin',
    population: BigInt(84552242),
    area: 357022,
    flagUrl: 'https://flagcdn.com/w320/de.png',
    latitude: 52.52,
    longitude: 13.405,
  },
  {
    code: 'GB',
    code3: 'GBR',
    name: 'United Kingdom',
    officialName: 'United Kingdom of Great Britain and Northern Ireland',
    region: 'Europe',
    subregion: 'Northern Europe',
    capital: 'London',
    population: BigInt(67736802),
    area: 242495,
    flagUrl: 'https://flagcdn.com/w320/gb.png',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    code: 'FR',
    code3: 'FRA',
    name: 'France',
    officialName: 'French Republic',
    region: 'Europe',
    subregion: 'Western Europe',
    capital: 'Paris',
    population: BigInt(64756584),
    area: 643801,
    flagUrl: 'https://flagcdn.com/w320/fr.png',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    code: 'JP',
    code3: 'JPN',
    name: 'Japan',
    officialName: 'Japan',
    region: 'Asia',
    subregion: 'Eastern Asia',
    capital: 'Tokyo',
    population: BigInt(123294513),
    area: 377975,
    flagUrl: 'https://flagcdn.com/w320/jp.png',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    code: 'CN',
    code3: 'CHN',
    name: 'China',
    officialName: "People's Republic of China",
    region: 'Asia',
    subregion: 'Eastern Asia',
    capital: 'Beijing',
    population: BigInt(1425178782),
    area: 9596960,
    flagUrl: 'https://flagcdn.com/w320/cn.png',
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    code: 'IN',
    code3: 'IND',
    name: 'India',
    officialName: 'Republic of India',
    region: 'Asia',
    subregion: 'Southern Asia',
    capital: 'New Delhi',
    population: BigInt(1428627663),
    area: 3287263,
    flagUrl: 'https://flagcdn.com/w320/in.png',
    latitude: 28.6139,
    longitude: 77.209,
  },
  {
    code: 'BR',
    code3: 'BRA',
    name: 'Brazil',
    officialName: 'Federative Republic of Brazil',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Brasília',
    population: BigInt(216422446),
    area: 8515767,
    flagUrl: 'https://flagcdn.com/w320/br.png',
    latitude: -15.7942,
    longitude: -47.8822,
  },
  {
    code: 'RU',
    code3: 'RUS',
    name: 'Russia',
    officialName: 'Russian Federation',
    region: 'Europe',
    subregion: 'Eastern Europe',
    capital: 'Moscow',
    population: BigInt(144444359),
    area: 17098242,
    flagUrl: 'https://flagcdn.com/w320/ru.png',
    latitude: 55.7558,
    longitude: 37.6173,
  },
  {
    code: 'AU',
    code3: 'AUS',
    name: 'Australia',
    officialName: 'Commonwealth of Australia',
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    capital: 'Canberra',
    population: BigInt(26439111),
    area: 7692024,
    flagUrl: 'https://flagcdn.com/w320/au.png',
    latitude: -35.2809,
    longitude: 149.13,
  },
];

// Demographics data for each country
const demographicsData = [
  // USA
  {
    countryCode: 'US',
    totalPopulation: BigInt(334914895),
    malePopulation: BigInt(164560000),
    femalePopulation: BigInt(170354895),
    maleFemaleRatio: '49% / 51%',
    populationGrowthRate: 0.4,
    medianAge: 38.5,
    lifeExpectancy: 77.5,
    lifeExpectancyMale: 74.8,
    lifeExpectancyFemale: 80.2,
    birthRate: 11.0,
    deathRate: 10.4,
    fertilityRate: 1.64,
    infantMortalityRate: 5.4,
    urbanPopulationPercent: 83.1,
    childPopulationPercent: 18.0,
    workingAgePercent: 64.8,
    elderlyPercent: 17.2,
    averageIQ: 98,
  },
  // Germany
  {
    countryCode: 'DE',
    totalPopulation: BigInt(84552242),
    malePopulation: BigInt(41432000),
    femalePopulation: BigInt(43120242),
    maleFemaleRatio: '49% / 51%',
    populationGrowthRate: 0.1,
    medianAge: 45.7,
    lifeExpectancy: 81.1,
    lifeExpectancyMale: 78.7,
    lifeExpectancyFemale: 83.4,
    birthRate: 9.3,
    deathRate: 12.0,
    fertilityRate: 1.54,
    infantMortalityRate: 3.2,
    urbanPopulationPercent: 77.5,
    childPopulationPercent: 13.8,
    workingAgePercent: 63.5,
    elderlyPercent: 22.7,
    averageIQ: 99,
  },
  // UK
  {
    countryCode: 'GB',
    totalPopulation: BigInt(67736802),
    malePopulation: BigInt(33300000),
    femalePopulation: BigInt(34436802),
    maleFemaleRatio: '49% / 51%',
    populationGrowthRate: 0.4,
    medianAge: 40.6,
    lifeExpectancy: 81.3,
    lifeExpectancyMale: 79.4,
    lifeExpectancyFemale: 83.1,
    birthRate: 10.9,
    deathRate: 9.4,
    fertilityRate: 1.63,
    infantMortalityRate: 3.8,
    urbanPopulationPercent: 84.2,
    childPopulationPercent: 17.6,
    workingAgePercent: 63.2,
    elderlyPercent: 19.2,
    averageIQ: 100,
  },
  // France
  {
    countryCode: 'FR',
    totalPopulation: BigInt(64756584),
    malePopulation: BigInt(31400000),
    femalePopulation: BigInt(33356584),
    maleFemaleRatio: '48% / 52%',
    populationGrowthRate: 0.2,
    medianAge: 42.3,
    lifeExpectancy: 82.8,
    lifeExpectancyMale: 79.9,
    lifeExpectancyFemale: 85.7,
    birthRate: 10.7,
    deathRate: 9.9,
    fertilityRate: 1.84,
    infantMortalityRate: 3.5,
    urbanPopulationPercent: 81.5,
    childPopulationPercent: 17.5,
    workingAgePercent: 61.3,
    elderlyPercent: 21.2,
    averageIQ: 98,
  },
  // Japan
  {
    countryCode: 'JP',
    totalPopulation: BigInt(123294513),
    malePopulation: BigInt(59960000),
    femalePopulation: BigInt(63334513),
    maleFemaleRatio: '49% / 51%',
    populationGrowthRate: -0.5,
    medianAge: 48.6,
    lifeExpectancy: 84.5,
    lifeExpectancyMale: 81.5,
    lifeExpectancyFemale: 87.6,
    birthRate: 6.8,
    deathRate: 11.8,
    fertilityRate: 1.21,
    infantMortalityRate: 1.8,
    urbanPopulationPercent: 91.9,
    childPopulationPercent: 11.6,
    workingAgePercent: 59.2,
    elderlyPercent: 29.2,
    averageIQ: 106,
  },
  // China
  {
    countryCode: 'CN',
    totalPopulation: BigInt(1425178782),
    malePopulation: BigInt(731000000),
    femalePopulation: BigInt(694178782),
    maleFemaleRatio: '51% / 49%',
    populationGrowthRate: 0.1,
    medianAge: 39.0,
    lifeExpectancy: 78.2,
    lifeExpectancyMale: 75.9,
    lifeExpectancyFemale: 80.5,
    birthRate: 7.5,
    deathRate: 7.4,
    fertilityRate: 1.16,
    infantMortalityRate: 5.5,
    urbanPopulationPercent: 64.7,
    childPopulationPercent: 17.0,
    workingAgePercent: 69.0,
    elderlyPercent: 14.0,
    averageIQ: 104,
  },
  // India
  {
    countryCode: 'IN',
    totalPopulation: BigInt(1428627663),
    malePopulation: BigInt(737000000),
    femalePopulation: BigInt(691627663),
    maleFemaleRatio: '52% / 48%',
    populationGrowthRate: 0.8,
    medianAge: 28.2,
    lifeExpectancy: 70.2,
    lifeExpectancyMale: 68.7,
    lifeExpectancyFemale: 71.6,
    birthRate: 17.4,
    deathRate: 7.3,
    fertilityRate: 2.0,
    infantMortalityRate: 27.7,
    urbanPopulationPercent: 35.9,
    childPopulationPercent: 25.8,
    workingAgePercent: 67.3,
    elderlyPercent: 6.9,
    averageIQ: 82,
  },
  // Brazil
  {
    countryCode: 'BR',
    totalPopulation: BigInt(216422446),
    malePopulation: BigInt(106100000),
    femalePopulation: BigInt(110322446),
    maleFemaleRatio: '49% / 51%',
    populationGrowthRate: 0.5,
    medianAge: 34.3,
    lifeExpectancy: 76.1,
    lifeExpectancyMale: 72.4,
    lifeExpectancyFemale: 79.8,
    birthRate: 13.4,
    deathRate: 7.0,
    fertilityRate: 1.64,
    infantMortalityRate: 13.5,
    urbanPopulationPercent: 87.6,
    childPopulationPercent: 20.0,
    workingAgePercent: 69.5,
    elderlyPercent: 10.5,
    averageIQ: 87,
  },
  // Russia
  {
    countryCode: 'RU',
    totalPopulation: BigInt(144444359),
    malePopulation: BigInt(67000000),
    femalePopulation: BigInt(77444359),
    maleFemaleRatio: '46% / 54%',
    populationGrowthRate: -0.2,
    medianAge: 39.6,
    lifeExpectancy: 73.1,
    lifeExpectancyMale: 68.2,
    lifeExpectancyFemale: 78.0,
    birthRate: 9.5,
    deathRate: 14.2,
    fertilityRate: 1.5,
    infantMortalityRate: 4.8,
    urbanPopulationPercent: 74.8,
    childPopulationPercent: 18.3,
    workingAgePercent: 66.0,
    elderlyPercent: 15.7,
    averageIQ: 97,
  },
  // Australia
  {
    countryCode: 'AU',
    totalPopulation: BigInt(26439111),
    malePopulation: BigInt(13100000),
    femalePopulation: BigInt(13339111),
    maleFemaleRatio: '50% / 50%',
    populationGrowthRate: 1.1,
    medianAge: 37.9,
    lifeExpectancy: 83.3,
    lifeExpectancyMale: 81.3,
    lifeExpectancyFemale: 85.2,
    birthRate: 12.0,
    deathRate: 6.8,
    fertilityRate: 1.58,
    infantMortalityRate: 3.1,
    urbanPopulationPercent: 86.5,
    childPopulationPercent: 18.7,
    workingAgePercent: 64.7,
    elderlyPercent: 16.6,
    averageIQ: 99,
  },
];

// Economy data
const economyData = [
  {
    countryCode: 'US',
    gdp: 25462700000000,
    gdpPerCapita: 76399,
    gdpGrowthRate: 2.5,
    gdpPpp: 25462700000000,
    gdpGrowthHistory: [
      { year: 2015, value: 56863 },
      { year: 2016, value: 58021 },
      { year: 2017, value: 60000 },
      { year: 2018, value: 63543 },
      { year: 2019, value: 65298 },
      { year: 2020, value: 63544 },
      { year: 2021, value: 70249 },
      { year: 2022, value: 76399 },
      { year: 2023, value: 77463 },
    ],
    inflation: 3.4,
    unemploymentRate: 3.7,
    povertyRate: 11.4,
    giniIndex: 41.5,
    publicDebt: 123.3,
    tradeBalance: -773400000000,
    exports: 2065000000000,
    imports: 2838400000000,
    minimumWage: 1256,
    averageIncome: 77463,
    currency: 'US Dollar',
    currencyCode: 'USD',
  },
  {
    countryCode: 'DE',
    gdp: 4082469000000,
    gdpPerCapita: 48398,
    gdpGrowthRate: 1.8,
    gdpPpp: 4803000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 41324 },
      { year: 2016, value: 42456 },
      { year: 2017, value: 44680 },
      { year: 2018, value: 47811 },
      { year: 2019, value: 46473 },
      { year: 2020, value: 46208 },
      { year: 2021, value: 51204 },
      { year: 2022, value: 48398 },
      { year: 2023, value: 51600 },
    ],
    inflation: 5.9,
    unemploymentRate: 3.0,
    povertyRate: 14.8,
    giniIndex: 31.7,
    publicDebt: 66.1,
    tradeBalance: 210000000000,
    exports: 1660000000000,
    imports: 1450000000000,
    minimumWage: 2054,
    averageIncome: 58940,
    currency: 'Euro',
    currencyCode: 'EUR',
  },
  {
    countryCode: 'GB',
    gdp: 3131377000000,
    gdpPerCapita: 46125,
    gdpGrowthRate: 4.1,
    gdpPpp: 3413000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 44305 },
      { year: 2016, value: 40412 },
      { year: 2017, value: 40361 },
      { year: 2018, value: 43306 },
      { year: 2019, value: 42747 },
      { year: 2020, value: 40285 },
      { year: 2021, value: 46585 },
      { year: 2022, value: 46125 },
      { year: 2023, value: 48912 },
    ],
    inflation: 7.3,
    unemploymentRate: 4.2,
    povertyRate: 18.6,
    giniIndex: 35.1,
    publicDebt: 101.2,
    tradeBalance: -198000000000,
    exports: 776000000000,
    imports: 974000000000,
    minimumWage: 1970,
    averageIncome: 52295,
    currency: 'British Pound',
    currencyCode: 'GBP',
  },
  {
    countryCode: 'FR',
    gdp: 2782905000000,
    gdpPerCapita: 42330,
    gdpGrowthRate: 2.5,
    gdpPpp: 3377000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 36638 },
      { year: 2016, value: 37037 },
      { year: 2017, value: 38679 },
      { year: 2018, value: 41526 },
      { year: 2019, value: 40380 },
      { year: 2020, value: 38625 },
      { year: 2021, value: 44853 },
      { year: 2022, value: 42330 },
      { year: 2023, value: 44408 },
    ],
    inflation: 5.2,
    unemploymentRate: 7.3,
    povertyRate: 14.5,
    giniIndex: 32.4,
    publicDebt: 111.6,
    tradeBalance: -85000000000,
    exports: 617000000000,
    imports: 702000000000,
    minimumWage: 1767,
    averageIncome: 52764,
    currency: 'Euro',
    currencyCode: 'EUR',
  },
  {
    countryCode: 'JP',
    gdp: 4231141000000,
    gdpPerCapita: 33815,
    gdpGrowthRate: 1.1,
    gdpPpp: 5396000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 34568 },
      { year: 2016, value: 39304 },
      { year: 2017, value: 38449 },
      { year: 2018, value: 39795 },
      { year: 2019, value: 40113 },
      { year: 2020, value: 39918 },
      { year: 2021, value: 39313 },
      { year: 2022, value: 33815 },
      { year: 2023, value: 35390 },
    ],
    inflation: 3.3,
    unemploymentRate: 2.6,
    povertyRate: 15.7,
    giniIndex: 32.9,
    publicDebt: 263.9,
    tradeBalance: -62000000000,
    exports: 756000000000,
    imports: 818000000000,
    minimumWage: 1048,
    averageIncome: 41509,
    currency: 'Japanese Yen',
    currencyCode: 'JPY',
  },
  {
    countryCode: 'CN',
    gdp: 17963171000000,
    gdpPerCapita: 12720,
    gdpGrowthRate: 5.2,
    gdpPpp: 30177000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 8034 },
      { year: 2016, value: 8117 },
      { year: 2017, value: 8827 },
      { year: 2018, value: 9905 },
      { year: 2019, value: 10217 },
      { year: 2020, value: 10434 },
      { year: 2021, value: 12556 },
      { year: 2022, value: 12720 },
      { year: 2023, value: 12850 },
    ],
    inflation: 0.2,
    unemploymentRate: 5.2,
    povertyRate: 6.1,
    giniIndex: 38.2,
    publicDebt: 77.1,
    tradeBalance: 823000000000,
    exports: 3380000000000,
    imports: 2557000000000,
    minimumWage: 326,
    averageIncome: 12850,
    currency: 'Renminbi',
    currencyCode: 'CNY',
  },
  {
    countryCode: 'IN',
    gdp: 3385090000000,
    gdpPerCapita: 2389,
    gdpGrowthRate: 6.3,
    gdpPpp: 11665000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 1606 },
      { year: 2016, value: 1733 },
      { year: 2017, value: 1982 },
      { year: 2018, value: 1998 },
      { year: 2019, value: 2100 },
      { year: 2020, value: 1901 },
      { year: 2021, value: 2257 },
      { year: 2022, value: 2389 },
      { year: 2023, value: 2612 },
    ],
    inflation: 5.4,
    unemploymentRate: 7.8,
    povertyRate: 21.9,
    giniIndex: 35.7,
    publicDebt: 83.1,
    tradeBalance: -265000000000,
    exports: 451000000000,
    imports: 716000000000,
    minimumWage: 78,
    averageIncome: 2389,
    currency: 'Indian Rupee',
    currencyCode: 'INR',
  },
  {
    countryCode: 'BR',
    gdp: 1920096000000,
    gdpPerCapita: 8857,
    gdpGrowthRate: 2.9,
    gdpPpp: 3687000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 8754 },
      { year: 2016, value: 8710 },
      { year: 2017, value: 9882 },
      { year: 2018, value: 9001 },
      { year: 2019, value: 8717 },
      { year: 2020, value: 6797 },
      { year: 2021, value: 7519 },
      { year: 2022, value: 8857 },
      { year: 2023, value: 9673 },
    ],
    inflation: 4.6,
    unemploymentRate: 7.8,
    povertyRate: 29.4,
    giniIndex: 52.9,
    publicDebt: 88.1,
    tradeBalance: 62000000000,
    exports: 334000000000,
    imports: 272000000000,
    minimumWage: 260,
    averageIncome: 9673,
    currency: 'Brazilian Real',
    currencyCode: 'BRL',
  },
  {
    countryCode: 'RU',
    gdp: 2240422000000,
    gdpPerCapita: 15345,
    gdpGrowthRate: 3.6,
    gdpPpp: 4771000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 9057 },
      { year: 2016, value: 8705 },
      { year: 2017, value: 10751 },
      { year: 2018, value: 11287 },
      { year: 2019, value: 11585 },
      { year: 2020, value: 10127 },
      { year: 2021, value: 12173 },
      { year: 2022, value: 15345 },
      { year: 2023, value: 12195 },
    ],
    inflation: 7.4,
    unemploymentRate: 2.9,
    povertyRate: 11.0,
    giniIndex: 36.0,
    publicDebt: 19.5,
    tradeBalance: 282000000000,
    exports: 494000000000,
    imports: 212000000000,
    minimumWage: 198,
    averageIncome: 12195,
    currency: 'Russian Ruble',
    currencyCode: 'RUB',
  },
  {
    countryCode: 'AU',
    gdp: 1675418000000,
    gdpPerCapita: 64491,
    gdpGrowthRate: 3.7,
    gdpPpp: 1593000000000,
    gdpGrowthHistory: [
      { year: 2015, value: 51352 },
      { year: 2016, value: 49972 },
      { year: 2017, value: 53825 },
      { year: 2018, value: 56352 },
      { year: 2019, value: 54907 },
      { year: 2020, value: 51812 },
      { year: 2021, value: 60443 },
      { year: 2022, value: 64491 },
      { year: 2023, value: 59408 },
    ],
    inflation: 5.6,
    unemploymentRate: 3.7,
    povertyRate: 12.4,
    giniIndex: 34.3,
    publicDebt: 57.0,
    tradeBalance: 105000000000,
    exports: 415000000000,
    imports: 310000000000,
    minimumWage: 2570,
    averageIncome: 59408,
    currency: 'Australian Dollar',
    currencyCode: 'AUD',
  },
];

// Military data
const militaryData = [
  { countryCode: 'US', globalRank: 1, totalMilitaryPersonnel: 2127500, activeSoldiers: 1328000, reservePersonnel: 799500, defenseSpending: 886000000000, defenseSpendingPercent: 3.5, tanks: 5500, armoredVehicles: 45193, totalAircraft: 13209, fighters: 1914, navalVessels: 484, aircraftCarriers: 11, submarines: 68, nuclearWeapons: true, isNatoMember: true },
  { countryCode: 'DE', globalRank: 25, totalMilitaryPersonnel: 198000, activeSoldiers: 183500, reservePersonnel: 14500, defenseSpending: 66000000000, defenseSpendingPercent: 1.5, tanks: 266, armoredVehicles: 4752, totalAircraft: 631, fighters: 133, navalVessels: 80, aircraftCarriers: 0, submarines: 6, nuclearWeapons: false, isNatoMember: true },
  { countryCode: 'GB', globalRank: 5, totalMilitaryPersonnel: 231000, activeSoldiers: 150000, reservePersonnel: 81000, defenseSpending: 68000000000, defenseSpendingPercent: 2.2, tanks: 227, armoredVehicles: 5015, totalAircraft: 664, fighters: 137, navalVessels: 117, aircraftCarriers: 2, submarines: 10, nuclearWeapons: true, isNatoMember: true },
  { countryCode: 'FR', globalRank: 9, totalMilitaryPersonnel: 415000, activeSoldiers: 205000, reservePersonnel: 35000, defenseSpending: 55000000000, defenseSpendingPercent: 2.1, tanks: 406, armoredVehicles: 6330, totalAircraft: 965, fighters: 266, navalVessels: 180, aircraftCarriers: 1, submarines: 10, nuclearWeapons: true, isNatoMember: true },
  { countryCode: 'JP', globalRank: 8, totalMilitaryPersonnel: 303000, activeSoldiers: 247000, reservePersonnel: 56000, defenseSpending: 54000000000, defenseSpendingPercent: 1.1, tanks: 555, armoredVehicles: 3160, totalAircraft: 1449, fighters: 269, navalVessels: 155, aircraftCarriers: 4, submarines: 23, nuclearWeapons: false, isNatoMember: false },
  { countryCode: 'CN', globalRank: 3, totalMilitaryPersonnel: 3170000, activeSoldiers: 2185000, reservePersonnel: 510000, defenseSpending: 296000000000, defenseSpendingPercent: 1.7, tanks: 5500, armoredVehicles: 35000, totalAircraft: 3304, fighters: 1207, navalVessels: 777, aircraftCarriers: 3, submarines: 79, nuclearWeapons: true, isNatoMember: false },
  { countryCode: 'IN', globalRank: 4, totalMilitaryPersonnel: 5137000, activeSoldiers: 1455550, reservePersonnel: 1155000, defenseSpending: 83500000000, defenseSpendingPercent: 2.4, tanks: 4614, armoredVehicles: 12457, totalAircraft: 2182, fighters: 564, navalVessels: 294, aircraftCarriers: 2, submarines: 18, nuclearWeapons: true, isNatoMember: false },
  { countryCode: 'BR', globalRank: 12, totalMilitaryPersonnel: 2101500, activeSoldiers: 366500, reservePersonnel: 1340000, defenseSpending: 22800000000, defenseSpendingPercent: 1.3, tanks: 439, armoredVehicles: 2280, totalAircraft: 679, fighters: 61, navalVessels: 112, aircraftCarriers: 1, submarines: 7, nuclearWeapons: false, isNatoMember: false },
  { countryCode: 'RU', globalRank: 2, totalMilitaryPersonnel: 3570000, activeSoldiers: 1320000, reservePersonnel: 2000000, defenseSpending: 109000000000, defenseSpendingPercent: 5.9, tanks: 14777, armoredVehicles: 60870, totalAircraft: 4255, fighters: 773, navalVessels: 781, aircraftCarriers: 1, submarines: 70, nuclearWeapons: true, isNatoMember: false },
  { countryCode: 'AU', globalRank: 16, totalMilitaryPersonnel: 89000, activeSoldiers: 59000, reservePersonnel: 30000, defenseSpending: 32400000000, defenseSpendingPercent: 2.0, tanks: 59, armoredVehicles: 2040, totalAircraft: 452, fighters: 79, navalVessels: 43, aircraftCarriers: 2, submarines: 6, nuclearWeapons: false, isNatoMember: false },
];

// Politics data
const politicsData = [
  { countryCode: 'US', governmentType: 'Federal Presidential Constitutional Republic', chiefOfState: 'President Joseph R. BIDEN Jr.', headOfGovernment: 'President Joseph R. BIDEN Jr.', isEU: false, isUN: true, isNato: true, isG7: true, isG20: true, isBrics: false, passportRanking: 8, passportVisaFree: 186, democracyIndex: 7.85, corruptionIndex: 69, humanDevelopmentIndex: 0.921 },
  { countryCode: 'DE', governmentType: 'Federal Parliamentary Republic', chiefOfState: 'President Frank-Walter STEINMEIER', headOfGovernment: 'Chancellor Olaf SCHOLZ', isEU: true, isUN: true, isNato: true, isG7: true, isG20: true, isBrics: false, passportRanking: 2, passportVisaFree: 192, democracyIndex: 8.67, corruptionIndex: 79, humanDevelopmentIndex: 0.942 },
  { countryCode: 'GB', governmentType: 'Parliamentary Constitutional Monarchy', chiefOfState: 'King CHARLES III', headOfGovernment: 'Prime Minister Keir STARMER', isEU: false, isUN: true, isNato: true, isG7: true, isG20: true, isBrics: false, passportRanking: 4, passportVisaFree: 190, democracyIndex: 8.28, corruptionIndex: 71, humanDevelopmentIndex: 0.929 },
  { countryCode: 'FR', governmentType: 'Semi-Presidential Republic', chiefOfState: 'President Emmanuel MACRON', headOfGovernment: 'Prime Minister Michel BARNIER', isEU: true, isUN: true, isNato: true, isG7: true, isG20: true, isBrics: false, passportRanking: 2, passportVisaFree: 192, democracyIndex: 7.99, corruptionIndex: 72, humanDevelopmentIndex: 0.903 },
  { countryCode: 'JP', governmentType: 'Parliamentary Constitutional Monarchy', chiefOfState: 'Emperor NARUHITO', headOfGovernment: 'Prime Minister Shigeru ISHIBA', isEU: false, isUN: true, isNato: false, isG7: true, isG20: true, isBrics: false, passportRanking: 1, passportVisaFree: 194, democracyIndex: 8.33, corruptionIndex: 73, humanDevelopmentIndex: 0.920 },
  { countryCode: 'CN', governmentType: 'Communist Party-led State', chiefOfState: 'President XI Jinping', headOfGovernment: 'Premier LI Qiang', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: true, passportRanking: 62, passportVisaFree: 85, democracyIndex: 1.94, corruptionIndex: 42, humanDevelopmentIndex: 0.768 },
  { countryCode: 'IN', governmentType: 'Federal Parliamentary Republic', chiefOfState: 'President Droupadi MURMU', headOfGovernment: 'Prime Minister Narendra MODI', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: true, passportRanking: 85, passportVisaFree: 58, democracyIndex: 6.61, corruptionIndex: 39, humanDevelopmentIndex: 0.633 },
  { countryCode: 'BR', governmentType: 'Federal Presidential Republic', chiefOfState: 'President Luiz Inácio LULA da Silva', headOfGovernment: 'President Luiz Inácio LULA da Silva', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: true, passportRanking: 19, passportVisaFree: 170, democracyIndex: 6.78, corruptionIndex: 36, humanDevelopmentIndex: 0.754 },
  { countryCode: 'RU', governmentType: 'Federal Semi-Presidential Republic', chiefOfState: 'President Vladimir PUTIN', headOfGovernment: 'Prime Minister Mikhail MISHUSTIN', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: true, passportRanking: 52, passportVisaFree: 118, democracyIndex: 2.22, corruptionIndex: 26, humanDevelopmentIndex: 0.822 },
  { countryCode: 'AU', governmentType: 'Federal Parliamentary Constitutional Monarchy', chiefOfState: 'King CHARLES III', headOfGovernment: 'Prime Minister Anthony ALBANESE', isEU: false, isUN: true, isNato: false, isG7: false, isG20: true, isBrics: false, passportRanking: 6, passportVisaFree: 187, democracyIndex: 8.71, corruptionIndex: 75, humanDevelopmentIndex: 0.951 },
];

// Crime data
const crimeData = [
  { countryCode: 'US', crimeIndex: 49.2, safetyIndex: 50.8, totalCrimeRate: 47.7, homicideRate: 6.3, categories: [{ category: 'Property Crime', percentage: 38 }, { category: 'Violent Crime', percentage: 23 }, { category: 'Drug Offenses', percentage: 18 }, { category: 'Fraud', percentage: 12 }, { category: 'Cyber Crime', percentage: 9 }] },
  { countryCode: 'DE', crimeIndex: 35.8, safetyIndex: 64.2, totalCrimeRate: 41.2, homicideRate: 0.8, categories: [{ category: 'Theft', percentage: 45 }, { category: 'Fraud', percentage: 20 }, { category: 'Violent Crime', percentage: 18 }, { category: 'Cyber Crime', percentage: 12 }, { category: 'Drug Offenses', percentage: 5 }] },
  { countryCode: 'GB', crimeIndex: 46.1, safetyIndex: 53.9, totalCrimeRate: 44.8, homicideRate: 1.2, categories: [{ category: 'Theft', percentage: 42 }, { category: 'Violent Crime', percentage: 28 }, { category: 'Fraud', percentage: 15 }, { category: 'Drug Offenses', percentage: 10 }, { category: 'Cyber Crime', percentage: 5 }] },
  { countryCode: 'FR', crimeIndex: 51.9, safetyIndex: 48.1, totalCrimeRate: 48.2, homicideRate: 1.3, categories: [{ category: 'Property Crime', percentage: 48 }, { category: 'Violent Crime', percentage: 22 }, { category: 'Fraud', percentage: 14 }, { category: 'Drug Offenses', percentage: 11 }, { category: 'Cyber Crime', percentage: 5 }] },
  { countryCode: 'JP', crimeIndex: 21.6, safetyIndex: 78.4, totalCrimeRate: 15.2, homicideRate: 0.3, categories: [{ category: 'Theft', percentage: 55 }, { category: 'Fraud', percentage: 22 }, { category: 'Cyber Crime', percentage: 12 }, { category: 'Violent Crime', percentage: 8 }, { category: 'Drug Offenses', percentage: 3 }] },
  { countryCode: 'CN', crimeIndex: 30.4, safetyIndex: 69.6, totalCrimeRate: 25.8, homicideRate: 0.5, categories: [{ category: 'Theft', percentage: 42 }, { category: 'Fraud', percentage: 28 }, { category: 'Cyber Crime', percentage: 18 }, { category: 'Violent Crime', percentage: 8 }, { category: 'Drug Offenses', percentage: 4 }] },
  { countryCode: 'IN', crimeIndex: 44.8, safetyIndex: 55.2, totalCrimeRate: 38.6, homicideRate: 3.0, categories: [{ category: 'Theft', percentage: 35 }, { category: 'Violent Crime', percentage: 32 }, { category: 'Sexual Offenses', percentage: 15 }, { category: 'Fraud', percentage: 12 }, { category: 'Cyber Crime', percentage: 6 }] },
  { countryCode: 'BR', crimeIndex: 68.3, safetyIndex: 31.7, totalCrimeRate: 72.4, homicideRate: 22.4, categories: [{ category: 'Theft/Robbery', percentage: 48 }, { category: 'Violent Crime', percentage: 35 }, { category: 'Drug Offenses', percentage: 10 }, { category: 'Fraud', percentage: 5 }, { category: 'Cyber Crime', percentage: 2 }] },
  { countryCode: 'RU', crimeIndex: 39.2, safetyIndex: 60.8, totalCrimeRate: 35.6, homicideRate: 8.2, categories: [{ category: 'Theft', percentage: 42 }, { category: 'Violent Crime', percentage: 25 }, { category: 'Fraud', percentage: 18 }, { category: 'Drug Offenses', percentage: 10 }, { category: 'Cyber Crime', percentage: 5 }] },
  { countryCode: 'AU', crimeIndex: 42.4, safetyIndex: 57.6, totalCrimeRate: 39.8, homicideRate: 0.9, categories: [{ category: 'Property Crime', percentage: 52 }, { category: 'Violent Crime', percentage: 22 }, { category: 'Drug Offenses', percentage: 14 }, { category: 'Fraud', percentage: 8 }, { category: 'Cyber Crime', percentage: 4 }] },
];

// Health stats
const healthData = [
  { countryCode: 'US', smokingRate: 12.5, alcoholConsumption: 9.8, alcoholDependencyRate: 5.3, drugUseRate: 3.8, obesityRate: 42.4, healthcareSpendingPercent: 17.8, hospitalBedsPer1000: 2.9, physiciansPer1000: 2.6, suicideRate: 14.5, diabetesPrevalence: 10.7 },
  { countryCode: 'DE', smokingRate: 23.8, alcoholConsumption: 12.8, alcoholDependencyRate: 3.4, drugUseRate: 2.8, obesityRate: 22.3, healthcareSpendingPercent: 12.8, hospitalBedsPer1000: 8.0, physiciansPer1000: 4.3, suicideRate: 9.9, diabetesPrevalence: 8.6 },
  { countryCode: 'GB', smokingRate: 14.1, alcoholConsumption: 11.4, alcoholDependencyRate: 3.7, drugUseRate: 3.4, obesityRate: 27.8, healthcareSpendingPercent: 12.0, hospitalBedsPer1000: 2.5, physiciansPer1000: 3.0, suicideRate: 7.9, diabetesPrevalence: 6.3 },
  { countryCode: 'FR', smokingRate: 25.3, alcoholConsumption: 11.7, alcoholDependencyRate: 3.9, drugUseRate: 2.9, obesityRate: 21.6, healthcareSpendingPercent: 12.2, hospitalBedsPer1000: 5.9, physiciansPer1000: 3.4, suicideRate: 12.1, diabetesPrevalence: 5.1 },
  { countryCode: 'JP', smokingRate: 16.7, alcoholConsumption: 7.8, alcoholDependencyRate: 1.2, drugUseRate: 0.5, obesityRate: 4.3, healthcareSpendingPercent: 11.1, hospitalBedsPer1000: 12.8, physiciansPer1000: 2.5, suicideRate: 12.2, diabetesPrevalence: 7.3 },
  { countryCode: 'CN', smokingRate: 24.7, alcoholConsumption: 7.1, alcoholDependencyRate: 2.8, drugUseRate: 0.9, obesityRate: 6.2, healthcareSpendingPercent: 5.4, hospitalBedsPer1000: 4.7, physiciansPer1000: 2.2, suicideRate: 6.7, diabetesPrevalence: 10.9 },
  { countryCode: 'IN', smokingRate: 10.7, alcoholConsumption: 4.3, alcoholDependencyRate: 4.0, drugUseRate: 0.6, obesityRate: 3.9, healthcareSpendingPercent: 3.5, hospitalBedsPer1000: 0.5, physiciansPer1000: 0.7, suicideRate: 12.9, diabetesPrevalence: 11.4 },
  { countryCode: 'BR', smokingRate: 12.6, alcoholConsumption: 7.8, alcoholDependencyRate: 4.2, drugUseRate: 2.1, obesityRate: 22.1, healthcareSpendingPercent: 9.6, hospitalBedsPer1000: 2.1, physiciansPer1000: 2.3, suicideRate: 6.9, diabetesPrevalence: 10.5 },
  { countryCode: 'RU', smokingRate: 28.3, alcoholConsumption: 11.1, alcoholDependencyRate: 6.5, drugUseRate: 2.3, obesityRate: 23.1, healthcareSpendingPercent: 5.3, hospitalBedsPer1000: 7.1, physiciansPer1000: 4.0, suicideRate: 21.6, diabetesPrevalence: 6.3 },
  { countryCode: 'AU', smokingRate: 11.2, alcoholConsumption: 10.6, alcoholDependencyRate: 3.0, drugUseRate: 3.5, obesityRate: 31.3, healthcareSpendingPercent: 10.7, hospitalBedsPer1000: 3.8, physiciansPer1000: 3.9, suicideRate: 11.3, diabetesPrevalence: 5.3 },
];

// Education data
const educationData = [
  { countryCode: 'US', literacyRate: 99.0, educationSpendingPercent: 5.0, primaryEnrollmentRate: 99.3, secondaryEnrollmentRate: 98.5, tertiaryEnrollmentRate: 87.9, averageSchoolingYears: 13.4 },
  { countryCode: 'DE', literacyRate: 99.0, educationSpendingPercent: 4.9, primaryEnrollmentRate: 99.9, secondaryEnrollmentRate: 99.3, tertiaryEnrollmentRate: 72.3, averageSchoolingYears: 14.1 },
  { countryCode: 'GB', literacyRate: 99.0, educationSpendingPercent: 5.5, primaryEnrollmentRate: 99.7, secondaryEnrollmentRate: 98.9, tertiaryEnrollmentRate: 60.0, averageSchoolingYears: 13.0 },
  { countryCode: 'FR', literacyRate: 99.0, educationSpendingPercent: 5.5, primaryEnrollmentRate: 99.7, secondaryEnrollmentRate: 98.7, tertiaryEnrollmentRate: 65.6, averageSchoolingYears: 11.6 },
  { countryCode: 'JP', literacyRate: 99.0, educationSpendingPercent: 3.6, primaryEnrollmentRate: 99.9, secondaryEnrollmentRate: 99.2, tertiaryEnrollmentRate: 63.4, averageSchoolingYears: 13.4 },
  { countryCode: 'CN', literacyRate: 97.3, educationSpendingPercent: 4.1, primaryEnrollmentRate: 99.9, secondaryEnrollmentRate: 95.5, tertiaryEnrollmentRate: 57.8, averageSchoolingYears: 8.1 },
  { countryCode: 'IN', literacyRate: 74.4, educationSpendingPercent: 4.1, primaryEnrollmentRate: 97.0, secondaryEnrollmentRate: 74.0, tertiaryEnrollmentRate: 28.1, averageSchoolingYears: 6.5 },
  { countryCode: 'BR', literacyRate: 93.2, educationSpendingPercent: 6.0, primaryEnrollmentRate: 98.3, secondaryEnrollmentRate: 87.0, tertiaryEnrollmentRate: 51.3, averageSchoolingYears: 8.0 },
  { countryCode: 'RU', literacyRate: 99.7, educationSpendingPercent: 4.7, primaryEnrollmentRate: 99.7, secondaryEnrollmentRate: 97.8, tertiaryEnrollmentRate: 81.9, averageSchoolingYears: 12.2 },
  { countryCode: 'AU', literacyRate: 99.0, educationSpendingPercent: 6.1, primaryEnrollmentRate: 99.3, secondaryEnrollmentRate: 98.5, tertiaryEnrollmentRate: 116.0, averageSchoolingYears: 12.7 },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.crimeCategory.deleteMany();
    await prisma.aISummary.deleteMany();
    await prisma.crime.deleteMany();
    await prisma.healthStats.deleteMany();
    await prisma.education.deleteMany();
    await prisma.politics.deleteMany();
    await prisma.military.deleteMany();
    await prisma.economy.deleteMany();
    await prisma.demographics.deleteMany();
    await prisma.country.deleteMany();
    await prisma.externalDataCache.deleteMany();
    await prisma.syncLog.deleteMany();

    // Create countries
    console.log('Creating countries...');
    for (const country of countries) {
      const created = await prisma.country.create({
        data: country,
      });
      console.log(`  ✅ Created: ${created.name}`);
    }

    // Create demographics
    console.log('\nCreating demographics...');
    for (const demo of demographicsData) {
      const country = await prisma.country.findFirst({ where: { code: demo.countryCode } });
      if (country) {
        const { countryCode, ...data } = demo;
        await prisma.demographics.create({
          data: { ...data, countryId: country.id },
        });
      }
    }

    // Create economy
    console.log('Creating economy data...');
    for (const econ of economyData) {
      const country = await prisma.country.findFirst({ where: { code: econ.countryCode } });
      if (country) {
        const { countryCode, gdpGrowthHistory, ...data } = econ;
        await prisma.economy.create({
          data: { 
            ...data, 
            countryId: country.id,
            gdpGrowthHistory: JSON.stringify(gdpGrowthHistory), // Stringify for SQLite
          },
        });
      }
    }

    // Create military
    console.log('Creating military data...');
    for (const mil of militaryData) {
      const country = await prisma.country.findFirst({ where: { code: mil.countryCode } });
      if (country) {
        const { countryCode, ...data } = mil;
        await prisma.military.create({
          data: { ...data, countryId: country.id },
        });
      }
    }

    // Create politics
    console.log('Creating politics data...');
    for (const pol of politicsData) {
      const country = await prisma.country.findFirst({ where: { code: pol.countryCode } });
      if (country) {
        const { countryCode, ...data } = pol;
        await prisma.politics.create({
          data: { ...data, countryId: country.id },
        });
      }
    }

    // Create crime
    console.log('Creating crime data...');
    for (const cri of crimeData) {
      const country = await prisma.country.findFirst({ where: { code: cri.countryCode } });
      if (country) {
        const { countryCode, categories, ...data } = cri;
        const crime = await prisma.crime.create({
          data: { ...data, countryId: country.id },
        });
        
        // Create crime categories
        for (const cat of categories) {
          await prisma.crimeCategory.create({
            data: {
              crimeId: crime.id,
              category: cat.category,
              percentage: cat.percentage,
            },
          });
        }
      }
    }

    // Create health stats
    console.log('Creating health data...');
    for (const health of healthData) {
      const country = await prisma.country.findFirst({ where: { code: health.countryCode } });
      if (country) {
        const { countryCode, ...data } = health;
        await prisma.healthStats.create({
          data: { ...data, countryId: country.id },
        });
      }
    }

    // Create education
    console.log('Creating education data...');
    for (const edu of educationData) {
      const country = await prisma.country.findFirst({ where: { code: edu.countryCode } });
      if (country) {
        const { countryCode, ...data } = edu;
        await prisma.education.create({
          data: { ...data, countryId: country.id },
        });
      }
    }

    console.log('\n✨ Database seeded successfully!');
    console.log(`   - ${countries.length} countries created`);
    console.log('   - Demographics, Economy, Military, Politics, Crime, Health, Education data added\n');

  } catch (err) {
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
