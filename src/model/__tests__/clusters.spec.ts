import 'jest-graphviz';
import { DotObject, GraphvizObject } from '../abstract';
import { ISubgraph } from '../../types';
import { AttributesBase } from '../attributes-base';
import { Cluster, Subgraph } from '../clusters';
import { Node } from '../nodes';
import { attribute } from '../../attribute';

describe('class Subgraph', () => {
  let subgraph: ISubgraph;

  beforeEach(() => {
    subgraph = new Subgraph();
  });

  it('should be instance of Subgraph/Cluster/AttributesBase/DotObject/GraphvizObject', () => {
    expect(subgraph).toBeInstanceOf(Subgraph);
    expect(subgraph).toBeInstanceOf(Cluster);
    expect(subgraph).toBeInstanceOf(AttributesBase);
    expect(subgraph).toBeInstanceOf(DotObject);
    expect(subgraph).toBeInstanceOf(GraphvizObject);
  });

  describe('Constructor', () => {
    test('first argument is id, and second attributes object', () => {
      subgraph = new Subgraph('test', {
        [attribute.K]: 1,
      });
      expect(subgraph.id).toBe('test');
      expect(subgraph.get(attribute.K)).toBe(1);
    });
    test('first argument is attributes object', () => {
      subgraph = new Subgraph({
        [attribute.K]: 1,
      });
      expect(subgraph.get(attribute.K)).toBe(1);
    });
  });

  test('set attributes', () => {
    subgraph.set(attribute.rank, 'same');
    expect(subgraph.get(attribute.rank)).toBe('same');
  });

  describe('set attributes by apply', () => {
    test('with attributes object', () => {
      subgraph.apply({
        [attribute.rank]: 'same',
      });
      expect(subgraph.get(attribute.rank)).toBe('same');
    });

    test('with entities', () => {
      subgraph.apply([[attribute.rank, 'same']]);
      expect(subgraph.get(attribute.rank)).toBe('same');
    });
  });

  it('should be subgraph, when subgraph id is "test"', () => {
    expect(subgraph.isSubgraphCluster()).toBe(false);
  });

  test('create node with attributes', () => {
    const node = subgraph.createNode('n', {
      [attribute.label]: 'Label',
    });
    expect(node.id).toBe('n');
    expect(node.attributes.size).toBe(1);
  });

  test('create edge with attributes', () => {
    const nodes = ['node1', 'node2'].map((id) => subgraph.createNode(id));
    const edge = subgraph.createEdge(nodes, {
      [attribute.label]: 'Label',
    });
    expect(edge.attributes.size).toBe(1);
  });

  test('create subgraph with attributes', () => {
    subgraph = subgraph.createSubgraph('test', {
      [attribute.label]: 'Label',
    });
    expect(subgraph.id).toBe('test');
    expect(subgraph.size).toBe(1);

    subgraph = subgraph.createSubgraph({
      [attribute.label]: 'Label',
    });
    expect(subgraph.size).toBe(1);
  });

  test.each([
    ['cluster', true],
    ['cluster_hoge', true],
    ['hoge_cluster', false],
    ['example', false],
  ])('if cluster named "%s", isSubgraphCluster should be %p', (id, expected) => {
    subgraph = new Subgraph(id);
    expect(subgraph.isSubgraphCluster()).toBe(expected);
  });

  describe('addXxx existXxx removeXxx APIs', () => {
    it('Node operation methods works', () => {
      const id = 'node';
      expect(subgraph.existNode(id)).toBe(false);
      const node = new Node(id);
      subgraph.addNode(node);
      expect(subgraph.existNode(id)).toBe(true);
      subgraph.removeNode(node);
      expect(subgraph.existNode(id)).toBe(false);
      subgraph.addNode(node);
      expect(subgraph.existNode(id)).toBe(true);
      subgraph.removeNode(node.id);
      expect(subgraph.existNode(id)).toBe(false);
    });

    it('Edge operation methods works', () => {
      const nodes = ['node1', 'node2'].map((id) => subgraph.createNode(id));
      const edge = subgraph.createEdge(nodes);
      expect(subgraph.existEdge(edge)).toBe(true);
      subgraph.removeEdge(edge);
      expect(subgraph.existEdge(edge)).toBe(false);
    });

    it('Subgraph operation methods works', () => {
      const sub = subgraph.createSubgraph('sub');
      expect(subgraph.existSubgraph(sub)).toBe(true);
      subgraph.removeSubgraph(sub);
      expect(subgraph.existSubgraph(sub)).toBe(false);
      subgraph.addSubgraph(sub);
      expect(subgraph.existSubgraph(sub)).toBe(true);
      subgraph.removeSubgraph(sub);
      expect(subgraph.existSubgraph(sub)).toBe(false);
    });

    it('should be undefined, when id not set', () => {
      const sub = subgraph.createSubgraph();
      expect(sub.id).toBeUndefined();
      expect(sub.isSubgraphCluster()).toBe(false);
    });

    it('throws an error when the EdgeTarget element is missing', () => {
      const n = subgraph.node('n');
      expect(() => {
        subgraph.edge([]);
      }).toThrow();
      expect(() => {
        subgraph.edge([n]);
      }).toThrow();
    });
  });
});