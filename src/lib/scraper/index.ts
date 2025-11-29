import { db } from "@/lib/db";
import { scrapeAmazon } from "./amazon";
import { scrapeMDComputers } from "./mdcomputers";
import { scrapeEliteHubs } from "./elitehubs";

export async function scrapeAllParts() {
    const parts = await db.part.findMany();

    for (const part of parts) {
        console.log(`Scraping for ${part.name}...`);

        // Parallel scraping from all supported retailers
        const results = await Promise.allSettled([
            scrapeAmazon(part.name),
            scrapeMDComputers(part.name),
            scrapeEliteHubs(part.name)
        ]);

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
                const { price, url, retailer, inStock } = result.value;

                // Upsert Retailer
                const retailerRecord = await db.retailer.upsert({
                    where: { name: retailer },
                    update: {},
                    create: { name: retailer, baseUrl: new URL(url).origin }
                });

                // Add Price History
                await db.priceHistory.create({
                    data: {
                        partId: part.id,
                        retailerId: retailerRecord.id,
                        price,
                        url,
                        inStock
                    }
                });
            }
        }
    }
}
