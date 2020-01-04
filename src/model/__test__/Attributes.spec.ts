import { DotBase, GraphvizObject } from '../../common';
import { Attributes } from '../Attributes';

describe('class Attributes', () => {
  let attrs: Attributes;
  beforeEach(() => {
    attrs = new Attributes();
  });

  it('should be instance of Attributes/DotBase/GraphvizObject', () => {
    expect(attrs).toBeInstanceOf(Attributes);
    expect(attrs).toBeInstanceOf(DotBase);
    expect(attrs).toBeInstanceOf(GraphvizObject);
  });

  it('size should be 0 by default', () => {
    expect(attrs.size).toBe(0);
  });

  describe('renders correctly by toDot method', () => {
    it('no attributes', () => {
      expect(attrs.toDot()).toMatchSnapshot();
    });

    it('one attribute', () => {
      attrs.set('label', 'test');
      expect(attrs.toDot()).toMatchSnapshot();
    });

    it('some attributes', () => {
      attrs.set('label', 'test');
      attrs.set('color', 'red');
      expect(attrs.toDot()).toMatchSnapshot();
    });

    describe('edge with comment', () => {
      beforeEach(() => {
        attrs.set('label', 'test');
        attrs.set('color', 'red');
      });
      test('single line comment', () => {
        attrs.comment = 'this is comment.';
        expect(attrs.toDot()).toMatchSnapshot();
      });

      test('multi line comment', () => {
        attrs.comment = 'this is comment.\nsecond line.';
        expect(attrs.toDot()).toMatchSnapshot();
      });
    });
  });
});