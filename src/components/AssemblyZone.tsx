import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BuildState } from '@/lib/compatibility';

function DropZone({ id, children, className }: { id: string, children?: React.ReactNode, className?: string }) {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    const style = {
        borderColor: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={`border-2 border-dashed border-neutral-700 rounded-lg transition-colors ${className}`}>
            {children}
        </div>
    );
}

export function AssemblyZone({ build }: { build: BuildState }) {
    return (
        <div className="w-full h-full p-8 relative">
            {/* Case Layer */}
            <DropZone id="case-zone" className="w-[600px] h-[700px] mx-auto relative bg-neutral-900/50">
                <div className="absolute top-4 left-4 text-neutral-500">PC Case</div>

                {build.case && (
                    <img src={build.case.imageUrl || ''} className="w-full h-full object-contain opacity-50" />
                )}

                {/* Motherboard Layer - Only visible if Case is present or just always visible for MVP */}
                <DropZone id="mobo-zone" className="absolute top-[50px] left-[50px] w-[400px] h-[500px] border-blue-500/30">
                    <div className="absolute top-2 left-2 text-xs text-blue-500">Motherboard</div>
                    {build.motherboard && (
                        <img src={build.motherboard.imageUrl || ''} className="w-full h-full object-contain" />
                    )}

                    {/* CPU Socket */}
                    <DropZone id="cpu-zone" className="absolute top-[100px] left-[150px] w-[80px] h-[80px] border-red-500/30">
                        {build.cpu && <img src={build.cpu.imageUrl || ''} className="w-full h-full object-cover" />}
                    </DropZone>

                    {/* GPU Slot */}
                    <DropZone id="gpu-zone" className="absolute top-[300px] left-[50px] w-[300px] h-[100px] border-green-500/30">
                        {build.gpu && build.gpu.map((g, i) => (
                            <img key={i} src={g.imageUrl || ''} className="absolute w-full h-full object-contain" style={{ top: i * 10 }} />
                        ))}
                    </DropZone>
                </DropZone>
            </DropZone>
        </div>
    );
}
