import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface Part {
    id: string;
    name: string;
    imageUrl?: string;
}

function DraggablePart({ part }: { part: Part }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: part.id,
        data: part,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 mb-2 bg-neutral-800 rounded hover:bg-neutral-700 cursor-grab active:cursor-grabbing flex items-center gap-3"
        >
            {part.imageUrl && (
                <img src={part.imageUrl} alt={part.name} className="w-12 h-12 object-contain bg-white rounded p-1" />
            )}
            <div className="text-sm font-medium">{part.name}</div>
        </div>
    );
}

export function PartPalette({ parts }: { parts: any[] }) {
    return (
        <div className="space-y-4">
            {/* Group by category logic here */}
            {parts.map(part => (
                <DraggablePart key={part.id} part={part} />
            ))}
        </div>
    );
}
