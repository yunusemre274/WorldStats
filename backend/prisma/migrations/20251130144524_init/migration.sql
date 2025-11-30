-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "code3" TEXT,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "region" TEXT,
    "subregion" TEXT,
    "capital" TEXT,
    "population" BIGINT,
    "area" REAL,
    "flagUrl" TEXT,
    "mapUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Demographics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "totalPopulation" BIGINT,
    "malePopulation" BIGINT,
    "femalePopulation" BIGINT,
    "maleFemaleRatio" TEXT,
    "populationGrowthRate" REAL,
    "medianAge" REAL,
    "lifeExpectancy" REAL,
    "lifeExpectancyMale" REAL,
    "lifeExpectancyFemale" REAL,
    "birthRate" REAL,
    "deathRate" REAL,
    "fertilityRate" REAL,
    "infantMortalityRate" REAL,
    "urbanPopulationPercent" REAL,
    "childPopulationPercent" REAL,
    "workingAgePercent" REAL,
    "elderlyPercent" REAL,
    "averageIQ" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Demographics_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Economy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "gdp" REAL,
    "gdpPerCapita" REAL,
    "gdpGrowthRate" REAL,
    "gdpPpp" REAL,
    "gdpGrowthHistory" TEXT,
    "inflation" REAL,
    "unemploymentRate" REAL,
    "povertyRate" REAL,
    "giniIndex" REAL,
    "publicDebt" REAL,
    "externalDebt" REAL,
    "tradeBalance" REAL,
    "exports" REAL,
    "imports" REAL,
    "foreignReserves" REAL,
    "minimumWage" REAL,
    "averageIncome" REAL,
    "currency" TEXT,
    "currencyCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Economy_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Military" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "globalRank" INTEGER,
    "totalMilitaryPersonnel" INTEGER,
    "activeSoldiers" INTEGER,
    "reservePersonnel" INTEGER,
    "paramilitaryForces" INTEGER,
    "defenseSpending" REAL,
    "defenseSpendingPercent" REAL,
    "tanks" INTEGER,
    "armoredVehicles" INTEGER,
    "selfPropelledArtillery" INTEGER,
    "towedArtillery" INTEGER,
    "rocketProjectors" INTEGER,
    "totalAircraft" INTEGER,
    "fighters" INTEGER,
    "helicopters" INTEGER,
    "attackHelicopters" INTEGER,
    "navalVessels" INTEGER,
    "aircraftCarriers" INTEGER,
    "submarines" INTEGER,
    "destroyers" INTEGER,
    "frigates" INTEGER,
    "nuclearWeapons" BOOLEAN NOT NULL DEFAULT false,
    "isNatoMember" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Military_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Politics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "governmentType" TEXT,
    "chiefOfState" TEXT,
    "headOfGovernment" TEXT,
    "politicalSystem" TEXT,
    "legislativeBranch" TEXT,
    "judicialBranch" TEXT,
    "constitution" TEXT,
    "suffrage" TEXT,
    "independenceDate" DATETIME,
    "nationalHoliday" TEXT,
    "isEU" BOOLEAN NOT NULL DEFAULT false,
    "isUN" BOOLEAN NOT NULL DEFAULT true,
    "isNato" BOOLEAN NOT NULL DEFAULT false,
    "isG7" BOOLEAN NOT NULL DEFAULT false,
    "isG20" BOOLEAN NOT NULL DEFAULT false,
    "isBrics" BOOLEAN NOT NULL DEFAULT false,
    "passportRanking" INTEGER,
    "passportVisaFree" INTEGER,
    "democracyIndex" REAL,
    "corruptionIndex" REAL,
    "presssFreedomIndex" REAL,
    "humanDevelopmentIndex" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Politics_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Crime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "crimeIndex" REAL,
    "safetyIndex" REAL,
    "totalCrimeRate" REAL,
    "homicideRate" REAL,
    "assaultRate" REAL,
    "robberyRate" REAL,
    "burglaryRate" REAL,
    "vehicleTheftRate" REAL,
    "kidnappingRate" REAL,
    "humanTraffickingRisk" TEXT,
    "drugTraffickingRisk" TEXT,
    "terrorismRisk" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Crime_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrimeCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "crimeId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "percentage" REAL NOT NULL,
    "count" INTEGER,
    CONSTRAINT "CrimeCategory_crimeId_fkey" FOREIGN KEY ("crimeId") REFERENCES "Crime" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HealthStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "healthcareSpendingPercent" REAL,
    "healthcareSpendingPerCapita" REAL,
    "hospitalBedsPer1000" REAL,
    "physiciansPer1000" REAL,
    "nursesPer1000" REAL,
    "obesityRate" REAL,
    "smokingRate" REAL,
    "alcoholConsumption" REAL,
    "alcoholDependencyRate" REAL,
    "drugUseRate" REAL,
    "cannabisUseRate" REAL,
    "opioidUseRate" REAL,
    "cocaineUseRate" REAL,
    "hivPrevalence" REAL,
    "tuberculosisIncidence" REAL,
    "malariaIncidence" REAL,
    "diabetesPrevalence" REAL,
    "mentalHealthDisorders" REAL,
    "suicideRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthStats_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "literacyRate" REAL,
    "literacyRateMale" REAL,
    "literacyRateFemale" REAL,
    "educationSpendingPercent" REAL,
    "primaryEnrollmentRate" REAL,
    "secondaryEnrollmentRate" REAL,
    "tertiaryEnrollmentRate" REAL,
    "averageSchoolingYears" REAL,
    "studentTeacherRatio" REAL,
    "piloStudentsReading" INTEGER,
    "piloStudentsMath" INTEGER,
    "piloStudentsScience" INTEGER,
    "universitiesInTop500" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Education_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AISummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "model" TEXT,
    "tokensUsed" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "AISummary_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExternalDataCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsCount" INTEGER,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "metadata" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE INDEX "Country_name_idx" ON "Country"("name");

-- CreateIndex
CREATE INDEX "Country_region_idx" ON "Country"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Demographics_countryId_key" ON "Demographics"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Economy_countryId_key" ON "Economy"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Military_countryId_key" ON "Military"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Politics_countryId_key" ON "Politics"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Crime_countryId_key" ON "Crime"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CrimeCategory_crimeId_category_key" ON "CrimeCategory"("crimeId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "HealthStats_countryId_key" ON "HealthStats"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Education_countryId_key" ON "Education"("countryId");

-- CreateIndex
CREATE INDEX "AISummary_countryId_createdAt_idx" ON "AISummary"("countryId", "createdAt");

-- CreateIndex
CREATE INDEX "ExternalDataCache_provider_idx" ON "ExternalDataCache"("provider");

-- CreateIndex
CREATE INDEX "ExternalDataCache_expiresAt_idx" ON "ExternalDataCache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalDataCache_provider_endpoint_key" ON "ExternalDataCache"("provider", "endpoint");

-- CreateIndex
CREATE INDEX "SyncLog_provider_idx" ON "SyncLog"("provider");

-- CreateIndex
CREATE INDEX "SyncLog_status_idx" ON "SyncLog"("status");

-- CreateIndex
CREATE INDEX "SyncLog_startedAt_idx" ON "SyncLog"("startedAt");
