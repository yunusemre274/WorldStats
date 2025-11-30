// Global Firepower Provider
// Provides: Military ranking, active soldiers, equipment data
import { BaseProvider, ProviderResult, CountryDataUpdate, MilitaryData } from './base.provider.js';
import { logger } from '../utils/logger.js';

interface GFPMilitaryData {
  countryCode: string;
  globalRank: number;
  totalMilitaryPersonnel: number;
  activeSoldiers: number;
  reservePersonnel: number;
  paramilitaryForces: number;
  defenseSpending: number;
  defenseSpendingPercent: number;
  tanks: number;
  armoredVehicles: number;
  selfPropelledArtillery: number;
  towedArtillery: number;
  rocketProjectors: number;
  totalAircraft: number;
  fighters: number;
  helicopters: number;
  attackHelicopters: number;
  navalVessels: number;
  aircraftCarriers: number;
  submarines: number;
  destroyers: number;
  frigates: number;
  nuclearWeapons: boolean;
  isNatoMember: boolean;
}

export class GFPProvider extends BaseProvider {
  private militaryData: Map<string, GFPMilitaryData>;

  constructor() {
    super('gfp', 'https://www.globalfirepower.com');
    this.militaryData = this.initializeMilitaryData();
  }

  private initializeMilitaryData(): Map<string, GFPMilitaryData> {
    const data = new Map<string, GFPMilitaryData>();

    // Global Firepower 2024 data
    const military: GFPMilitaryData[] = [
      {
        countryCode: 'USA',
        globalRank: 1,
        totalMilitaryPersonnel: 2127500,
        activeSoldiers: 1328000,
        reservePersonnel: 799500,
        paramilitaryForces: 0,
        defenseSpending: 886000000000,
        defenseSpendingPercent: 3.5,
        tanks: 5500,
        armoredVehicles: 45193,
        selfPropelledArtillery: 1498,
        towedArtillery: 1339,
        rocketProjectors: 1366,
        totalAircraft: 13209,
        fighters: 1914,
        helicopters: 5463,
        attackHelicopters: 910,
        navalVessels: 484,
        aircraftCarriers: 11,
        submarines: 68,
        destroyers: 92,
        frigates: 0,
        nuclearWeapons: true,
        isNatoMember: true,
      },
      {
        countryCode: 'DEU',
        globalRank: 25,
        totalMilitaryPersonnel: 198000,
        activeSoldiers: 183500,
        reservePersonnel: 14500,
        paramilitaryForces: 0,
        defenseSpending: 66000000000,
        defenseSpendingPercent: 1.5,
        tanks: 266,
        armoredVehicles: 4752,
        selfPropelledArtillery: 121,
        towedArtillery: 0,
        rocketProjectors: 38,
        totalAircraft: 631,
        fighters: 133,
        helicopters: 266,
        attackHelicopters: 51,
        navalVessels: 80,
        aircraftCarriers: 0,
        submarines: 6,
        destroyers: 0,
        frigates: 11,
        nuclearWeapons: false,
        isNatoMember: true,
      },
      {
        countryCode: 'GBR',
        globalRank: 5,
        totalMilitaryPersonnel: 231000,
        activeSoldiers: 150000,
        reservePersonnel: 81000,
        paramilitaryForces: 0,
        defenseSpending: 68000000000,
        defenseSpendingPercent: 2.2,
        tanks: 227,
        armoredVehicles: 5015,
        selfPropelledArtillery: 89,
        towedArtillery: 126,
        rocketProjectors: 44,
        totalAircraft: 664,
        fighters: 137,
        helicopters: 245,
        attackHelicopters: 39,
        navalVessels: 117,
        aircraftCarriers: 2,
        submarines: 10,
        destroyers: 6,
        frigates: 12,
        nuclearWeapons: true,
        isNatoMember: true,
      },
      {
        countryCode: 'FRA',
        globalRank: 9,
        totalMilitaryPersonnel: 415000,
        activeSoldiers: 205000,
        reservePersonnel: 35000,
        paramilitaryForces: 175000,
        defenseSpending: 55000000000,
        defenseSpendingPercent: 2.1,
        tanks: 406,
        armoredVehicles: 6330,
        selfPropelledArtillery: 109,
        towedArtillery: 105,
        rocketProjectors: 13,
        totalAircraft: 965,
        fighters: 266,
        helicopters: 432,
        attackHelicopters: 69,
        navalVessels: 180,
        aircraftCarriers: 1,
        submarines: 10,
        destroyers: 4,
        frigates: 11,
        nuclearWeapons: true,
        isNatoMember: true,
      },
      {
        countryCode: 'JPN',
        globalRank: 8,
        totalMilitaryPersonnel: 303000,
        activeSoldiers: 247000,
        reservePersonnel: 56000,
        paramilitaryForces: 0,
        defenseSpending: 54000000000,
        defenseSpendingPercent: 1.1,
        tanks: 555,
        armoredVehicles: 3160,
        selfPropelledArtillery: 203,
        towedArtillery: 400,
        rocketProjectors: 99,
        totalAircraft: 1449,
        fighters: 269,
        helicopters: 508,
        attackHelicopters: 119,
        navalVessels: 155,
        aircraftCarriers: 4,
        submarines: 23,
        destroyers: 36,
        frigates: 12,
        nuclearWeapons: false,
        isNatoMember: false,
      },
      {
        countryCode: 'CHN',
        globalRank: 3,
        totalMilitaryPersonnel: 3170000,
        activeSoldiers: 2185000,
        reservePersonnel: 510000,
        paramilitaryForces: 475000,
        defenseSpending: 296000000000,
        defenseSpendingPercent: 1.7,
        tanks: 5500,
        armoredVehicles: 35000,
        selfPropelledArtillery: 4090,
        towedArtillery: 2350,
        rocketProjectors: 3180,
        totalAircraft: 3304,
        fighters: 1207,
        helicopters: 912,
        attackHelicopters: 281,
        navalVessels: 777,
        aircraftCarriers: 3,
        submarines: 79,
        destroyers: 50,
        frigates: 50,
        nuclearWeapons: true,
        isNatoMember: false,
      },
      {
        countryCode: 'IND',
        globalRank: 4,
        totalMilitaryPersonnel: 5137000,
        activeSoldiers: 1455550,
        reservePersonnel: 1155000,
        paramilitaryForces: 2526450,
        defenseSpending: 83500000000,
        defenseSpendingPercent: 2.4,
        tanks: 4614,
        armoredVehicles: 12457,
        selfPropelledArtillery: 235,
        towedArtillery: 3920,
        rocketProjectors: 374,
        totalAircraft: 2182,
        fighters: 564,
        helicopters: 810,
        attackHelicopters: 37,
        navalVessels: 294,
        aircraftCarriers: 2,
        submarines: 18,
        destroyers: 11,
        frigates: 13,
        nuclearWeapons: true,
        isNatoMember: false,
      },
      {
        countryCode: 'BRA',
        globalRank: 12,
        totalMilitaryPersonnel: 2101500,
        activeSoldiers: 366500,
        reservePersonnel: 1340000,
        paramilitaryForces: 395000,
        defenseSpending: 22800000000,
        defenseSpendingPercent: 1.3,
        tanks: 439,
        armoredVehicles: 2280,
        selfPropelledArtillery: 24,
        towedArtillery: 580,
        rocketProjectors: 70,
        totalAircraft: 679,
        fighters: 61,
        helicopters: 247,
        attackHelicopters: 12,
        navalVessels: 112,
        aircraftCarriers: 1,
        submarines: 7,
        destroyers: 0,
        frigates: 9,
        nuclearWeapons: false,
        isNatoMember: false,
      },
      {
        countryCode: 'RUS',
        globalRank: 2,
        totalMilitaryPersonnel: 3570000,
        activeSoldiers: 1320000,
        reservePersonnel: 2000000,
        paramilitaryForces: 250000,
        defenseSpending: 109000000000,
        defenseSpendingPercent: 5.9,
        tanks: 14777,
        armoredVehicles: 60870,
        selfPropelledArtillery: 6574,
        towedArtillery: 4400,
        rocketProjectors: 3065,
        totalAircraft: 4255,
        fighters: 773,
        helicopters: 1543,
        attackHelicopters: 544,
        navalVessels: 781,
        aircraftCarriers: 1,
        submarines: 70,
        destroyers: 15,
        frigates: 11,
        nuclearWeapons: true,
        isNatoMember: false,
      },
      {
        countryCode: 'AUS',
        globalRank: 16,
        totalMilitaryPersonnel: 89000,
        activeSoldiers: 59000,
        reservePersonnel: 30000,
        paramilitaryForces: 0,
        defenseSpending: 32400000000,
        defenseSpendingPercent: 2.0,
        tanks: 59,
        armoredVehicles: 2040,
        selfPropelledArtillery: 0,
        towedArtillery: 54,
        rocketProjectors: 0,
        totalAircraft: 452,
        fighters: 79,
        helicopters: 145,
        attackHelicopters: 22,
        navalVessels: 43,
        aircraftCarriers: 2,
        submarines: 6,
        destroyers: 3,
        frigates: 8,
        nuclearWeapons: false,
        isNatoMember: false,
      },
    ];

    for (const mil of military) {
      data.set(mil.countryCode, mil);
    }

    return data;
  }

