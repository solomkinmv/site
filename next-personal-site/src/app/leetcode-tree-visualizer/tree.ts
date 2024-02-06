import {boolean} from "property-information/lib/util/types";

export class Visualizer {
    private static readonly BASE_TEXT_SIZE: number = 16;
    private static readonly BASE_LINE_WIDTH: number = 1;

    private readonly ctx: CanvasRenderingContext2D;
    private readonly padding: number = 2;
    private readonly textScale: number = 2;
    private readonly textSize: number = Visualizer.BASE_TEXT_SIZE * this.textScale;
    public readonly radius: number = this.textSize + this.padding * 2;
    public readonly initialVerticalSpacing: number = this.radius + this.padding;
    public readonly verticalSpacing: number = this.radius * 2 + this.textSize;
    private readonly qualityScale: number = 2;
    private readonly lineWidth: number = Visualizer.BASE_LINE_WIDTH * this.textScale;

    constructor(private readonly c: HTMLCanvasElement) {
        const height = 1000;
        c.setAttribute("style", `width: ${window.innerWidth}px; height: ${height}px;`);
        c.width = window.innerWidth * this.qualityScale;
        c.height = height * this.qualityScale;
        this.ctx = c.getContext("2d")!;
        this.ctx.font = `${this.textSize}px arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.clearRect(0, 0, c.width, c.height);
    }

    drawNode(node: TreeNode) {
        let {x, y} = node.position
        const singleText = node.valueActual === node.valueExpected;
        let actualTextWidth = this.getWidth(node.valueActual);
        let expectedTextWidth = singleText ? 0 : this.getWidth(node.valueExpected);
        console.log("width", actualTextWidth, expectedTextWidth, node.valueActual, node.valueExpected);
        let totalWidth = actualTextWidth + expectedTextWidth;

        if (node.valueActual === node.valueExpected) {
            this.ctx.fillText(node.valueActual!, x, y);
        } else if (!node.valueExpected) {
            // todo: set color red
            this.ctx.fillStyle = "red";
            this.ctx.fillText(node.valueActual!, x, y);
            this.ctx.fillStyle = "black";
        } else if (!node.valueActual) {
            // todo: set color green
            this.ctx.fillStyle = "green";
            this.ctx.fillText(node.valueExpected, x, y);
            this.ctx.fillStyle = "black";
        } else {
            console.log("draw dif", node);
            const actualX = x - expectedTextWidth / 2 - this.padding;
            const expectedX = x + actualTextWidth / 2 + this.padding;
            this.ctx.fillStyle = "red";
            this.ctx.fillText(node.valueActual, actualX, y);
            this.ctx.fillStyle = "green";
            this.ctx.fillText(node.valueExpected, expectedX , y);
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

    getWidth(value: string | undefined) {
        return value ? this.ctx.measureText(value).width : 0;
    }

    getInnerWidth(node: TreeNode) {
        return this.getWidth(node.valueActual) + this.getWidth(node.valueExpected);
    }

    getOuterWidth(node: TreeNode) {
        return Math.max(this.radius * 2, this.getInnerWidth(node) + this.padding);
    }

    drawNodeLink(parent: TreeNode, child: TreeNode) {
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

    build(chunksActual: string[] | undefined, chunksExpected: string[] | undefined) {
        this.root = new TreeNode(chunksActual?.[0], undefined); // todo: handle zero length
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

        this.root.valueExpected = chunksExpected?.[0]; // todo: handle zero length
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

        this.reposition();
    }

    bfs() {
        if (!this.root) return;

        let queue: TreeNode[] = [];
        queue.push(this.root)

        while (queue.length !== 0) {
            let node = queue.shift()!
            console.log(node);
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

    reposition() {
        this.traverse(this.root, 0, [], true);
    }

    traverse(node: TreeNode | undefined, h: number, hToRightmostX: number[], leanLeft: boolean) {
        if (!node) return;
        hToRightmostX[h] = Math.max(hToRightmostX[h] || 0, (hToRightmostX[h - 1] || 0) + (leanLeft ? -this.visualizer.radius / 2 : this.visualizer.radius / 2));
        let left = this.traverse(node.left, h + 1, hToRightmostX, true);
        let right = this.traverse(node.right, h + 1, hToRightmostX, false);
        node.position.y = h * this.visualizer.verticalSpacing + this.visualizer.initialVerticalSpacing;
        let horizontalShift = this.visualizer.getOuterWidth(node) / 2;
        if (!left && !right) {
            console.log("leaf " + node.valueActual + " h shift " + horizontalShift);
            node.position.x = Math.max((hToRightmostX[h] || 0) + horizontalShift + this.visualizer.radius / 2);
        } else if (left && right) {
            console.log("link " + node.valueActual);
            node.position.x = (node.left!.position.x + node.right!.position.x) / 2;
        } else if (left && !right) {
            node.position.x = node.left!.position.x + this.visualizer.radius / 2;
            console.log("some left", node);
        } else if (!left && right) {
            node.position.x = hToRightmostX[h] + this.visualizer.radius + this.visualizer.radius / 2;
            node.position.x = (node.position.x + right.position.x - this.visualizer.radius / 2) / 2;
            console.log("some right", node);
        }
        hToRightmostX[h] = node.position.x + horizontalShift;
        return node;
    }
}

// displayRawTree("[1,2,null,4,5,6]");
// displayRawTree("[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]");
// displayRawTree("[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]");
// displayRawTree("[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]");
// displayRawTree("[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]");
// displayRawTree("[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,null,19]");
// displayRawTree("[1,2,3,4,5,6,7]");
// displayRawTree("[1,2,3,4,5,null,7]");
// displayRawTree("[1,2,3,4,5,null,7,null,null,null,null,8]");
// displayRawTree("[1,2,3,4,5,6,7,null,null,10]");
// displayRawTree("[1,2,null,4,null,6]");
// displayRawTree("[1,2,3,4,5,null,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,null,null,23]");
// displayRawTree("[1,2,3,4,5,null,7,8,9,10,11,12,13,14,15,null,17,18,19,20,21,22,null,null,23]");
// displayRawTree("[1,null,3]");
// displayRawTree("[1,null,3,4]");
// displayRawTree("[1,null,3,4,5]");
// displayRawTree("[1]");
// displayRawTree("[]")
// displayRawTree("[1,2,3,4,5,6,7,8,9,10,11,12,null,14,15,16,17,18,19,20,21,22,23,24,null,15,null,28,29,30,31,null,null,2,3,4,5,null,6,7,5,4,null,6,null,null,null,5,4,null,null,5,null,null,null,null,null,null,null,5,null,null,null,null,null,null,5,null,null,null,null,null,null,null,4,null,5,null,5,null,null,4,3,null,223214124125122321412412512232141241251,123,123456,1234567]");
// displayRawTree("[1,2,3,4,555555,6,7]");
// displayRawTree("[1,null,3,5,6,7,9]", "[2,3,null,4,5,6]")
