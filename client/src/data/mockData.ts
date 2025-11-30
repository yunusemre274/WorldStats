export interface CountryStats {
  id: string;
  name: string;
  demographics: {
    avgIq: number;
    maleFemaleRatio: string;
    childPop: string; // percentage
    literacyRate: string; // percentage
    addictionRates: {
      smoking: string;
      alcohol: string;
      substances: string;
    };
    population: number;
  };
  military: {
    rank: number;
    activePersonnel: number;
    budget: string;
    assets: { name: string; value: number }[];
  };
  crime: {
    index: number;
    categories: { name: string; value: number }[];
    trend: { year: string; value: number }[];
  };
  economic: {
    gdpPerCapita: string;
    govType: string;
    memberships: string[]; // EU, NATO, etc.
    passportRank: number;
  };
}

export const MOCK_STATS: Record<string, CountryStats> = {
  "USA": {
    id: "USA",
    name: "United States",
    demographics: {
      avgIq: 98,
      maleFemaleRatio: "0.97:1",
      childPop: "18.5%",
      literacyRate: "99%",
      addictionRates: { smoking: "12%", alcohol: "5%", substances: "3%" },
      population: 331000000
    },
    military: {
      rank: 1,
      activePersonnel: 1390000,
      budget: "$778B",
      assets: [
        { name: "Air", value: 13264 },
        { name: "Land", value: 6612 },
        { name: "Naval", value: 490 }
      ]
    },
    crime: {
      index: 47.8,
      categories: [
        { name: "Violent", value: 40 },
        { name: "Property", value: 60 },
        { name: "Cyber", value: 30 }
      ],
      trend: [
        { year: "2020", value: 45 },
        { year: "2021", value: 46 },
        { year: "2022", value: 47 },
        { year: "2023", value: 47.8 }
      ]
    },
    economic: {
      gdpPerCapita: "$63,543",
      govType: "Federal Republic",
      memberships: ["NATO", "UN", "G7"],
      passportRank: 7
    }
  },
  "CHN": {
    id: "CHN",
    name: "China",
    demographics: {
      avgIq: 104,
      maleFemaleRatio: "1.06:1",
      childPop: "17.7%",
      literacyRate: "96%",
      addictionRates: { smoking: "24%", alcohol: "2%", substances: "1%" },
      population: 1439323776
    },
    military: {
      rank: 2,
      activePersonnel: 2185000,
      budget: "$252B",
      assets: [
        { name: "Air", value: 3285 },
        { name: "Land", value: 35000 },
        { name: "Naval", value: 777 }
      ]
    },
    crime: {
      index: 31.2,
      categories: [
        { name: "Violent", value: 20 },
        { name: "Property", value: 40 },
        { name: "Cyber", value: 80 }
      ],
      trend: [
        { year: "2020", value: 30 },
        { year: "2021", value: 31 },
        { year: "2022", value: 31 },
        { year: "2023", value: 31.2 }
      ]
    },
    economic: {
      gdpPerCapita: "$10,500",
      govType: "Socialist Republic",
      memberships: ["UN", "G20", "BRICS"],
      passportRank: 72
    }
  },
  "RUS": {
    id: "RUS",
    name: "Russia",
    demographics: {
      avgIq: 96,
      maleFemaleRatio: "0.86:1",
      childPop: "17.1%",
      literacyRate: "99%",
      addictionRates: { smoking: "29%", alcohol: "8%", substances: "2%" },
      population: 145912025
    },
    military: {
      rank: 3,
      activePersonnel: 1014000,
      budget: "$61B",
      assets: [
        { name: "Air", value: 4173 },
        { name: "Land", value: 27000 },
        { name: "Naval", value: 603 }
      ]
    },
    crime: {
      index: 39.7,
      categories: [
        { name: "Violent", value: 50 },
        { name: "Property", value: 40 },
        { name: "Cyber", value: 70 }
      ],
      trend: [
        { year: "2020", value: 41 },
        { year: "2021", value: 40 },
        { year: "2022", value: 39 },
        { year: "2023", value: 39.7 }
      ]
    },
    economic: {
      gdpPerCapita: "$10,126",
      govType: "Federal Republic",
      memberships: ["UN", "BRICS", "CIS"],
      passportRank: 50
    }
  },
  "DEU": {
    id: "DEU",
    name: "Germany",
    demographics: {
      avgIq: 100,
      maleFemaleRatio: "0.96:1",
      childPop: "13.8%",
      literacyRate: "99%",
      addictionRates: { smoking: "21%", alcohol: "10%", substances: "1%" },
      population: 83783942
    },
    military: {
      rank: 15,
      activePersonnel: 183000,
      budget: "$52B",
      assets: [
        { name: "Air", value: 700 },
        { name: "Land", value: 5000 },
        { name: "Naval", value: 80 }
      ]
    },
    crime: {
      index: 34.6,
      categories: [
        { name: "Violent", value: 20 },
        { name: "Property", value: 50 },
        { name: "Cyber", value: 10 }
      ],
      trend: [
        { year: "2020", value: 35 },
        { year: "2021", value: 34 },
        { year: "2022", value: 34 },
        { year: "2023", value: 34.6 }
      ]
    },
    economic: {
      gdpPerCapita: "$46,208",
      govType: "Federal Republic",
      memberships: ["EU", "NATO", "UN", "G7"],
      passportRank: 2
    }
  },
  // Default fallback for any other country
  "DEFAULT": {
    id: "UNK",
    name: "Unknown Territory",
    demographics: {
      avgIq: 90,
      maleFemaleRatio: "1:1",
      childPop: "20%",
      literacyRate: "85%",
      addictionRates: { smoking: "15%", alcohol: "5%", substances: "1%" },
      population: 10000000
    },
    military: {
      rank: 50,
      activePersonnel: 50000,
      budget: "$10B",
      assets: [
        { name: "Air", value: 100 },
        { name: "Land", value: 500 },
        { name: "Naval", value: 10 }
      ]
    },
    crime: {
      index: 40,
      categories: [
        { name: "Violent", value: 30 },
        { name: "Property", value: 30 },
        { name: "Cyber", value: 30 }
      ],
      trend: [
        { year: "2020", value: 40 },
        { year: "2021", value: 40 },
        { year: "2022", value: 40 },
        { year: "2023", value: 40 }
      ]
    },
    economic: {
      gdpPerCapita: "$15,000",
      govType: "Republic",
      memberships: ["UN"],
      passportRank: 30
    }
  }
};
