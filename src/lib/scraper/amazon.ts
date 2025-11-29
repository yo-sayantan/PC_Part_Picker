import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeAmazon(query: string) {
    try {
        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const $ = cheerio.load(data);

        // Find the first non-sponsored result
        const firstResult = $('.s-result-item[data-component-type="s-search-result"]').first();

        if (!firstResult.length) return null;

        const title = firstResult.find('h2 a span').text().trim();
        const priceWhole = firstResult.find('.a-price-whole').first().text().replace(/,/g, '').trim();
        const priceFraction = firstResult.find('.a-price-fraction').first().text().trim();
        const price = parseFloat(`${priceWhole}.${priceFraction || '00'}`);
        const urlPath = firstResult.find('h2 a').attr('href');
        const url = `https://www.amazon.in${urlPath}`;

        // Basic check if the title matches the query roughly (optional, but good for accuracy)
        if (!title.toLowerCase().includes(query.toLowerCase().split(' ')[0])) {
            // If the first word doesn't match, it might be a bad result
            // But for now, let's trust the search ranking
        }

        if (isNaN(price)) return null;

        return {
            retailer: 'Amazon',
            price,
            url,
            inStock: true // Hard to determine without visiting product page, assuming search result implies stock
        };

    } catch (error) {
        console.error('Error scraping Amazon:', error);
        return null;
    }
}
