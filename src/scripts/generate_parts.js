const fs = require('fs');
const path = require('path');
try { fs.writeFileSync('debug_parts.txt', 'Script started\n'); } catch (e) { }

const categories = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case', 'cooler'];
const retailers = ['Amazon', 'MDComputers', 'EliteHubs', 'VedantComputers', 'PrimeABGB'];

const cpus = [
    { name: 'Intel Core i9-14900K', price: 54999, specs: { socket: 'LGA1700', cores: 24, threads: 32, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i7-14700K', price: 38999, specs: { socket: 'LGA1700', cores: 20, threads: 28, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i5-14600K', price: 28999, specs: { socket: 'LGA1700', cores: 14, threads: 20, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i9-13900K', price: 49999, specs: { socket: 'LGA1700', cores: 24, threads: 32, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i7-13700K', price: 34999, specs: { socket: 'LGA1700', cores: 16, threads: 24, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i5-13600K', price: 26999, specs: { socket: 'LGA1700', cores: 14, threads: 20, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i5-12400F', price: 10999, specs: { socket: 'LGA1700', cores: 6, threads: 12, tdp: 65, integrated_graphics: false } },
    { name: 'AMD Ryzen 9 7950X3D', price: 58999, specs: { socket: 'AM5', cores: 16, threads: 32, tdp: 120, integrated_graphics: true } },
    { name: 'AMD Ryzen 7 7800X3D', price: 36999, specs: { socket: 'AM5', cores: 8, threads: 16, tdp: 120, integrated_graphics: true } },
    { name: 'AMD Ryzen 9 7900X', price: 38999, specs: { socket: 'AM5', cores: 12, threads: 24, tdp: 170, integrated_graphics: true } },
    { name: 'AMD Ryzen 7 7700X', price: 28999, specs: { socket: 'AM5', cores: 8, threads: 16, tdp: 105, integrated_graphics: true } },
    { name: 'AMD Ryzen 5 7600X', price: 21999, specs: { socket: 'AM5', cores: 6, threads: 12, tdp: 105, integrated_graphics: true } },
    { name: 'AMD Ryzen 9 5950X', price: 34999, specs: { socket: 'AM4', cores: 16, threads: 32, tdp: 105, integrated_graphics: false } },
    { name: 'AMD Ryzen 7 5800X3D', price: 28999, specs: { socket: 'AM4', cores: 8, threads: 16, tdp: 105, integrated_graphics: false } },
    { name: 'AMD Ryzen 5 5600X', price: 13999, specs: { socket: 'AM4', cores: 6, threads: 12, tdp: 65, integrated_graphics: false } },
    // Historical CPUs (Last 5 Years)
    // Intel 11th Gen
    { name: 'Intel Core i9-11900K', price: 28999, specs: { socket: 'LGA1200', cores: 8, threads: 16, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i7-11700K', price: 22999, specs: { socket: 'LGA1200', cores: 8, threads: 16, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i5-11600K', price: 16999, specs: { socket: 'LGA1200', cores: 6, threads: 12, tdp: 125, integrated_graphics: true } },
    // Intel 10th Gen
    { name: 'Intel Core i9-10900K', price: 24999, specs: { socket: 'LGA1200', cores: 10, threads: 20, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i7-10700K', price: 18999, specs: { socket: 'LGA1200', cores: 8, threads: 16, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i5-10600K', price: 13999, specs: { socket: 'LGA1200', cores: 6, threads: 12, tdp: 125, integrated_graphics: true } },
    { name: 'Intel Core i5-10400F', price: 8999, specs: { socket: 'LGA1200', cores: 6, threads: 12, tdp: 65, integrated_graphics: false } },
    // AMD Ryzen 5000 Series (More)
    { name: 'AMD Ryzen 9 5900X', price: 28999, specs: { socket: 'AM4', cores: 12, threads: 24, tdp: 105, integrated_graphics: false } },
    { name: 'AMD Ryzen 7 5700X', price: 16999, specs: { socket: 'AM4', cores: 8, threads: 16, tdp: 65, integrated_graphics: false } },
    // AMD Ryzen 3000 Series
    { name: 'AMD Ryzen 9 3900X', price: 22999, specs: { socket: 'AM4', cores: 12, threads: 24, tdp: 105, integrated_graphics: false } },
    { name: 'AMD Ryzen 7 3700X', price: 14999, specs: { socket: 'AM4', cores: 8, threads: 16, tdp: 65, integrated_graphics: false } },
    { name: 'AMD Ryzen 5 3600', price: 8500, specs: { socket: 'AM4', cores: 6, threads: 12, tdp: 65, integrated_graphics: false } },
];

const mobos = [
    { name: 'ASUS ROG Maximus Z790 Hero', price: 68999, specs: { socket: 'LGA1700', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 5, pcie_slots: 3 } },
    { name: 'MSI MPG Z790 Carbon WiFi', price: 45999, specs: { socket: 'LGA1700', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 5, pcie_slots: 3 } },
    { name: 'Gigabyte Z790 AORUS Elite AX', price: 28999, specs: { socket: 'LGA1700', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 4, pcie_slots: 3 } },
    { name: 'ASRock Z790 Taichi', price: 49999, specs: { socket: 'LGA1700', form_factor: 'E-ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 4, pcie_slots: 2 } },
    { name: 'ASUS TUF Gaming B760-Plus WiFi', price: 18999, specs: { socket: 'LGA1700', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 3, pcie_slots: 2 } },
    { name: 'MSI MAG B760M Mortar WiFi', price: 16999, specs: { socket: 'LGA1700', form_factor: 'mATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
    { name: 'Gigabyte B760M DS3H AX', price: 13500, specs: { socket: 'LGA1700', form_factor: 'mATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 2, pcie_slots: 1 } },
    { name: 'ASUS Prime B660-Plus D4', price: 13999, specs: { socket: 'LGA1700', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 3, pcie_slots: 2 } },
    { name: 'ASUS ROG Crosshair X670E Hero', price: 65999, specs: { socket: 'AM5', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 4, pcie_slots: 3 } },
    { name: 'MSI MEG X670E ACE', price: 72999, specs: { socket: 'AM5', form_factor: 'E-ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 4, pcie_slots: 3 } },
    { name: 'Gigabyte X670 AORUS Elite AX', price: 29999, specs: { socket: 'AM5', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 4, pcie_slots: 3 } },
    { name: 'ASRock X670E Steel Legend', price: 32999, specs: { socket: 'AM5', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 4, pcie_slots: 2 } },
    { name: 'MSI MAG B650 Tomahawk WiFi', price: 21999, specs: { socket: 'AM5', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 3, pcie_slots: 2 } },
    { name: 'ASUS TUF Gaming B650-Plus', price: 19999, specs: { socket: 'AM5', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 3, pcie_slots: 2 } },
    { name: 'Gigabyte B650 Gaming X AX', price: 18500, specs: { socket: 'AM5', form_factor: 'ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 3, pcie_slots: 2 } },
    { name: 'ASRock B650M Pro RS WiFi', price: 14999, specs: { socket: 'AM5', form_factor: 'mATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 3, pcie_slots: 1 } },
    { name: 'Gigabyte B550 AORUS Pro AC', price: 16999, specs: { socket: 'AM4', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 2, pcie_slots: 3 } },
    { name: 'MSI B550-A Pro', price: 11999, specs: { socket: 'AM4', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
    { name: 'ASUS TUF Gaming B550-Plus', price: 14500, specs: { socket: 'AM4', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
    // New Motherboards
    { name: 'ASRock B550M Steel Legend', price: 10999, specs: { socket: 'AM4', form_factor: 'mATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
    { name: 'Gigabyte Z690 AORUS Master', price: 35999, specs: { socket: 'LGA1700', form_factor: 'E-ATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 5, pcie_slots: 3 } },
    { name: 'MSI PRO B760M-A WiFi', price: 14500, specs: { socket: 'LGA1700', form_factor: 'mATX', memory_type: 'DDR5', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
    { name: 'ASUS ROG Strix B550-F Gaming', price: 17500, specs: { socket: 'AM4', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
    // LGA1200 Motherboards (for 10th/11th Gen)
    { name: 'ASUS ROG Strix Z590-E Gaming WiFi', price: 24999, specs: { socket: 'LGA1200', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 4, pcie_slots: 3 } },
    { name: 'MSI MAG B560 Tomahawk WiFi', price: 15999, specs: { socket: 'LGA1200', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 3, pcie_slots: 2 } },
    { name: 'Gigabyte Z490 AORUS Elite AC', price: 18999, specs: { socket: 'LGA1200', form_factor: 'ATX', memory_type: 'DDR4', ram_slots: 4, m2_slots: 2, pcie_slots: 2 } },
];

const gpus = [
    { name: 'ASUS ROG Strix RTX 4090 OC', price: 195000, specs: { memory: '24GB GDDR6X', length: 357, tdp: 450, pcie_slots: 3.5 } },
    { name: 'Gigabyte RTX 4090 Gaming OC', price: 175000, specs: { memory: '24GB GDDR6X', length: 340, tdp: 450, pcie_slots: 3 } },
    { name: 'MSI RTX 4090 Suprim X', price: 185000, specs: { memory: '24GB GDDR6X', length: 336, tdp: 450, pcie_slots: 3.5 } },
    { name: 'Zotac RTX 4090 AMP Extreme AIRO', price: 169999, specs: { memory: '24GB GDDR6X', length: 356, tdp: 450, pcie_slots: 3.5 } },
    { name: 'MSI RTX 4080 Super Gaming X Slim', price: 105000, specs: { memory: '16GB GDDR6X', length: 322, tdp: 320, pcie_slots: 3 } },
    { name: 'ASUS TUF Gaming RTX 4080 Super', price: 108999, specs: { memory: '16GB GDDR6X', length: 348, tdp: 320, pcie_slots: 3.2 } },
    { name: 'Zotac RTX 4070 Ti Super Trinity', price: 79999, specs: { memory: '16GB GDDR6X', length: 307, tdp: 285, pcie_slots: 2.5 } },
    { name: 'Gigabyte RTX 4070 Ti Super Windforce', price: 76999, specs: { memory: '16GB GDDR6X', length: 261, tdp: 285, pcie_slots: 2.5 } },
    { name: 'ASUS Dual RTX 4070 Super', price: 62999, specs: { memory: '12GB GDDR6X', length: 267, tdp: 220, pcie_slots: 2.5 } },
    { name: 'MSI RTX 4070 Super Ventus 2X', price: 59999, specs: { memory: '12GB GDDR6X', length: 242, tdp: 220, pcie_slots: 2 } },
    { name: 'Gigabyte RTX 4060 Ti Eagle', price: 38999, specs: { memory: '8GB GDDR6', length: 272, tdp: 160, pcie_slots: 2 } },
    { name: 'ASUS Dual RTX 4060 OC', price: 29500, specs: { memory: '8GB GDDR6', length: 227, tdp: 115, pcie_slots: 2.5 } },
    { name: 'MSI RTX 3060 Ventus 2X', price: 24999, specs: { memory: '12GB GDDR6', length: 235, tdp: 170, pcie_slots: 2 } },
    { name: 'Sapphire Nitro+ RX 7900 XTX', price: 105000, specs: { memory: '24GB GDDR6', length: 320, tdp: 355, pcie_slots: 3.5 } },
    { name: 'ASRock RX 7900 XTX Taichi', price: 99999, specs: { memory: '24GB GDDR6', length: 345, tdp: 355, pcie_slots: 3 } },
    { name: 'PowerColor Hellhound RX 7800 XT', price: 53999, specs: { memory: '16GB GDDR6', length: 322, tdp: 263, pcie_slots: 2.5 } },
    { name: 'Sapphire Pulse RX 7800 XT', price: 51999, specs: { memory: '16GB GDDR6', length: 280, tdp: 263, pcie_slots: 2.5 } },
    { name: 'ASRock Challenger RX 7700 XT', price: 42999, specs: { memory: '12GB GDDR6', length: 266, tdp: 245, pcie_slots: 2.5 } },
    { name: 'Sapphire Pulse RX 7600', price: 26999, specs: { memory: '8GB GDDR6', length: 240, tdp: 165, pcie_slots: 2 } },
    // NVIDIA RTX 30 Series
    { name: 'ASUS ROG Strix RTX 3090 OC', price: 125000, specs: { memory: '24GB GDDR6X', length: 318, tdp: 350, pcie_slots: 2.9 } },
    { name: 'MSI Gaming Z Trio RTX 3080', price: 69999, specs: { memory: '10GB GDDR6X', length: 323, tdp: 320, pcie_slots: 2.7 } },
    { name: 'Gigabyte Vision RTX 3070 Ti', price: 52999, specs: { memory: '8GB GDDR6X', length: 320, tdp: 290, pcie_slots: 2.7 } },
    { name: 'Zotac Twin Edge RTX 3060 Ti', price: 32999, specs: { memory: '8GB GDDR6', length: 222, tdp: 200, pcie_slots: 2 } },
    { name: 'ASUS Dual RTX 3050 OC', price: 19999, specs: { memory: '8GB GDDR6', length: 200, tdp: 130, pcie_slots: 2 } },
    // NVIDIA RTX 20 Series
    { name: 'ASUS ROG Strix RTX 2080 Super', price: 45000, specs: { memory: '8GB GDDR6', length: 300, tdp: 250, pcie_slots: 2.7 } },
    { name: 'Gigabyte Windforce RTX 2070 Super', price: 35000, specs: { memory: '8GB GDDR6', length: 280, tdp: 215, pcie_slots: 2.5 } },
    { name: 'Zotac Gaming RTX 2060 Super', price: 25000, specs: { memory: '8GB GDDR6', length: 210, tdp: 175, pcie_slots: 2 } },
    { name: 'MSI Ventus RTX 2060', price: 19999, specs: { memory: '6GB GDDR6', length: 226, tdp: 160, pcie_slots: 2 } },
    // AMD RX 6000 Series
    { name: 'Sapphire Nitro+ RX 6900 XT', price: 65000, specs: { memory: '16GB GDDR6', length: 310, tdp: 300, pcie_slots: 2.7 } },
    { name: 'ASRock Phantom Gaming RX 6800 XT', price: 49999, specs: { memory: '16GB GDDR6', length: 330, tdp: 300, pcie_slots: 2.7 } },
    { name: 'PowerColor Red Devil RX 6700 XT', price: 32999, specs: { memory: '12GB GDDR6', length: 320, tdp: 230, pcie_slots: 2.5 } },
    { name: 'Sapphire Pulse RX 6600 XT', price: 22999, specs: { memory: '8GB GDDR6', length: 240, tdp: 160, pcie_slots: 2 } },
    // AMD RX 5000 Series
    { name: 'Sapphire Pulse RX 5700 XT', price: 25000, specs: { memory: '8GB GDDR6', length: 254, tdp: 225, pcie_slots: 2 } },
    { name: 'Gigabyte Gaming OC RX 5600 XT', price: 18000, specs: { memory: '6GB GDDR6', length: 280, tdp: 150, pcie_slots: 2 } },
    // Intel Arc
    { name: 'Intel Arc A770 Limited Edition', price: 28999, specs: { memory: '16GB GDDR6', length: 270, tdp: 225, pcie_slots: 2 } },
    { name: 'Intel Arc A750 Limited Edition', price: 19999, specs: { memory: '8GB GDDR6', length: 270, tdp: 225, pcie_slots: 2 } },
    { name: 'ASRock Challenger Arc A380', price: 10999, specs: { memory: '6GB GDDR6', length: 190, tdp: 75, pcie_slots: 2 } },
];

const rams = [
    { name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) 6000MHz CL30', price: 12500, specs: { memory_type: 'DDR5', speed: 6000, capacity: 32, modules: 2 } },
    { name: 'Corsair Vengeance RGB 32GB (2x16GB) 6000MHz CL36', price: 10999, specs: { memory_type: 'DDR5', speed: 6000, capacity: 32, modules: 2 } },
    { name: 'Kingston Fury Beast 16GB (2x8GB) 5200MHz', price: 6500, specs: { memory_type: 'DDR5', speed: 5200, capacity: 16, modules: 2 } },
    { name: 'Adata XPG Lancer 32GB (1x32GB) 6000MHz', price: 9500, specs: { memory_type: 'DDR5', speed: 6000, capacity: 32, modules: 1 } },
    { name: 'TeamGroup T-Force Delta RGB 32GB (2x16GB) 6000MHz', price: 11500, specs: { memory_type: 'DDR5', speed: 6000, capacity: 32, modules: 2 } },
    { name: 'G.Skill Ripjaws S5 32GB (2x16GB) 6000MHz', price: 9999, specs: { memory_type: 'DDR5', speed: 6000, capacity: 32, modules: 2 } },
    { name: 'G.Skill Ripjaws V 32GB (2x16GB) 3600MHz CL18', price: 7500, specs: { memory_type: 'DDR4', speed: 3600, capacity: 32, modules: 2 } },
    { name: 'Corsair Vengeance LPX 16GB (2x8GB) 3200MHz', price: 3999, specs: { memory_type: 'DDR4', speed: 3200, capacity: 16, modules: 2 } },
    { name: 'TeamGroup T-Force Delta RGB 16GB (2x8GB) 3600MHz', price: 4800, specs: { memory_type: 'DDR4', speed: 3600, capacity: 16, modules: 2 } },
    { name: 'Adata XPG Spectrix D50 16GB (2x8GB) 3200MHz', price: 4200, specs: { memory_type: 'DDR4', speed: 3200, capacity: 16, modules: 2 } },
    // New RAMs
    { name: 'Corsair Dominator Platinum RGB 32GB (2x16GB) 6200MHz', price: 15999, specs: { memory_type: 'DDR5', speed: 6200, capacity: 32, modules: 2 } },
    { name: 'G.Skill Trident Z Neo 32GB (2x16GB) 3600MHz', price: 9500, specs: { memory_type: 'DDR4', speed: 3600, capacity: 32, modules: 2 } },
    { name: 'Crucial Pro 32GB (2x16GB) 5600MHz', price: 8999, specs: { memory_type: 'DDR5', speed: 5600, capacity: 32, modules: 2 } },
];

const storage = [
    { name: 'Samsung 990 Pro 2TB NVMe', price: 16999, specs: { type: 'NVMe M.2', capacity: 2000, read_speed: 7450 } },
    { name: 'WD Black SN850X 2TB NVMe', price: 14999, specs: { type: 'NVMe M.2', capacity: 2000, read_speed: 7300 } },
    { name: 'Crucial T700 1TB Gen5 NVMe', price: 17999, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 11700 } },
    { name: 'Kingston KC3000 1TB NVMe', price: 8500, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 7000 } },
    { name: 'WD Blue SN580 1TB NVMe', price: 5500, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 4150 } },
    { name: 'Crucial P3 Plus 1TB NVMe', price: 5200, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 5000 } },
    { name: 'Samsung 980 500GB NVMe', price: 3999, specs: { type: 'NVMe M.2', capacity: 500, read_speed: 3500 } },
    { name: 'Seagate FireCuda 530 1TB NVMe', price: 9500, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 7300 } },
    { name: 'WD Black SN770 1TB NVMe', price: 6500, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 5150 } },
    { name: 'Adata XPG Gammix S70 Blade 1TB', price: 7200, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 7400 } },
    // New Storage
    { name: 'WD Blue SN570 500GB NVMe', price: 3200, specs: { type: 'NVMe M.2', capacity: 500, read_speed: 3500 } },
    { name: 'Seagate Barracuda Q5 500GB NVMe', price: 2999, specs: { type: 'NVMe M.2', capacity: 500, read_speed: 2400 } },
    { name: 'WD Green SN350 1TB NVMe', price: 4800, specs: { type: 'NVMe M.2', capacity: 1000, read_speed: 3200 } },
];

const psus = [
    { name: 'Corsair RM1000e 1000W ATX 3.0', price: 15500, specs: { wattage: 1000, efficiency: '80+ Gold', modular: 'Full' } },
    { name: 'MSI MPG A1000G PCIE5 1000W', price: 16500, specs: { wattage: 1000, efficiency: '80+ Gold', modular: 'Full' } },
    { name: 'Deepcool PQ1000M 1000W', price: 11999, specs: { wattage: 1000, efficiency: '80+ Gold', modular: 'Full' } },
    { name: 'Corsair RM850e 850W ATX 3.0', price: 10999, specs: { wattage: 850, efficiency: '80+ Gold', modular: 'Full' } },
    { name: 'Cooler Master MWE Gold 850 V2', price: 9500, specs: { wattage: 850, efficiency: '80+ Gold', modular: 'Full' } },
    { name: 'MSI MAG A750GL PCIE5 750W', price: 7999, specs: { wattage: 750, efficiency: '80+ Gold', modular: 'Full' } },
    { name: 'Deepcool PM750D 750W', price: 5999, specs: { wattage: 750, efficiency: '80+ Gold', modular: 'Non' } },
    { name: 'Ant Esports FP750B 750W Bronze', price: 3999, specs: { wattage: 750, efficiency: '80+ Bronze', modular: 'Non' } },
    { name: 'Gigabyte P750GM 750W Gold', price: 6500, specs: { wattage: 750, efficiency: '80+ Gold', modular: 'Full' } },
];

const cases = [
    { name: 'Lian Li O11 Dynamic Evo', price: 13999, specs: { form_factor: 'ATX', max_gpu_length: 422, max_cpu_cooler_height: 167, radiator_support: '360,280' } },
    { name: 'NZXT H9 Flow', price: 15999, specs: { form_factor: 'ATX', max_gpu_length: 435, max_cpu_cooler_height: 165, radiator_support: '360,280' } },
    { name: 'Corsair 4000D Airflow', price: 6999, specs: { form_factor: 'ATX', max_gpu_length: 360, max_cpu_cooler_height: 170, radiator_support: '360,280' } },
    { name: 'Lian Li Lancool 216', price: 7999, specs: { form_factor: 'ATX', max_gpu_length: 392, max_cpu_cooler_height: 180, radiator_support: '360,280' } },
    { name: 'Deepcool CH560 Digital', price: 8999, specs: { form_factor: 'ATX', max_gpu_length: 380, max_cpu_cooler_height: 175, radiator_support: '360' } },
    { name: 'Fractal Design North', price: 14500, specs: { form_factor: 'ATX', max_gpu_length: 355, max_cpu_cooler_height: 170, radiator_support: '360,240' } },
    { name: 'Montech Air 903 Max', price: 6500, specs: { form_factor: 'ATX', max_gpu_length: 400, max_cpu_cooler_height: 180, radiator_support: '360' } },
    { name: 'Ant Esports ICE-100', price: 3500, specs: { form_factor: 'ATX', max_gpu_length: 320, max_cpu_cooler_height: 160, radiator_support: '240' } },
    { name: 'Ant Esports ICE-511MT', price: 4500, specs: { form_factor: 'E-ATX', max_gpu_length: 360, max_cpu_cooler_height: 165, radiator_support: '360' } },
    { name: 'Ant Esports 200 Air', price: 2999, specs: { form_factor: 'ATX', max_gpu_length: 310, max_cpu_cooler_height: 160, radiator_support: '240' } },
    { name: 'Galax Revolution-05', price: 3800, specs: { form_factor: 'ATX', max_gpu_length: 330, max_cpu_cooler_height: 160, radiator_support: '240' } },
    // New Cases
    { name: 'Ant Esports ICE-110 Auto RGB', price: 3200, specs: { form_factor: 'ATX', max_gpu_length: 300, max_cpu_cooler_height: 155, radiator_support: '240' } },
    { name: 'Ant Esports SX7 Mid Tower', price: 4200, specs: { form_factor: 'ATX', max_gpu_length: 340, max_cpu_cooler_height: 160, radiator_support: '360' } },
    { name: 'Ant Esports Crystal XL', price: 6500, specs: { form_factor: 'E-ATX', max_gpu_length: 380, max_cpu_cooler_height: 170, radiator_support: '360' } },
];

const coolers = [
    { name: 'NZXT Kraken Elite 360 RGB', price: 24999, specs: { type: 'AIO Liquid', size: 360, height: 52, socket_support: 'LGA1700,AM5' } },
    { name: 'Lian Li Galahad II Trinity 360', price: 13500, specs: { type: 'AIO Liquid', size: 360, height: 52, socket_support: 'LGA1700,AM5' } },
    { name: 'Deepcool LT720 360mm', price: 10999, specs: { type: 'AIO Liquid', size: 360, height: 52, socket_support: 'LGA1700,AM5' } },
    { name: 'Arctic Liquid Freezer III 360', price: 11500, specs: { type: 'AIO Liquid', size: 360, height: 65, socket_support: 'LGA1700,AM5' } },
    { name: 'Deepcool AK620 Digital', price: 6500, specs: { type: 'Air', height: 162, socket_support: 'LGA1700,AM5' } },
    { name: 'Noctua NH-D15 chromax.black', price: 9999, specs: { type: 'Air', height: 165, socket_support: 'LGA1700,AM5' } },
    { name: 'Cooler Master Hyper 212 Halo', price: 3200, specs: { type: 'Air', height: 154, socket_support: 'LGA1700,AM5' } },
    { name: 'Deepcool AG400 ARGB', price: 1800, specs: { type: 'Air', height: 150, socket_support: 'LGA1700,AM5' } },
    { name: 'Ant Esports ICE-C612 V2', price: 2500, specs: { type: 'Air', height: 160, socket_support: 'LGA1700,AM5' } },
    // New Coolers
    { name: 'Razer Hanbo Chroma RGB 360', price: 28999, specs: { type: 'AIO Liquid', size: 360, height: 52, socket_support: 'LGA1700,AM5' } },
    { name: 'NZXT Kraken 240 RGB', price: 13999, specs: { type: 'AIO Liquid', size: 240, height: 52, socket_support: 'LGA1700,AM5' } },
    { name: 'Lian Li Galahad 240', price: 9999, specs: { type: 'AIO Liquid', size: 240, height: 52, socket_support: 'LGA1700,AM5' } },
    { name: 'Deepcool LE500 240mm', price: 5500, specs: { type: 'AIO Liquid', size: 240, height: 52, socket_support: 'LGA1700,AM5' } },
];

// Add Razer Case
cases.push({ name: 'Razer Tomahawk ATX', price: 18999, specs: { form_factor: 'ATX', max_gpu_length: 384, max_cpu_cooler_height: 176, radiator_support: '360' } });
cases.push({ name: 'Lian Li O11 Vision', price: 14500, specs: { form_factor: 'ATX', max_gpu_length: 455, max_cpu_cooler_height: 167, radiator_support: '360' } });
cases.push({ name: 'NZXT H6 Flow', price: 10999, specs: { form_factor: 'ATX', max_gpu_length: 365, max_cpu_cooler_height: 163, radiator_support: '360' } });
cases.push({ name: 'Deepcool CH510 Mesh Digital', price: 7500, specs: { form_factor: 'ATX', max_gpu_length: 380, max_cpu_cooler_height: 175, radiator_support: '360' } });

const allParts = [
    ...cpus.map(p => ({ ...p, category: 'cpu' })),
    ...mobos.map(p => ({ ...p, category: 'motherboard' })),
    ...gpus.map(p => ({ ...p, category: 'gpu' })),
    ...rams.map(p => ({ ...p, category: 'ram' })),
    ...storage.map(p => ({ ...p, category: 'storage' })),
    ...psus.map(p => ({ ...p, category: 'psu' })),
    ...cases.map(p => ({ ...p, category: 'case' })),
    ...coolers.map(p => ({ ...p, category: 'cooler' })),
];

const header = 'id,name,category,price,retailer,url,imageUrl,specs,lastUpdated';
const rows = allParts.map((p, i) => {
    const id = `${p.category}-${i}`;
    // Prefer Amazon (70% chance), otherwise random
    const retailer = Math.random() < 0.7 ? 'Amazon' : retailers[Math.floor(Math.random() * retailers.length)];
    const url = 'https://amazon.in';
    // Use placeholder images that look like the component
    const imageUrl = `https://placehold.co/200x200/1a1a1a/FFF?text=${p.category.toUpperCase()}`;
    const specs = JSON.stringify(p.specs).replace(/"/g, '""');
    const date = new Date().toISOString();
    return `${id},"${p.name}",${p.category},${p.price},${retailer},"${url}","${imageUrl}","${specs}",${date}`;
});

const csvContent = [header, ...rows].join('\n');
console.log('---CSV_START---');
console.log(csvContent);
console.log('---CSV_END---');

const outputPath = path.join(__dirname, '../../data/parts.csv');
try {
    fs.writeFileSync(outputPath, csvContent);
    console.log(`Successfully generated ${rows.length} parts`);
} catch (err) {
    console.error('Error writing file:', err);
}
