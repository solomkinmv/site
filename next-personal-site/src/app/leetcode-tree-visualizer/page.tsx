"use client";

import {useEffect, useRef, useState} from "react";
import {useTheme} from "next-themes";
import {Tree, Visualizer} from "@/app/leetcode-tree-visualizer/tree";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function Page() {
    const [inputActual, setInputActual] = useState("[1,2,3,null,5,null,4]");
    const [inputExpected, setInputExpected] = useState("");
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const {resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function displayTree(inputChunksActual: string[] | undefined,
                         inputChunksExpected: string[] | undefined,
                         canvas: HTMLCanvasElement) {
        if (!inputChunksActual && !inputChunksExpected || inputChunksActual?.length === 0 && inputChunksExpected?.length === 0) {
            console.log("Nothing to draw"); // todo: clear canvas
            return;
        }
        let tree = new Tree(new Visualizer(canvas));
        const noExpected = !inputChunksExpected || inputChunksExpected.length === 0;
        tree.build(inputChunksActual, noExpected ? inputChunksActual : inputChunksExpected);
    }

    function parseInput(stringValue: string): string[] | undefined {
        if (!stringValue) {
            console.log("Incorrect input " + stringValue)
            return;
        }
        // todo: add more validation
        if (stringValue[0] === "[") {
            stringValue = stringValue.slice(1);
        }
        if (stringValue[stringValue.length - 1] === "]") {
            stringValue = stringValue.slice(0, -1);
        }
        return stringValue.split(",").map(v => v.trim()).filter(s => s.length > 0);
    }

    useEffect(() => {
        if (!mounted) return;
        displayTree(parseInput(inputActual), parseInput(inputExpected), canvas.current!);
    }, [inputActual, inputExpected, resolvedTheme, mounted]);


    return (
        <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input-actual">Actual tree</Label>
                <Input type="text"
                       id="input-actual"
                       placeholder="LeetCode-style input for actual tree"
                       value={inputActual}
                       onChange={(e) => setInputActual(e.target.value)}
                />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input-expected">Expected tree</Label>
                <Input type="text"
                       id="input-expected"
                       placeholder="LeetCode-style input for expected tree"
                       value={inputExpected}
                       onChange={(e) => setInputExpected(e.target.value)}
                />
            </div>

            <canvas id="canvas"
                    ref={canvas}
                    className="mt-2"
            />
        </main>
    );
}
