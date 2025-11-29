import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Categories
    const categories = [
        'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case', 'Cooler'
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat },
        });
    }

    // Retailers
    const retailers = [
        { name: 'Amazon', baseUrl: 'https://www.amazon.in' },
        { name: 'MDComputers', baseUrl: 'https://mdcomputers.in' },
        { name: 'EliteHubs', baseUrl: 'https://elitehubs.com' },
    ];

    for (const r of retailers) {
        await prisma.retailer.upsert({
            where: { name: r.name },
            update: {},
            create: { name: r.name, baseUrl: r.baseUrl },
        });
    }

    // Sample Parts
    const cpuCategory = await prisma.category.findUnique({ where: { name: 'CPU' } });
    const gpuCategory = await prisma.category.findUnique({ where: { name: 'GPU' } });
    // ... fetch others as needed

    if (cpuCategory) {
        await prisma.part.create({
            data: {
                name: 'Intel Core i9-14900K',
                categoryId: cpuCategory.id,
                imageUrl: 'https://m.media-amazon.com/images/I/61p6cM8i4ZL._AC_SL1000_.jpg',
                specs: JSON.stringify({
                    socket: 'LGA1700',
                    cores: 24,
                    threads: 32,
                    base_clock: '3.2 GHz',
                    boost_clock: '6.0 GHz',
                    tdp: 125,
                    integrated_graphics: true
                })
            }
        });

        await prisma.part.create({
            data: {
                name: 'AMD Ryzen 7 7800X3D',
                categoryId: cpuCategory.id,
                imageUrl: 'https://m.media-amazon.com/images/I/51f2hkWjTlL._AC_SL1000_.jpg',
                specs: JSON.stringify({
                    socket: 'AM5',
                    cores: 8,
                    threads: 16,
                    base_clock: '4.2 GHz',
                    boost_clock: '5.0 GHz',
                    tdp: 120,
                    integrated_graphics: true
                })
            }
        });
    }

    if (gpuCategory) {
        await prisma.part.create({
            data: {
                name: 'ASUS ROG Strix GeForce RTX 4090',
                categoryId: gpuCategory.id,
                imageUrl: 'https://m.media-amazon.com/images/I/81IcsvE1JFL._AC_SL1500_.jpg',
                specs: JSON.stringify({
                    memory: '24GB GDDR6X',
                    length: 357,
                    tdp: 450,
                    recommended_psu: 1000
                })
            }
        });
    }

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
