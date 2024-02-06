"use client";

import {useEffect, useRef, useState} from "react";
import {Tree, Visualizer} from "@/app/leetcode-tree-visualizer/tree";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export default function Page() {
    const [inputActual, setInputActual] = useState("[1,2,3,null,5,null,4]");
    const [inputExpected, setInputExpected] = useState("[1,2,3,null,5,null,4]");
    const canvas = useRef<HTMLCanvasElement | null>(null);

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
        if (!stringValue || stringValue[0] !== "[" || stringValue[stringValue.length - 1] !== "]") {
            console.log("Incorrect input " + stringValue)
            return;
        }
        // todo: add more validation
        return stringValue.slice(1, -1).split(",").map(v => v.trim()).filter(s => s.length > 0);
    }

    useEffect(() => {
        displayTree(parseInput(inputActual), parseInput(inputExpected), canvas.current!);
    }, [inputActual, inputExpected]);


    return (
        <main className="flex-1 p-6 md:p-10">
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
