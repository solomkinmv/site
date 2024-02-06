export class Visualizer {
    private static readonly BASE_TEXT_SIZE: number = 16;
    private static readonly BASE_LINE_WIDTH: number = 1;
    private static readonly BASE_PADDING: number = 2;

    private readonly textScale: number = 2;
    private readonly textSize: number = Visualizer.BASE_TEXT_SIZE * this.textScale;
    public readonly radius: number = this.textSize + Visualizer.BASE_PADDING * 2;
    public readonly initialVerticalSpacing: number = this.radius + Visualizer.BASE_PADDING;
    public readonly verticalSpacing: number = this.radius * 2 + this.textSize;
    private readonly qualityScale: number = 2;
    private readonly lineWidth: number = Visualizer.BASE_LINE_WIDTH * this.textScale;

    private ctx?: CanvasRenderingContext2D;

    constructor(private readonly c: HTMLCanvasElement) {
    }

    resize(heightNodes: number) {
        const actualHeight = heightNodes * (3 * Visualizer.BASE_TEXT_SIZE + 4 * Visualizer.BASE_PADDING) +
            Visualizer.BASE_TEXT_SIZE + 3 * Visualizer.BASE_PADDING;
        console.log("resize", heightNodes, actualHeight);
        this.c.setAttribute("style", `width: ${innerWidth}px; height: ${actualHeight}px;`);
        this.c.height = actualHeight * this.qualityScale;
        this.c.width = innerWidth * this.qualityScale;

        this.ctx = this.c.getContext("2d")!;
        this.ctx.font = `${this.textSize}px arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.clearRect(0, 0, this.c.width, actualHeight);
    }

    drawNode(node: TreeNode) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        let {x, y} = node.position
        const singleText = node.valueActual === node.valueExpected;
        let actualTextWidth = this.getWidth(node.valueActual);
        let expectedTextWidth = singleText ? 0 : this.getWidth(node.valueExpected);
        console.log("width", actualTextWidth, expectedTextWidth, node.valueActual, node.valueExpected);
        let totalWidth = actualTextWidth + expectedTextWidth;

        if (node.valueActual === node.valueExpected) {
            this.ctx.fillText(node.valueActual!, x, y);
        } else if (!node.valueExpected) {
            this.ctx.fillStyle = "red";
            this.ctx.fillText(node.valueActual!, x, y);
            this.ctx.fillStyle = "black";
        } else if (!node.valueActual) {
            this.ctx.fillStyle = "green";
            this.ctx.fillText(node.valueExpected, x, y);
            this.ctx.fillStyle = "black";
        } else {
            console.log("draw dif", node);
            const actualX = x - expectedTextWidth / 2 - Visualizer.BASE_PADDING;
            const expectedX = x + actualTextWidth / 2 + Visualizer.BASE_PADDING;
            this.ctx.fillStyle = "red";
            this.ctx.fillText(node.valueActual, actualX, y);
            this.ctx.fillStyle = "green";
            this.ctx.fillText(node.valueExpected, expectedX, y);
            this.ctx.fillStyle = "black";
            totalWidth += 4;
        }

        const circle = this.textSize * 2;
        if (totalWidth <= circle) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
            this.ctx.stroke();
        } else {
            let additionalShift = (totalWidth - circle) / 2.;
            this.ctx.beginPath();
            this.ctx.arc(x - additionalShift, y, this.radius, Math.PI / 2, Math.PI * 3 / 2);
            this.ctx.lineTo(x + additionalShift, y - this.radius);
            this.ctx.arc(x + additionalShift, y, this.radius, -Math.PI / 2, -Math.PI * 3 / 2);
            this.ctx.lineTo(x - additionalShift, y + this.radius);
            this.ctx.stroke();
        }
    }

    private getWidth(value: string | undefined) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }
        return value ? this.ctx.measureText(value).width : 0;
    }

    private getInnerWidth(node: TreeNode) {
        return this.getWidth(node.valueActual) + this.getWidth(node.valueExpected);
    }

    getOuterWidth(node: TreeNode) {
        return Math.max(this.radius * 2, this.getInnerWidth(node) + Visualizer.BASE_PADDING);
    }

    drawNodeLink(parent: TreeNode, child: TreeNode) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        let {x: x1, y: y1} = parent.position
        let {x: x2, y: y2} = child.position;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1 + this.radius);
        this.ctx.lineTo(x2, y2 - this.radius)
        this.ctx.stroke();
    }
}

export class TreeNode {
    valueActual: string | undefined;
    valueExpected: string | undefined;

    left: TreeNode | undefined;
    right: TreeNode | undefined;
    position: { x: number; y: number };

    constructor(valueActual: string | undefined, valueExpected: string | undefined) {
        this.valueActual = valueActual
        this.valueExpected = valueExpected;
        this.position = {x: 0, y: 0}
    }
}

export class Tree {
    private root: TreeNode | undefined;

    constructor(private readonly visualizer: Visualizer) {
        this.visualizer = visualizer;
    }

    public build(chunksActual: string[] | undefined, chunksExpected: string[] | undefined) {
        this.root = new TreeNode(chunksActual?.[0], undefined);
        let actualNodes = [this.root];
        for (let i = 1, api = 0; i < (chunksActual?.length || 0); i += 2, api++) {
            // actual
            let parent = actualNodes[api];
            if (chunksActual?.[i] !== "null") {
                let leftNode = new TreeNode(chunksActual?.[i], undefined);
                parent.left = leftNode;
                actualNodes.push(leftNode);
            }
            if (i + 1 === chunksActual?.length || chunksActual?.[i + 1] === "null") continue;
            let rightNode = new TreeNode(chunksActual?.[i + 1], undefined);
            parent.right = rightNode;
            actualNodes.push(rightNode);
        }

        this.root.valueExpected = chunksExpected?.[0];
        let expectedNodes = [this.root];
        for (let i = 1, pi = 0; i < (chunksExpected?.length || 0); i += 2, pi++) {
            let parent = expectedNodes[pi];
            if (chunksExpected?.[i] !== "null") {
                let leftNode = parent.left;
                if (leftNode) {
                    leftNode.valueExpected = chunksExpected?.[i];
                } else {
                    leftNode = new TreeNode(undefined, chunksExpected?.[i]);
                    parent.left = leftNode;
                }
                expectedNodes.push(leftNode);
            }
            if (i + 1 === chunksExpected?.length || chunksExpected?.[i + 1] === "null") continue;
            let rightNode = parent.right;
            if (rightNode) {
                rightNode.valueExpected = chunksExpected?.[i + 1];
            } else {
                rightNode = new TreeNode(undefined, chunksExpected?.[i + 1]);
                parent.right = rightNode;
            }
            expectedNodes.push(rightNode);
        }

        this.visualizer.resize(this.findDepth(this.root));
        this.reposition();
        this.breadthFirstDraw();
    }

    private findDepth(node: TreeNode | undefined): number {
        if (!node) return 0;
        return 1 + Math.max(this.findDepth(node.left), this.findDepth(node.right));
    }

    private breadthFirstDraw() {
        if (!this.root) return;

        let queue: TreeNode[] = [];
        queue.push(this.root)

        while (queue.length !== 0) {
            let node = queue.shift()!
            this.visualizer.drawNode(node);

            if (node.left) {
                this.visualizer.drawNodeLink(node, node.left)
                queue.push(node.left)
            }
            if (node.right) {
                this.visualizer.drawNodeLink(node, node.right)
                queue.push(node.right)
            }
        }
    }


    private reposition() {
        this.fillPositions(this.root, 0, [], true);
    }

    private fillPositions(node: TreeNode | undefined, h: number, hToRightmostX: number[], leanLeft: boolean) {
        if (!node) return;
        hToRightmostX[h] = Math.max(hToRightmostX[h] || 0, (hToRightmostX[h - 1] || 0) + (leanLeft ? -this.visualizer.radius / 2 : this.visualizer.radius / 2));
        let left = this.fillPositions(node.left, h + 1, hToRightmostX, true);
        let right = this.fillPositions(node.right, h + 1, hToRightmostX, false);
        node.position.y = h * this.visualizer.verticalSpacing + this.visualizer.initialVerticalSpacing;
        let horizontalShift = this.visualizer.getOuterWidth(node) / 2;
        if (!left && !right) {
            node.position.x = Math.max((hToRightmostX[h] || 0) + horizontalShift + this.visualizer.radius / 2);
        } else if (left && right) {
            node.position.x = (node.left!.position.x + node.right!.position.x) / 2;
        } else if (left && !right) {
            node.position.x = node.left!.position.x + this.visualizer.radius / 2;
        } else if (!left && right) {
            node.position.x = hToRightmostX[h] + this.visualizer.radius + this.visualizer.radius / 2;
            node.position.x = (node.position.x + right.position.x - this.visualizer.radius / 2) / 2;
        }
        hToRightmostX[h] = node.position.x + horizontalShift;
        return node;
    }
}
