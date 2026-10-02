"use client";

import {useEffect, useRef, useState} from "react";
import {useTheme} from "next-themes";
import {parseTreeInput, Tree, Visualizer} from "@/app/leetcode-tree-visualizer/tree";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function Page() {
    const [inputActual, setInputActual] = useState("[1,2,3,null,5,null,4]");
    const [inputExpected, setInputExpected] = useState("");
    const [error, setError] = useState("");
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const {resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvas.current) return;
        const tree = new Tree(new Visualizer(canvas.current));
        try {
            const actual = parseTreeInput(inputActual);
            const expected = parseTreeInput(inputExpected);
            tree.build(actual, inputExpected.trim() ? expected : actual);
            setError("");
        } catch (error) {
            tree.build([], []);
            setError(error instanceof Error ? error.message : 'Unable to draw this tree.');
        }
    }, [inputActual, inputExpected, resolvedTheme, mounted]);


    return (
        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 p-6 md:p-10 flex flex-col items-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">LeetCode Tree Visualizer</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-2xl">Visualize and compare binary trees from LeetCode problems. Supports large trees, long node text, and diff visualization between actual and expected answers.</p>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input-actual">Actual tree</Label>
                <Input type="text"
                       id="input-actual"
                       name="actual-tree"
                       autoComplete="off"
                       spellCheck={false}
                       aria-describedby={error ? 'tree-error' : undefined}
                       aria-invalid={!!error}
                       placeholder="LeetCode-style input for actual tree"
                       value={inputActual}
                       onChange={(e) => setInputActual(e.target.value)}
                />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input-expected">Expected tree</Label>
                <Input type="text"
                       id="input-expected"
                       name="expected-tree"
                       autoComplete="off"
                       spellCheck={false}
                       aria-describedby={error ? 'tree-error' : undefined}
                       aria-invalid={!!error}
                       placeholder="LeetCode-style input for expected tree"
                       value={inputExpected}
                       onChange={(e) => setInputExpected(e.target.value)}
                />
            </div>

            <p id="tree-error" role="status" className="mt-2 text-destructive">{error}</p>
            <div className="w-full overflow-x-auto">
                <canvas id="canvas"
                    ref={canvas}
                    className="mt-2"
                    role="img"
                    aria-label={`Binary tree visualization. Actual: ${inputActual || 'empty'}. Expected: ${inputExpected || inputActual || 'empty'}.`}
                />
            </div>
        </main>
    );
}
