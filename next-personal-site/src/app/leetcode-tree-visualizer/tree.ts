export function parseTreeInput(input: string): string[] {
    if (input.length > 100_000) throw new Error('Use a smaller tree (at most 100,000 input characters).');
    const value = input.trim();
    if (!value) return [];
    if (value.startsWith('[') !== value.endsWith(']')) {
        throw new Error('Use matching square brackets, for example [1,2,3,null,4].');
    }
    const content = value.startsWith('[') ? value.slice(1, -1).trim() : value;
    if (!content) return [];
    const chunks = content.split(',').map(chunk => chunk.trim());
    if (chunks.length > 5_000) throw new Error('Use a smaller tree (at most 5,000 values per input).');
    if (chunks.some(chunk => !chunk || /[\[\]]/.test(chunk))) {
        throw new Error('Separate node values with commas and use null for missing nodes.');
    }
    while (chunks.at(-1) === 'null') chunks.pop();
    let slots = 1;
    for (const chunk of chunks) {
        if (slots === 0) throw new Error('A node has no parent. Remove values after the tree ends.');
        slots += chunk === 'null' ? -1 : 1;
    }
    return chunks;
}

export class Visualizer {
    private static readonly BASE_TEXT_SIZE: number = 16;
    private static readonly BASE_LINE_WIDTH: number = 1;
    private static readonly BASE_PADDING: number = 2;

    private readonly textScale: number = 2;
    private readonly textSize: number = Visualizer.BASE_TEXT_SIZE * this.textScale;
    public readonly radius: number = this.textSize + Visualizer.BASE_PADDING * 2;
    public readonly initialVerticalSpacing: number = this.radius + Visualizer.BASE_PADDING;
    public readonly verticalSpacing: number = this.radius * 2 + this.textSize;
    public readonly qualityScale: number = 2;
    private readonly lineWidth: number = Visualizer.BASE_LINE_WIDTH * this.textScale;

    private ctx?: CanvasRenderingContext2D;
    private foregroundColor: string;
    private errorColor: string;
    private successColor: string;

    private readonly c: HTMLCanvasElement;

    constructor(c: HTMLCanvasElement) {
        this.c = c;
        const styles = getComputedStyle(document.documentElement);
        this.foregroundColor = `hsl(${styles.getPropertyValue('--foreground').trim()})`;
        this.errorColor = `hsl(${styles.getPropertyValue('--destructive').trim()})`;
        this.successColor = styles.getPropertyValue('--chart-2').trim()
            ? `hsl(${styles.getPropertyValue('--chart-2').trim()})`
            : "#22c55e";
    }

    resizeHeight(heightNodes: number) {
        const actualHeight = heightNodes * (3 * Visualizer.BASE_TEXT_SIZE + 4 * Visualizer.BASE_PADDING) +
            Visualizer.BASE_TEXT_SIZE + 3 * Visualizer.BASE_PADDING;

        this.resize(1, actualHeight);
    }

    resizeWidth(width: number) {
        if (this.c.width == width) return;

        this.resize(width + Visualizer.BASE_PADDING, this.c.height / this.qualityScale);
    }

