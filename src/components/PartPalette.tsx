import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BuildState, isPartCompatible } from '@/lib/compatibility';

interface Part {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string;
    specs?: any;
}

function DraggablePart({ part, build }: { part: Part, build: BuildState }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: part.id,
        data: part,
        disabled: false // We allow dragging even if incompatible, but show visual feedback
    });

    const { compatible, reason } = isPartCompatible(part, build);

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
        p-3 mb-2 rounded flex items-center gap-3 transition-all group relative
        ${compatible
                    ? 'bg-neutral-800 hover:bg-neutral-700 cursor-grab active:cursor-grabbing'
                    : 'bg-neutral-900/50 opacity-60 grayscale cursor-not-allowed border border-red-900/30'}
      `}
        >
            {part.imageUrl && (
                <img src={part.imageUrl} alt={part.name} className="w-12 h-12 object-contain bg-white rounded p-1" />
            )}
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{part.name}</div>
                <div className="text-xs text-green-400 font-bold">₹{part.price.toLocaleString('en-IN')}</div>
            </div>

            {!compatible && (
                <div className="absolute left-full top-0 ml-2 z-50 w-48 p-2 bg-red-900 text-white text-xs rounded shadow-xl hidden group-hover:block pointer-events-none">
                    {reason}
                </div>
            )}
        </div>
    );
}

export function PartPalette({ parts, build }: { parts: Part[], build: BuildState }) {
    const categories = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case', 'cooler'];

    return (
        <div className="space-y-6">
            {categories.map(category => {
                const categoryParts = parts.filter(p => p.category.toLowerCase() === category);
                if (categoryParts.length === 0) return null;

                return (
                    <div key={category} className="space-y-2">
                        <h3 className="text-sm font-bold uppercase text-neutral-400">{category}</h3>
                        {categoryParts.map(part => (
                            <DraggablePart key={part.id} part={part} build={build} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
