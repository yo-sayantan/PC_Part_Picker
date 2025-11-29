import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeEliteHubs(query: string) {
    try {
        // EliteHubs search URL structure might vary, assuming standard WP/WooCommerce style or similar
        const searchUrl = `https://elitehubs.com/?s=${encodeURIComponent(query)}&post_type=product`;
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        const firstResult = $('.product-small').first();

        if (!firstResult.length) return null;

        const title = firstResult.find('.name a').text().trim();
        const priceText = firstResult.find('.price .amount').last().text().trim(); // Get the last amount (sale price)
        const price = parseFloat(priceText.replace(/[₹,]/g, '').trim());
        const url = firstResult.find('.name a').attr('href') || '';

        const inStock = !firstResult.hasClass('out-of-stock');

        if (isNaN(price)) return null;

        return {
            retailer: 'EliteHubs',
            price,
            url,
            inStock
        };

    } catch (error) {
        console.error('Error scraping EliteHubs:', error);
        return null;
    }
}
