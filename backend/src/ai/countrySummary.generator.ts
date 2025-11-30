// AI Country Summary Generator - Uses OpenAI to generate factual summaries
import OpenAI from 'openai';
import prisma from '../db/client.js';
import redis from '../utils/redis.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { countryService, CountryFullData } from '../services/country.service.js';

interface AISummaryResult {
  summary: string;
  generatedAt: Date;
  model: string;
  cached: boolean;
}

class CountrySummaryGenerator {
  private openai: OpenAI | null = null;

  constructor() {
    if (config.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
  }

  async generateSummary(countryCode: string): Promise<AISummaryResult> {
    const normalizedCode = countryCode.toUpperCase();
    const cacheKey = `ai:summary:${normalizedCode}`;

    // Try cache first
    const cached = await redis.get<AISummaryResult>(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    // Check database cache
    const dbCached = await prisma.aISummary.findFirst({
      where: {
        country: {
          OR: [
            { code: normalizedCode },
            { code3: normalizedCode },
          ],
        },
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbCached) {
      const result: AISummaryResult = {
        summary: dbCached.summary,
        generatedAt: dbCached.createdAt,
        model: dbCached.model || 'unknown',
        cached: true,
      };
      await redis.set(cacheKey, result, config.cache.aiSummaryTtl);
      return result;
    }

    // Generate new summary
    const countryData = await countryService.getOne(normalizedCode);
    
    if (!this.openai) {
      // Return a fallback summary if OpenAI is not configured
      return this.generateFallbackSummary(countryData);
    }

    try {
      const prompt = this.buildPrompt(countryData);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a factual data analyst. Summarize country statistics in 5-7 clear, factual sentences. 
            Use only the data provided. Do not hallucinate or invent data. 
            Focus on key highlights: population, economy, military ranking, and notable characteristics.
            Write in an informative, neutral tone.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const summary = response.choices[0]?.message?.content || 'Summary unavailable.';
      const model = 'gpt-4o';
      const tokensUsed = response.usage?.total_tokens || 0;

      // Save to database
      const country = await prisma.country.findFirst({
        where: {
          OR: [
            { code: normalizedCode },
            { code3: normalizedCode },
          ],
        },
      });

      if (country) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await prisma.aISummary.create({
          data: {
            countryId: country.id,
            summary,
            model,
            tokensUsed,
            expiresAt,
          },
        });
      }

      const result: AISummaryResult = {
        summary,
        generatedAt: new Date(),
        model,
        cached: false,
      };

      await redis.set(cacheKey, result, config.cache.aiSummaryTtl);
      return result;
    } catch (err) {
      logger.error('Failed to generate AI summary', err);
      return this.generateFallbackSummary(countryData);
    }
  }

  private buildPrompt(data: CountryFullData): string {
    return `Summarize the following country data for ${data.country}:

DEMOGRAPHICS:
- Population: ${data.categories.demographics.totalPopulation?.toLocaleString() || 'N/A'}
- Life Expectancy: ${data.categories.demographics.lifeExpectancy || 'N/A'} years
- Median Age: ${data.categories.demographics.medianAge || 'N/A'} years
- Male/Female Ratio: ${data.categories.demographics.maleFemaleRatio || 'N/A'}
- Urban Population: ${data.categories.demographics.urbanPopulationPercent || 'N/A'}%

ECONOMY:
- GDP: $${data.categories.economy.gdp?.toLocaleString() || 'N/A'}
- GDP Per Capita: $${data.categories.economy.gdpPerCapita?.toLocaleString() || 'N/A'}
- GDP Growth: ${data.categories.economy.gdpGrowthRate || 'N/A'}%
- Unemployment: ${data.categories.economy.unemploymentRate || 'N/A'}%
- Inflation: ${data.categories.economy.inflation || 'N/A'}%

MILITARY:
- Global Ranking: ${data.categories.military.globalRank || 'N/A'}
- Active Soldiers: ${data.categories.military.activeSoldiers?.toLocaleString() || 'N/A'}
- NATO Member: ${data.categories.military.isNatoMember ? 'Yes' : 'No'}
- Nuclear Weapons: ${data.categories.military.nuclearWeapons ? 'Yes' : 'No'}

POLITICAL:
- Government Type: ${data.categories.political.governmentType || 'N/A'}
- EU Member: ${data.categories.political.isEU ? 'Yes' : 'No'}
- Passport Ranking: ${data.categories.political.passportRanking || 'N/A'}

CRIME:
- Crime Index: ${data.categories.crime.crimeIndex || 'N/A'}
- Safety Index: ${data.categories.crime.safetyIndex || 'N/A'}

HEALTH:
- Smoking Rate: ${data.categories.health.smokingRate || 'N/A'}%
- Alcohol Dependency: ${data.categories.health.alcoholDependencyRate || 'N/A'}%
- Drug Use: ${data.categories.health.drugUseRate || 'N/A'}%

Please provide a concise, factual summary of ${data.country} in 5-7 sentences.`;
  }

  private generateFallbackSummary(data: CountryFullData): AISummaryResult {
    const parts: string[] = [];

    // Population
    if (data.categories.demographics.totalPopulation) {
      parts.push(`${data.country} has a population of approximately ${(data.categories.demographics.totalPopulation / 1000000).toFixed(1)} million people.`);
    }

    // Economy
    if (data.categories.economy.gdpPerCapita) {
      parts.push(`The country's GDP per capita stands at $${data.categories.economy.gdpPerCapita.toLocaleString()}.`);
    }

    // Military
    if (data.categories.military.globalRank) {
      parts.push(`It ranks ${data.categories.military.globalRank}${this.getOrdinalSuffix(data.categories.military.globalRank)} globally in military power.`);
    }

    // Political
    if (data.categories.political.governmentType) {
      parts.push(`The government operates as a ${data.categories.political.governmentType}.`);
    }

    // Memberships
    const memberships: string[] = [];
    if (data.categories.political.isEU) memberships.push('EU');
    if (data.categories.military.isNatoMember) memberships.push('NATO');
    if (data.categories.political.isG7) memberships.push('G7');
    if (data.categories.political.isG20) memberships.push('G20');
    
    if (memberships.length > 0) {
      parts.push(`${data.country} is a member of ${memberships.join(', ')}.`);
    }

    // Safety
    if (data.categories.crime.safetyIndex) {
      const safetyLevel = data.categories.crime.safetyIndex > 60 ? 'relatively safe' : 
                          data.categories.crime.safetyIndex > 40 ? 'moderately safe' : 'challenging in terms of safety';
      parts.push(`The country is considered ${safetyLevel} with a safety index of ${data.categories.crime.safetyIndex.toFixed(1)}.`);
    }

    // Passport
    if (data.categories.political.passportRanking) {
      parts.push(`Its passport ranks ${data.categories.political.passportRanking}${this.getOrdinalSuffix(data.categories.political.passportRanking)} in the world for travel freedom.`);
    }

    const summary = parts.length > 0 
      ? parts.join(' ')
      : `${data.country} is a sovereign nation. Detailed statistics are being updated.`;

    return {
      summary,
      generatedAt: new Date(),
      model: 'fallback',
      cached: false,
    };
  }

  private getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }
}

export const countrySummaryGenerator = new CountrySummaryGenerator();
export default countrySummaryGenerator;
