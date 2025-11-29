"use client";

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { PartPalette } from './PartPalette';
import { AssemblyZone } from './AssemblyZone';
import { StatsPanel } from './StatsPanel';
import { BuildState, checkCompatibility } from '@/lib/compatibility';
import { Part } from '@prisma/client'; // Assuming types are generated

// Mock data for now until API is ready
const MOCK_PARTS = [
    { id: 'cpu-1', name: 'Intel Core i9-14900K', categoryId: 'cpu', imageUrl: 'https://m.media-amazon.com/images/I/61p6cM8i4ZL._AC_SL1000_.jpg', specs: '{"socket": "LGA1700", "tdp": 125}' },
    { id: 'gpu-1', name: 'RTX 4090', categoryId: 'gpu', imageUrl: 'https://m.media-amazon.com/images/I/81IcsvE1JFL._AC_SL1500_.jpg', specs: '{"length": 357, "tdp": 450}' },
    // ... more mock parts
];

export default function BuilderWorkspace() {
    const [build, setBuild] = useState<BuildState>({});
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over) {
            // Logic to add part to build
            // This needs to map active.id to a real part object
            const part = MOCK_PARTS.find(p => p.id === active.id);
            if (part) {
                // Parse specs safely
                const specs = JSON.parse(part.specs);
                const partWithSpecs = { ...part, specs };

                // Determine category from part data or drop zone
                // For simplicity, using categoryId from part
                const category = part.categoryId.toLowerCase();

                setBuild(prev => {
                    const newBuild = { ...prev };
                    if (category === 'ram' || category === 'gpu' || category === 'storage') {
                        // Arrays
                        // @ts-ignore
                        newBuild[category] = [...(newBuild[category] || []), partWithSpecs];
                    } else {
                        // Single items
                        // @ts-ignore
                        newBuild[category] = partWithSpecs;
                    }
                    return newBuild;
                });
            }
        }
    };

    const compatibility = checkCompatibility(build);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen bg-neutral-900 text-white overflow-hidden">
                {/* Left: Part Palette */}
                <div className="w-1/4 border-r border-neutral-800 p-4 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Components</h2>
                    <PartPalette parts={MOCK_PARTS} />
                </div>

                {/* Center: Assembly Zone */}
                <div className="flex-1 relative bg-neutral-950 flex items-center justify-center">
                    <AssemblyZone build={build} />
                </div>

                {/* Right: Stats Panel */}
                <div className="w-1/4 border-l border-neutral-800 p-4 overflow-y-auto">
                    <StatsPanel build={build} compatibility={compatibility} />
                </div>
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="p-2 bg-neutral-800 rounded shadow-xl border border-neutral-700">
                        {/* Render a preview of the dragging item */}
                        Dragging...
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
