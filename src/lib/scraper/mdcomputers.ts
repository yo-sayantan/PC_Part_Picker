import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMDComputers(query: string) {
    try {
        const searchUrl = `https://mdcomputers.in/index.php?route=product/search&search=${encodeURIComponent(query)}`;
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        const firstResult = $('.product-item-container').first();

        if (!firstResult.length) return null;

        const title = firstResult.find('h4 a').text().trim();
        const priceText = firstResult.find('.price-new').text().trim() || firstResult.find('.price').text().trim();
        const price = parseFloat(priceText.replace(/[₹,]/g, '').trim());
        const url = firstResult.find('h4 a').attr('href') || '';

        // Stock status
        // MDComputers usually shows "Add to Cart" if in stock
        const inStock = firstResult.find('button.addToCart').length > 0;

        if (isNaN(price)) return null;

        return {
            retailer: 'MDComputers',
            price,
            url,
            inStock
        };

    } catch (error) {
        console.error('Error scraping MDComputers:', error);
        return null;
    }
}