    resize(width: number, height: number) {
        const pixelsWide = Math.ceil(width * this.qualityScale);
        const pixelsHigh = Math.ceil(height * this.qualityScale);
        // ponytail: portable canvas budget; tile the drawing if larger trees become necessary.
        if (!Number.isFinite(width) || !Number.isFinite(height) || width < 0 || height < 0 ||
            pixelsWide > 16_384 || pixelsHigh > 16_384 || pixelsWide * pixelsHigh > 16_000_000) {
            throw new Error('This drawing exceeds the canvas size limit. Use fewer nodes or shorter labels.');
        }
        this.c.setAttribute("style", `width: ${width}px; height: ${height}px;`);
        this.c.height = pixelsHigh;
        this.c.width = pixelsWide;
        this.ctx = undefined;
        if (!width || !height) return;

        this.ctx = this.c.getContext("2d") ?? undefined;
        if (!this.ctx) throw new Error('Canvas drawing is unavailable in this browser.');
        this.ctx.font = `${this.textSize}px arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }

    drawNode(node: TreeNode) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        let {x, y} = node.position
        const singleText = node.valueActual === node.valueExpected;
        let actualTextWidth = this.getWidth(node.valueActual);
        let expectedTextWidth = singleText ? 0 : this.getWidth(node.valueExpected);

        let totalWidth = actualTextWidth + expectedTextWidth;

        this.ctx.fillStyle = this.foregroundColor;
        this.ctx.strokeStyle = this.foregroundColor;

        if (node.valueActual === node.valueExpected) {
            this.ctx.fillText(node.valueActual!, x, y);
        } else if (!node.valueExpected) {
            this.ctx.fillStyle = this.errorColor;
            this.ctx.fillText(node.valueActual!, x, y);
            this.ctx.fillStyle = this.foregroundColor;
        } else if (!node.valueActual) {
            this.ctx.fillStyle = this.successColor;
            this.ctx.fillText(node.valueExpected, x, y);
            this.ctx.fillStyle = this.foregroundColor;
        } else {

            const actualX = x - expectedTextWidth / 2 - Visualizer.BASE_PADDING;
            const expectedX = x + actualTextWidth / 2 + Visualizer.BASE_PADDING;
            this.ctx.fillStyle = this.errorColor;
            this.ctx.fillText(node.valueActual, actualX, y);
            this.ctx.fillStyle = this.successColor;
            this.ctx.fillText(node.valueExpected, expectedX, y);
            this.ctx.fillStyle = this.foregroundColor;
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
        const singleText = node.valueActual === node.valueExpected;
        if (singleText) {
            return this.getWidth(node.valueActual);
        }
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

    private readonly visualizer: Visualizer;

    constructor(visualizer: Visualizer) {
        this.visualizer = visualizer;
    }

    public build(chunksActual: string[] | undefined, chunksExpected: string[] | undefined) {
        if ((chunksActual?.length ?? 0) > 5_000 || (chunksExpected?.length ?? 0) > 5_000) {
            throw new Error('Use a smaller tree (at most 5,000 values per input).');
        }
        if (!chunksActual?.length && !chunksExpected?.length) {
            this.root = undefined;
            this.visualizer.resize(0, 0);
            return;
        }
        this.root = new TreeNode(chunksActual?.[0], undefined);
        let actualNodes = [this.root];
        for (let i = 1, api = 0; i < (chunksActual?.length || 0); i += 2, api++) {
            // actual
            let parent = actualNodes[api];
            if (!parent) throw new Error('An actual node has no parent.');
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
            if (!parent) throw new Error('An expected node has no parent.');
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

        this.visualizer.resizeHeight(this.findDepth(this.root));
        this.reposition();
        this.visualizer.resizeWidth(this.findWidth(this.root));
        this.breadthFirstDraw();
    }

    private findDepth(node: TreeNode | undefined): number {
        if (!node) return 0;
        const queue = [{node, depth: 1}];
        let depth = 0;
        for (let i = 0; i < queue.length; i++) {
            const current = queue[i];
            depth = Math.max(depth, current.depth);
            // ponytail: bound recursive layout to 128 levels; use iterative layout for deeper trees.
            if (depth > 128) throw new Error('Use a shallower tree (at most 128 levels).');
            if (current.node.left) queue.push({node: current.node.left, depth: current.depth + 1});
            if (current.node.right) queue.push({node: current.node.right, depth: current.depth + 1});
        }
        return depth;
    }

    private findWidth(node: TreeNode | undefined): number {
        if (!node) return 0;
        const currentWidth = (node.position.x + this.visualizer.getOuterWidth(node) / 2.) / this.visualizer.qualityScale
        return Math.max(currentWidth, this.findWidth(node.left), this.findWidth(node.right));
    }

    private breadthFirstDraw() {
        if (!this.root) return;

        let queue: TreeNode[] = [];
        queue.push(this.root)

        for (let i = 0; i < queue.length; i++) {
            let node = queue[i];
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
