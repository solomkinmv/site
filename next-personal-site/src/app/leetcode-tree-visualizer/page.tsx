"use client";

import {useEffect, useRef, useState} from "react";
import {Tree, Visualizer} from "@/app/leetcode-tree-visualizer/tree";

export default function Page() {
    const [inputActual, setInputActual] = useState("");
    const [inputExpected, setInputExpected] = useState("");
    const canvas = useRef<HTMLCanvasElement | null>(null);

    function displayTree(inputChunksActual: string[] | undefined,
                         inputChunksExpected: string[] | undefined,
                         canvas: HTMLCanvasElement) {
        if (!inputChunksActual && !inputChunksExpected || inputChunksActual?.length === 0 && inputChunksExpected?.length === 0) {
            console.log("Nothing to draw"); // todo: clear canvas
            return;
        }
        let tree = new Tree(new Visualizer(canvas));
        tree.build(inputChunksActual, inputChunksExpected);
        tree.bfs();
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
        <>
            <input id="input-actual" placeholder="LeetCode-style input for actual tree" style={{width: 1000}} onChange={(e) => setInputActual(e.target.value)}/>
            <input id="input-expected" placeholder="LeetCode-style input for expected tree" style={{width: 1000}} onChange={(e) => setInputExpected(e.target.value)}/>
            <canvas id="canvas" ref={canvas}></canvas>
        </>
    );
}
