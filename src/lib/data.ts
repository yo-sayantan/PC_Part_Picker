import fs from 'fs';
import path from 'path';

export interface PartSpecs {
    // CPU
    socket?: string;
    cores?: number;
    threads?: number;
    tdp?: number;
    integrated_graphics?: boolean;

    // RAM
    memory_type?: string; // DDR3, DDR4, DDR5
    speed?: number;
    capacity?: number;
    modules?: number;

    // GPU
    memory?: string;
    length?: number; // GPU length in mm

    // Motherboard
    form_factor?: string;
    m2_slots?: number;
    pcie_slots?: number;
    ram_slots?: number;

    // Cooler
    type?: string;
    height?: number; // Cooler height in mm
    size?: number; // AIO radiator size
    socket_support?: string;

    // PSU
    wattage?: number;
    efficiency?: string;
    modular?: string;

    // Case
    max_gpu_length?: number;
    max_cpu_cooler_height?: number;
    radiator_support?: string; // "front:360,280|top:240|rear:120"
    fan_support?: string; // "front:3x120,2x140|top:2x120|rear:1x120"
}

export interface Part {
    id: string;
    name: string;
    category: string;
    price: number;
    retailer: string;
    url: string;
    imageUrl?: string;
    specs: PartSpecs;
    lastUpdated?: string;
}

function parseSpecs(specsStr: string): PartSpecs {
    try {
        // Remove surrounding quotes if present and unescape double quotes
        const cleaned = specsStr.replace(/^"|"$/g, '').replace(/""/g, '"');
        return JSON.parse(cleaned);
    } catch (e) {
        console.error('Failed to parse specs:', specsStr, e);
        return {};
    }
}

export function loadPartsFromCSV(): Part[] {
    const csvPath = path.join(process.cwd(), 'data', 'parts.csv');

    if (!fs.existsSync(csvPath)) {
        console.warn('Parts CSV not found, returning empty array');
        return [];
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) return [];

    // Skip header
    const dataLines = lines.slice(1);

    return dataLines.map(line => {
        // Use regex to properly parse CSV with quoted fields
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const fields = line.split(regex);

        const [id, name, category, price, retailer, url, imageUrl, specs, lastUpdated] = fields.map(f => f.trim().replace(/^"|"$/g, ''));

        return {
            id,
            name,
            category,
            price: parseFloat(price) || 0,
            retailer,
            url,
            imageUrl,
            specs: parseSpecs(specs),
            lastUpdated
        };
    });
}

export function savePartsToCSV(parts: Part[]): void {
    const csvPath = path.join(process.cwd(), 'data', 'parts.csv');
    const dir = path.dirname(csvPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const header = 'id,name,category,price,retailer,url,imageUrl,specs,lastUpdated';
    const rows = parts.map(p =>
        `${p.id},"${p.name}",${p.category},${p.price},${p.retailer},"${p.url}","${p.imageUrl || ''}","${JSON.stringify(p.specs).replace(/"/g, '""')}",${p.lastUpdated || new Date().toISOString()}`
    );

    fs.writeFileSync(csvPath, [header, ...rows].join('\n'), 'utf-8');
}