  async sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>> {
    const startTime = Date.now();
    await this.logSync('started');

    const codes = countryCodes || Array.from(this.militaryData.keys());
    const updates: CountryDataUpdate[] = [];

    try {
      logger.info(`Global Firepower sync starting for ${codes.length} countries`);

      for (const code of codes) {
        const milData = this.militaryData.get(code);
        
        if (milData) {
          const update: CountryDataUpdate = {
            countryCode: code,
            military: {
              globalRank: milData.globalRank,
              totalMilitaryPersonnel: milData.totalMilitaryPersonnel,
              activeSoldiers: milData.activeSoldiers,
              reservePersonnel: milData.reservePersonnel,
              paramilitaryForces: milData.paramilitaryForces,
              defenseSpending: milData.defenseSpending,
              defenseSpendingPercent: milData.defenseSpendingPercent,
              tanks: milData.tanks,
              armoredVehicles: milData.armoredVehicles,
              selfPropelledArtillery: milData.selfPropelledArtillery,
              towedArtillery: milData.towedArtillery,
              rocketProjectors: milData.rocketProjectors,
              totalAircraft: milData.totalAircraft,
              fighters: milData.fighters,
              helicopters: milData.helicopters,
              attackHelicopters: milData.attackHelicopters,
              navalVessels: milData.navalVessels,
              aircraftCarriers: milData.aircraftCarriers,
              submarines: milData.submarines,
              destroyers: milData.destroyers,
              frigates: milData.frigates,
              nuclearWeapons: milData.nuclearWeapons,
              isNatoMember: milData.isNatoMember,
            },
            politics: {
              isNato: milData.isNatoMember,
            },
          };

          updates.push(update);
        }
      }

      const duration = Date.now() - startTime;
      await this.logSync('success', updates.length, undefined, duration);

      logger.info(`Global Firepower sync completed: ${updates.length} countries updated in ${duration}ms`);

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

      logger.error('Global Firepower sync failed', err);

      return {
        success: false,
        error: errorMessage,
        provider: this.name,
        timestamp: new Date(),
      };
    }
  }
}

export const gfpProvider = new GFPProvider();
export default gfpProvider;
