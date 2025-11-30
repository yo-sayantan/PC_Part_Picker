"use client";

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { PartPalette } from './PartPalette';
import { AssemblyZone } from './AssemblyZone';
import { StatsPanel } from './StatsPanel';
import { BuildState, checkCompatibility } from '@/lib/compatibility';

export default function BuilderWorkspace() {
    const [build, setBuild] = useState<BuildState>({});
    const [activeId, setActiveId] = useState<string | null>(null);
    const [parts, setParts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //Load parts from API
        fetch('/api/parts')
            .then(res => res.json())
            .then(data => {
                setParts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load parts:', err);
                setLoading(false);
            });
    }, []);

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

        if (over && over.id) {
            const part = parts.find(p => p.id === active.id);
            if (!part) return;

            const category = part.category.toLowerCase();
            const dropZoneId = over.id.toString();

            // Validate drop zone accepts this category
            if (!dropZoneId.includes(category)) {
                console.log('Invalid drop zone for', category);
                return;
            }

            // Extract slot index if present
            const slotMatch = dropZoneId.match(/-(\d+)$/);
            const slotIndex = slotMatch ? parseInt(slotMatch[1]) : 0;

            setBuild(prev => {
                const newBuild = { ...prev } as any;

                // Arrays for multiple items (with specific slots)
                if (category === 'ram' || category === 'storage') {
                    const currentArray = newBuild[category] || [];
                    // Insert at specific slot index
                    const newArray = [...currentArray];
                    newArray[slotIndex] = part;
                    newBuild[category] = newArray;
                } else if (category === 'gpu') {
                    const currentArray = newBuild[category] || [];
                    const newArray = [...currentArray];
                    newArray[slotIndex] = part;
                    newBuild[category] = newArray.filter(Boolean); //Remove empty slots
                } else {
                    // Single items
                    newBuild[category] = part;
                }

                return newBuild;
            });
        }
    };

    const handleRemove = (category: string, index?: number) => {
        setBuild(prev => {
            const newBuild = { ...prev } as any;

            if (index !== undefined && Array.isArray(newBuild[category])) {
                // Remove from specific slot
                const newArray = [...newBuild[category]];
                newArray.splice(index, 1);
                newBuild[category] = newArray.length > 0 ? newArray : undefined;
            } else {
                // Remove single item
                delete newBuild[category];
            }

            return newBuild;
        });
    };

    const compatibility = checkCompatibility(build);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-neutral-900 text-white">
                <div className="text-2xl">Loading parts...</div>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen bg-neutral-900 text-white overflow-hidden">
                <div className="w-1/4 border-r border-neutral-800 p-4 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Components</h2>
                    <PartPalette parts={parts} build={build} />
                </div>

                <div className="flex-1 relative bg-neutral-950 flex items-start justify-center overflow-y-auto">
                    <AssemblyZone build={build} onRemove={handleRemove} />
                </div>

                <div className="w-1/4 border-l border-neutral-800 p-4 overflow-y-auto">
                    <StatsPanel build={build} compatibility={compatibility} />
                </div>
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="p-2 bg-neutral-800 rounded shadow-xl border border-neutral-700">
                        Dragging...
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
