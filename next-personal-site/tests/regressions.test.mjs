import assert from 'node:assert/strict';
import test from 'node:test';
import {parseTreeInput, Tree, Visualizer} from '../src/app/leetcode-tree-visualizer/tree.ts';
import getFormattedDate from '../src/lib/getFormattedDate.ts';
import {imageSize, imagesInRow} from '../src/lib/images.ts';
import {createElement, Fragment} from 'react';

test('tree input accepts sparse trees and rejects missing values or parents', () => {
    for (const input of ['', '  ', '[]', '[null]', '[null,null]']) {
        assert.deepEqual(parseTreeInput(input), []);
    }
    assert.deepEqual(parseTreeInput(' [1, 2,3,null,5,null,4] '), ['1', '2', '3', 'null', '5', 'null', '4']);
    assert.deepEqual(parseTreeInput('1,2,3,null,null'), ['1', '2', '3']);
    assert.deepEqual(parseTreeInput('[a long label,another label]'), ['a long label', 'another label']);
    for (const input of ['[1', '1]', '[1,,2]', '[null,1]', '[1,null,null,2]', '[[1]]']) {
        assert.throws(() => parseTreeInput(input), Error, input);
    }
});

test('drawing handles empty, actual-only, expected-only and diff trees', () => {
    const nodes = [];
    const links = [];
    const sizes = [];
    const visualizer = {
        qualityScale: 2, radius: 36, verticalSpacing: 104, initialVerticalSpacing: 38,
        resize: (...size) => sizes.push(size),
        resizeHeight() {}, resizeWidth() {}, getOuterWidth: () => 72,
        drawNode: node => nodes.push([node.valueActual, node.valueExpected]),
        drawNodeLink: (...link) => links.push(link),
    };
    const tree = new Tree(visualizer);
    tree.build(['1', '2', '3'], ['1', 'null', '4', '5']);
    assert.deepEqual(nodes, [['1', '1'], ['2', undefined], ['3', '4'], [undefined, '5']]);
    assert.equal(links.length, 3);
    tree.build([], []);
    assert.deepEqual(sizes.at(-1), [0, 0]);
    nodes.length = 0;
    tree.build([], ['9']);
    assert.deepEqual(nodes, [[undefined, '9']]);
    nodes.length = 0;
    tree.build(['9'], []);
    assert.deepEqual(nodes, [['9', undefined]]);
    assert.throws(() => tree.build(['1', 'null', 'null', '2'], []), /parent/);
});

test('publication dates are independent of the build timezone', () => {
    const previous = process.env.TZ;
    try {
        for (const zone of ['America/Toronto', 'UTC', 'Pacific/Honolulu']) {
            process.env.TZ = zone;
            assert.equal(getFormattedDate('2024-01-21'), 'January 21, 2024');
            assert.equal(getFormattedDate('2025-12-21'), 'December 21, 2025');
        }
    } finally {
        if (previous === undefined) delete process.env.TZ;
        else process.env.TZ = previous;
    }
});

test('oversized trees are rejected before recursion or canvas allocation', () => {
    assert.throws(() => parseTreeInput('a'.repeat(100_001)), /smaller tree/);
    assert.throws(() => parseTreeInput(Array(5_001).fill('1').join(',')), /5,000/);
    const visualizer = {resizeHeight() {}, resizeWidth() {}, getOuterWidth: () => 72};
    const tree = new Tree(visualizer);
    const deep = ['1', ...Array(128).fill(['1', 'null']).flat()];
    assert.throws(() => tree.build(deep, []), /128 levels/);
    assert.throws(() => tree.build(Array(5_001).fill('1'), []), /5,000/);
    const previous = {document: globalThis.document, getComputedStyle: globalThis.getComputedStyle};
    try {
        globalThis.document = {documentElement: {}};
        globalThis.getComputedStyle = () => ({getPropertyValue: () => ''});
        const canvas = {width: 0, height: 0, setAttribute() {}, getContext: () => null};
        const drawing = new Visualizer(canvas);
        for (const [width, height] of [[Infinity, 1], [-1, 1], [8193, 1], [2001, 2000]]) {
            assert.throws(() => drawing.resize(width, height), /canvas size limit/);
            assert.equal(canvas.width, 0);
        }
        drawing.resize(0, 0);
        assert.throws(() => drawing.resize(100, 100), /unavailable/);
    } finally {
        for (const [name, value] of Object.entries(previous)) {
            if (value === undefined) delete globalThis[name];
            else globalThis[name] = value;
        }
    }
});

test('article images use measured dimensions and stay inside public/images', async () => {
    assert.deepEqual(await imageSize('/images/apps/medical-codes/idc-10-main.webp'), {width: 1242, height: 2688});
    for (const src of ['/images/../../package.json', 'https://example.com/image.png']) {
        await assert.rejects(imageSize(src), /Store article images/);
    }
});

test('image rows find images inside MDX paragraphs and preserve their order and captions', () => {
    const first = {src: '/images/first.webp', alt: 'Overview', title: 'First caption'};
    const second = {src: '/images/second.webp', alt: 'Details'};
    const children = createElement(Fragment, null,
        createElement('p', null, createElement('img', first), ' ', createElement('img', second)));
    assert.deepEqual(imagesInRow(children), [first, {...second, title: undefined}]);
    assert.deepEqual(imagesInRow(createElement('p', null, 'Plain text')), []);
});
