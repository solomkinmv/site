"use client";

import {useEffect, useRef, useState} from "react";
import {useTheme} from "next-themes";
import {parseTreeInput, Tree, Visualizer} from "@/app/leetcode-tree-visualizer/tree";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";

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
        <main id="main-content" tabIndex={-1} className="site-shell min-w-0 flex-1 py-12 sm:py-16">
            <p className="page-kicker mb-4">Developer tool</p>
            <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">LeetCode Tree Visualizer</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Visualize and compare binary trees from LeetCode problems. Supports large trees, long node text, and diff visualization between actual and expected answers.</p>
            <Card className="mt-10 shadow-none">
                <CardContent className="grid gap-6 sm:grid-cols-2">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="input-actual">Actual tree</Label>
                        <Input type="text"
                               id="input-actual"
                               className="h-11 font-mono"
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
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="input-expected">Expected tree</Label>
                        <Input type="text"
                               id="input-expected"
                               className="h-11 font-mono"
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
                    <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">Use comma-separated values and null for missing nodes. Leave the expected tree empty to view a single tree.</p>
                </CardContent>
            </Card>

            <p id="tree-error" role="status" className="mt-4 text-sm text-destructive">{error}</p>
            <div className="mt-4 flex w-full overflow-x-auto rounded-xl border bg-card p-6">
                <canvas id="canvas"
                    ref={canvas}
                    className="mx-auto shrink-0"
                    role="img"
                    aria-label={`Binary tree visualization. Actual: ${inputActual || 'empty'}. Expected: ${inputExpected || inputActual || 'empty'}.`}
                />
            </div>
        </main>
    );
}
