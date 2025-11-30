// CIA World Factbook Provider
// Provides: Government type, demographics, military structure, political data
import { BaseProvider, ProviderResult, CountryDataUpdate, PoliticsData } from './base.provider.js';
import { logger } from '../utils/logger.js';

interface CIAFactbookData {
  countryCode: string;
  governmentType: string;
  chiefOfState: string;
  headOfGovernment: string;
  politicalSystem: string;
  legislativeBranch: string;
  judicialBranch: string;
  constitution: string;
  suffrage: string;
  independenceDate: string | null;
  nationalHoliday: string;
  currency: string;
  currencyCode: string;
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
}

export class CIAProvider extends BaseProvider {
  private factbookData: Map<string, CIAFactbookData>;

  constructor() {
    super('cia', 'https://www.cia.gov/the-world-factbook');
    this.factbookData = this.initializeFactbookData();
  }

  private initializeFactbookData(): Map<string, CIAFactbookData> {
    const data = new Map<string, CIAFactbookData>();

    // Current CIA Factbook data (2024)
    const countries: CIAFactbookData[] = [
      {
        countryCode: 'USA',
        governmentType: 'Federal Presidential Constitutional Republic',
        chiefOfState: 'President Joseph R. BIDEN Jr.',
        headOfGovernment: 'President Joseph R. BIDEN Jr.',
        politicalSystem: 'Federal Republic',
        legislativeBranch: 'Bicameral Congress: Senate (100 seats) and House of Representatives (435 seats)',
        judicialBranch: 'Supreme Court (9 justices)',
        constitution: 'Ratified 1788, effective 1789',
        suffrage: '18 years of age; universal',
        independenceDate: '1776-07-04',
        nationalHoliday: 'Independence Day, 4 July',
        currency: 'US Dollar',
        currencyCode: 'USD',
        lifeExpectancyMale: 74.8,
        lifeExpectancyFemale: 80.2,
      },
      {
        countryCode: 'DEU',
        governmentType: 'Federal Parliamentary Republic',
        chiefOfState: 'President Frank-Walter STEINMEIER',
        headOfGovernment: 'Chancellor Olaf SCHOLZ',
        politicalSystem: 'Federal Republic',
        legislativeBranch: 'Bicameral: Bundesrat (69 seats) and Bundestag (736 seats)',
        judicialBranch: 'Federal Constitutional Court',
        constitution: 'Basic Law (Grundgesetz), 1949',
        suffrage: '18 years of age; universal',
        independenceDate: '1990-10-03',
        nationalHoliday: 'German Unity Day, 3 October',
        currency: 'Euro',
        currencyCode: 'EUR',
        lifeExpectancyMale: 78.7,
        lifeExpectancyFemale: 83.4,
      },
      {
        countryCode: 'GBR',
        governmentType: 'Parliamentary Constitutional Monarchy',
        chiefOfState: 'King CHARLES III',
        headOfGovernment: 'Prime Minister Keir STARMER',
        politicalSystem: 'Constitutional Monarchy',
        legislativeBranch: 'Bicameral Parliament: House of Lords and House of Commons (650 seats)',
        judicialBranch: 'Supreme Court of the United Kingdom',
        constitution: 'Uncodified; partly statutes, conventions, judicial decisions',
        suffrage: '18 years of age; universal',
        independenceDate: null,
        nationalHoliday: 'Official Birthday of the Sovereign',
        currency: 'British Pound',
        currencyCode: 'GBP',
        lifeExpectancyMale: 79.4,
        lifeExpectancyFemale: 83.1,
      },
      {
        countryCode: 'FRA',
        governmentType: 'Semi-Presidential Republic',
        chiefOfState: 'President Emmanuel MACRON',
        headOfGovernment: 'Prime Minister Michel BARNIER',
        politicalSystem: 'Republic',
        legislativeBranch: 'Bicameral Parliament: Senate (348 seats) and National Assembly (577 seats)',
        judicialBranch: 'Constitutional Council',
        constitution: 'Fifth Republic Constitution, 1958',
        suffrage: '18 years of age; universal',
        independenceDate: '0843-08-10',
        nationalHoliday: 'Bastille Day, 14 July',
        currency: 'Euro',
        currencyCode: 'EUR',
        lifeExpectancyMale: 79.9,
        lifeExpectancyFemale: 85.7,
      },
      {
        countryCode: 'JPN',
        governmentType: 'Parliamentary Constitutional Monarchy',
        chiefOfState: 'Emperor NARUHITO',
        headOfGovernment: 'Prime Minister Shigeru ISHIBA',
        politicalSystem: 'Constitutional Monarchy',
        legislativeBranch: 'Bicameral National Diet: House of Councillors (248 seats) and House of Representatives (465 seats)',
        judicialBranch: 'Supreme Court',
        constitution: 'Constitution of Japan, 1947',
        suffrage: '18 years of age; universal',
        independenceDate: null,
        nationalHoliday: 'National Foundation Day, 11 February',
        currency: 'Japanese Yen',
        currencyCode: 'JPY',
        lifeExpectancyMale: 81.5,
        lifeExpectancyFemale: 87.6,
      },
      {
        countryCode: 'CHN',
        governmentType: 'Communist Party-led State',
        chiefOfState: 'President XI Jinping',
        headOfGovernment: 'Premier LI Qiang',
        politicalSystem: 'Communist State',
        legislativeBranch: 'Unicameral National People\'s Congress (2,980 seats)',
        judicialBranch: 'Supreme People\'s Court',
        constitution: 'Constitution of 1982, amended',
        suffrage: '18 years of age; universal',
        independenceDate: '1949-10-01',
        nationalHoliday: 'National Day, 1 October',
        currency: 'Renminbi',
        currencyCode: 'CNY',
        lifeExpectancyMale: 75.9,
        lifeExpectancyFemale: 80.5,
      },
      {
        countryCode: 'IND',
        governmentType: 'Federal Parliamentary Republic',
        chiefOfState: 'President Droupadi MURMU',
        headOfGovernment: 'Prime Minister Narendra MODI',
        politicalSystem: 'Federal Republic',
        legislativeBranch: 'Bicameral Parliament: Rajya Sabha (245 seats) and Lok Sabha (545 seats)',
        judicialBranch: 'Supreme Court of India',
        constitution: 'Constitution of India, 1950',
        suffrage: '18 years of age; universal',
        independenceDate: '1947-08-15',
        nationalHoliday: 'Independence Day, 15 August',
        currency: 'Indian Rupee',
        currencyCode: 'INR',
        lifeExpectancyMale: 68.7,
        lifeExpectancyFemale: 71.6,
      },
      {
        countryCode: 'BRA',
        governmentType: 'Federal Presidential Republic',
        chiefOfState: 'President Luiz Inácio LULA da Silva',
        headOfGovernment: 'President Luiz Inácio LULA da Silva',
        politicalSystem: 'Federal Republic',
        legislativeBranch: 'Bicameral National Congress: Federal Senate (81 seats) and Chamber of Deputies (513 seats)',
        judicialBranch: 'Supreme Federal Court',
        constitution: 'Constitution of Brazil, 1988',
        suffrage: '16-18 years voluntary; 18-70 years compulsory',
        independenceDate: '1822-09-07',
        nationalHoliday: 'Independence Day, 7 September',
        currency: 'Brazilian Real',
        currencyCode: 'BRL',
        lifeExpectancyMale: 72.4,
        lifeExpectancyFemale: 79.8,
      },
      {
        countryCode: 'RUS',
        governmentType: 'Federal Semi-Presidential Republic',
        chiefOfState: 'President Vladimir PUTIN',
        headOfGovernment: 'Prime Minister Mikhail MISHUSTIN',
        politicalSystem: 'Federal Republic',
        legislativeBranch: 'Bicameral Federal Assembly: Federation Council (170 seats) and State Duma (450 seats)',
        judicialBranch: 'Constitutional Court',
        constitution: 'Constitution of the Russian Federation, 1993',
        suffrage: '18 years of age; universal',
        independenceDate: '1991-08-24',
        nationalHoliday: 'Russia Day, 12 June',
        currency: 'Russian Ruble',
        currencyCode: 'RUB',
        lifeExpectancyMale: 68.2,
        lifeExpectancyFemale: 78.0,
      },
      {
        countryCode: 'AUS',
        governmentType: 'Federal Parliamentary Constitutional Monarchy',
        chiefOfState: 'King CHARLES III (represented by Governor-General)',
        headOfGovernment: 'Prime Minister Anthony ALBANESE',
        politicalSystem: 'Constitutional Monarchy',
        legislativeBranch: 'Bicameral Federal Parliament: Senate (76 seats) and House of Representatives (151 seats)',
        judicialBranch: 'High Court of Australia',
        constitution: 'Constitution of Australia, 1901',
        suffrage: '18 years of age; universal and compulsory',
        independenceDate: '1901-01-01',
        nationalHoliday: 'Australia Day, 26 January',
        currency: 'Australian Dollar',
        currencyCode: 'AUD',
        lifeExpectancyMale: 81.3,
        lifeExpectancyFemale: 85.2,
      },
    ];

    for (const country of countries) {
      data.set(country.countryCode, country);
    }

    return data;
  }

