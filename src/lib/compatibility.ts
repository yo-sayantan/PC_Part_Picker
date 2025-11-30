import { PartSpecs } from '@/lib/data';

export interface BuildState {
    cpu?: { id: string; name: string; specs: PartSpecs; imageUrl?: string };
    motherboard?: { id: string; name: string; specs: PartSpecs; imageUrl?: string };
    ram?: { id: string; name: string; specs: PartSpecs; imageUrl?: string }[];
    gpu?: { id: string; name: string; specs: PartSpecs; imageUrl?: string }[];
    storage?: { id: string; name: string; specs: PartSpecs; imageUrl?: string }[];
    psu?: { id: string; name: string; specs: PartSpecs; imageUrl?: string };
    case?: { id: string; name: string; specs: PartSpecs; imageUrl?: string };
    cooler?: { id: string; name: string; specs: PartSpecs; imageUrl?: string };
}

export interface CompatibilityResult {
    valid: boolean;
    messages: { type: 'error' | 'warning' | 'info'; text: string }[];
    estimatedWattage: number;
}

export function checkCompatibility(build: BuildState): CompatibilityResult {
    const messages: CompatibilityResult['messages'] = [];
    let estimatedWattage = 0;

    // 1. Wattage Calculation
    if (build.cpu?.specs.tdp) estimatedWattage += build.cpu.specs.tdp;
    if (build.gpu) {
        build.gpu.forEach(g => {
            if (g.specs.tdp) estimatedWattage += g.specs.tdp;
        });
    }
    // Add buffer for other components
    estimatedWattage += 50; // Mobo, RAM, Fans, Storage

    // 2. PSU Check
    if (build.psu?.specs.wattage) {
        const psuWattage = build.psu.specs.wattage;
        const loadPercentage = (estimatedWattage / psuWattage) * 100;

        if (estimatedWattage > psuWattage) {
            messages.push({ type: 'error', text: `Estimated wattage (${estimatedWattage}W) exceeds PSU capacity (${psuWattage}W).` });
        } else if (loadPercentage > 90) {
            messages.push({ type: 'warning', text: `PSU load is high (${loadPercentage.toFixed(1)}%). Consider upgrading for efficiency.` });
        } else if (loadPercentage < 50) {
            messages.push({ type: 'info', text: `PSU is oversized (Load: ${loadPercentage.toFixed(1)}%). You might save money with a lower wattage unit.` });
        }
    }

    // 3. Socket Compatibility
    if (build.cpu && build.motherboard) {
        if (build.cpu.specs.socket !== build.motherboard.specs.socket) {
            messages.push({
                type: 'error',
                text: `Incompatible Socket: CPU is ${build.cpu.specs.socket} but Motherboard is ${build.motherboard.specs.socket}.`
            });
        }
    }

    // 4. RAM Compatibility
    if (build.ram && build.motherboard) {
        const moboRamType = build.motherboard.specs.memory_type;
        build.ram.forEach(stick => {
            if (stick.specs.memory_type !== moboRamType) {
                messages.push({
                    type: 'error',
                    text: `Incompatible RAM: Motherboard requires ${moboRamType} but selected RAM is ${stick.specs.memory_type}.`
                });
            }
        });
    }

    // 5. Physical Constraints - GPU Length
    if (build.case && build.gpu) {
        const maxLen = build.case.specs.max_gpu_length || 999;
        build.gpu.forEach(g => {
            if (g.specs.length && g.specs.length > maxLen) {
                messages.push({
                    type: 'error',
                    text: `GPU ${g.name} (${g.specs.length}mm) is too long for Case ${build.case?.name} (Max: ${maxLen}mm).`
                });
            }
        });
    }

    // 6. Physical Constraints - AIO Support
    if (build.case && build.cooler && build.cooler.specs.radiator_support) {
        // This is a simplified check. Real logic needs to check specific mounting points (front/top).
        // Assuming cooler.specs.size is like 360, 240
        // And case.specs.radiator_support is like { front: [360, 280], top: [240] }

        // Implementation omitted for brevity, but this is where it would go.
    }

    return {
        valid: messages.filter(m => m.type === 'error').length === 0,
        messages,
        estimatedWattage
    };
}

export function isPartCompatible(part: any, build: BuildState): { compatible: boolean; reason?: string } {
    // 1. CPU <-> Motherboard Socket
    if (part.category === 'cpu' && build.motherboard) {
        if (part.specs?.socket !== build.motherboard.specs?.socket) {
            return { compatible: false, reason: `Incompatible socket: CPU is ${part.specs?.socket}, Mobo is ${build.motherboard.specs?.socket}` };
        }
    }
    if (part.category === 'motherboard' && build.cpu) {
        if (part.specs?.socket !== build.cpu.specs?.socket) {
            return { compatible: false, reason: `Incompatible socket: Mobo is ${part.specs?.socket}, CPU is ${build.cpu.specs?.socket}` };
        }
    }

    // 2. RAM <-> Motherboard Type
    if (part.category === 'ram' && build.motherboard) {
        if (part.specs?.memory_type !== build.motherboard.specs?.memory_type) {
            return { compatible: false, reason: `Incompatible memory: RAM is ${part.specs?.memory_type}, Mobo needs ${build.motherboard.specs?.memory_type}` };
        }
    }
    if (part.category === 'motherboard' && build.ram && build.ram.length > 0) {
        const ramType = (build.ram[0] as any).specs?.memory_type;
        if (part.specs?.memory_type !== ramType) {
            return { compatible: false, reason: `Incompatible memory: Mobo needs ${part.specs?.memory_type}, RAM is ${ramType}` };
        }
    }

    // 3. Case Constraints
    if (build.case) {
        // GPU Length
        if (part.category === 'gpu') {
            const maxLen = build.case.specs?.max_gpu_length || 999;
            if ((part.specs?.length || 0) > maxLen) {
                return { compatible: false, reason: `GPU too long: ${part.specs?.length}mm > ${maxLen}mm` };
            }
        }
        // Cooler Height
        if (part.category === 'cooler') {
            const maxHeight = build.case.specs?.max_cpu_cooler_height || 999;
            if ((part.specs?.height || 0) > maxHeight) {
                return { compatible: false, reason: `Cooler too tall: ${part.specs?.height}mm > ${maxHeight}mm` };
            }
        }
    }

    // Reverse Case Constraints (if adding a case)
    if (part.category === 'case') {
        if (build.gpu && build.gpu.length > 0) {
            const maxLen = part.specs?.max_gpu_length || 999;
            for (const gpu of build.gpu) {
                if ((gpu.specs?.length || 0) > maxLen) {
                    return { compatible: false, reason: `Case too small for GPU: Max ${maxLen}mm < ${gpu.specs?.length}mm` };
                }
            }
        }
        if (build.cooler) {
            const maxHeight = part.specs?.max_cpu_cooler_height || 999;
            if ((build.cooler.specs?.height || 0) > maxHeight) {
                return { compatible: false, reason: `Case too small for Cooler: Max ${maxHeight}mm < ${build.cooler.specs?.height}mm` };
            }
        }
    }

    return { compatible: true };
}