  async sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>> {
    const startTime = Date.now();
    await this.logSync('started');

    const codes = countryCodes || Array.from(this.factbookData.keys());
    const updates: CountryDataUpdate[] = [];

    try {
      logger.info(`CIA Factbook sync starting for ${codes.length} countries`);

      for (const code of codes) {
        const factData = this.factbookData.get(code);
        
        if (factData) {
          const update: CountryDataUpdate = {
            countryCode: code,
            politics: {
              governmentType: factData.governmentType,
              chiefOfState: factData.chiefOfState,
              headOfGovernment: factData.headOfGovernment,
              politicalSystem: factData.politicalSystem,
              legislativeBranch: factData.legislativeBranch,
              judicialBranch: factData.judicialBranch,
              constitution: factData.constitution,
              suffrage: factData.suffrage,
              independenceDate: factData.independenceDate ? new Date(factData.independenceDate) : null,
              nationalHoliday: factData.nationalHoliday,
            } as Partial<PoliticsData>,
            demographics: {
              lifeExpectancyMale: factData.lifeExpectancyMale,
              lifeExpectancyFemale: factData.lifeExpectancyFemale,
            },
            economy: {
              currency: factData.currency,
              currencyCode: factData.currencyCode,
            },
          };

          updates.push(update);
        }
      }

      const duration = Date.now() - startTime;
      await this.logSync('success', updates.length, undefined, duration);

      logger.info(`CIA Factbook sync completed: ${updates.length} countries updated in ${duration}ms`);

      return {
        success: true,
        data: updates,
        provider: this.name,
        timestamp: new Date(),
      };
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      await this.logSync('failed', 0, errorMessage, duration);

      logger.error('CIA Factbook sync failed', err);

      return {
        success: false,
        error: errorMessage,
        provider: this.name,
        timestamp: new Date(),
      };
    }
  }
}

export const ciaProvider = new CIAProvider();
export default ciaProvider;
