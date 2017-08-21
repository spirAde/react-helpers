import React from 'react';

import { joinChildren, chainWrapChildren } from '../lib/index';

import { ComponentA, ComponentB, ComponentC } from './fixtures';

describe('joinChildren', () => {
  let items;

  beforeEach(() => {
    items = [
      { id: 1, value: 'foo' },
      { id: 2, value: 'bar' },
      { id: 3, value: 'smth' },
    ];
  });

  test('is function', () => {
    expect(typeof joinChildren).toBe('function');
  });

  test('called with renderFnA and renderFnB', () => {
    const renderFnA = (props, index) => <ComponentA {...props} key={index} />;
    const renderFnB = (props, index) => <ComponentB {...props} key={index} />;

    const actual = joinChildren(items, renderFnA, renderFnB);
    const expected = [
      <ComponentA id={1} value="foo" key={0} />,
      <ComponentB id={1} value="foo" key={1} />,
      <ComponentA id={2} value="bar" key={2} />,
      <ComponentB id={2} value="bar" key={3} />,
      <ComponentA id={3} value="smth" key={4} />,
    ];

    expect(actual).toEqual(expected);
  });

  test('called with renderFnA and renderedB', () => {
    const renderFnA = (props, index) => <ComponentA {...props} key={index} />;

    const actual = joinChildren(items, renderFnA, <ComponentB />);
    const expected = [
      <ComponentA id={1} value="foo" key={0} />,
      <ComponentB id={1} value="foo" key={1} />,
      <ComponentA id={2} value="bar" key={2} />,
      <ComponentB id={2} value="bar" key={3} />,
      <ComponentA id={3} value="smth" key={4} />,
    ];

    expect(actual).toEqual(expected);
  });

  test('called with renderedA and renderFnB', () => {
    const renderFnB = (props, index) => <ComponentB {...props} key={index} />;

    const actual = joinChildren(items, <ComponentA />, renderFnB);
    const expected = [
      <ComponentA id={1} value="foo" key={0} />,
      <ComponentB id={1} value="foo" key={1} />,
      <ComponentA id={2} value="bar" key={2} />,
      <ComponentB id={2} value="bar" key={3} />,
      <ComponentA id={3} value="smth" key={4} />,
    ];

    expect(actual).toEqual(expected);
  });

  test('called with renderedA and renderedB', () => {
    const actual = joinChildren(items, <ComponentA />, <ComponentB />);
    const expected = [
      <ComponentA id={1} value="foo" key={0} />,
      <ComponentB id={1} value="foo" key={1} />,
      <ComponentA id={2} value="bar" key={2} />,
      <ComponentB id={2} value="bar" key={3} />,
      <ComponentA id={3} value="smth" key={4} />,
    ];

    expect(actual).toEqual(expected);
  });

  test('called with renderedA and renderedB with additional props', () => {
    const actual = joinChildren(items, <ComponentA label="labelA" />, <ComponentB label="labelB" />);
    const expected = [
      <ComponentA id={1} value="foo" label="labelA" key={0} />,
      <ComponentB id={1} value="foo" label="labelB" key={1} />,
      <ComponentA id={2} value="bar" label="labelA" key={2} />,
      <ComponentB id={2} value="bar" label="labelB" key={3} />,
      <ComponentA id={3} value="smth" label="labelA" key={4} />,
    ];

    expect(actual).toEqual(expected);
  });

  test('called with another keyGenerator', () => {
    const keyGenerator = (index) => ({ leftKey: 3 * index, rightKey: (3 * index) + 1 });
    const actual = joinChildren(items, <ComponentA />, <ComponentB />, keyGenerator);
    const expected = [
      <ComponentA id={1} value="foo" key={0} />,
      <ComponentB id={1} value="foo" key={1} />,
      <ComponentA id={2} value="bar" key={3} />,
      <ComponentB id={2} value="bar" key={4} />,
      <ComponentA id={3} value="smth" key={6} />,
    ];

    expect(actual).toEqual(expected);
  });
});

describe('chainWrapChildren', () => {
  let props;

  beforeEach(() => {
    props = { value: 'foo', label: 'bar' };
  });

  test('is function', () => {
    expect(typeof chainWrapChildren).toBe('function');
  });

  test('called with empty wrappers', () => {
    const actual = chainWrapChildren(props, []);

    expect(actual).toBeNull();
  });

  test('called with 1 wrapper', () => {
    const actual = chainWrapChildren(props, [<ComponentA />]);
    const expected = <ComponentA {...props} />;

    expect(actual).toEqual(expected);
  });

  test('called with 2 wrappers', () => {
    const actual = chainWrapChildren(props, [<ComponentB />, <ComponentA />]);
    const expected = (
      <ComponentA {...props}>
        <ComponentB {...props} />
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 3 wrappers', () => {
    const actual = chainWrapChildren(props, [<ComponentC/>, <ComponentB />, <ComponentA />]);
    const expected = (
      <ComponentA {...props}>
        <ComponentB {...props}>
          <ComponentC {...props}/>
        </ComponentB>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 3 wrappers and additional props', () => {
    const actual = chainWrapChildren(props, [
      <ComponentC lower />,
      <ComponentB middle />,
      <ComponentA upper />
    ]);
    const expected = (
      <ComponentA upper {...props}>
        <ComponentB middle {...props}>
          <ComponentC lower {...props}/>
        </ComponentB>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 2 wrappers and lower has children', () => {
    const actual = chainWrapChildren(props, [
      <ComponentB>
        text node
      </ComponentB>,
      <ComponentA />
    ]);

    const expected = (
      <ComponentA {...props}>
        <ComponentB {...props}>
          text node
        </ComponentB>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 2 wrappers and upper has children', () => {
    const actual = chainWrapChildren(props, [
      <ComponentB />,
      <ComponentA>
        text node
        <div>smth div</div>
      </ComponentA>
    ]);

    const expected = (
      <ComponentA {...props}>
        text node
        <div>smth div</div>
        <ComponentB {...props} />
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 2 wrappers and upper has child', () => {
    const actual = chainWrapChildren(props, [
      <ComponentB />,
      <ComponentA>
        <div>smth div</div>
      </ComponentA>
    ]);

    const expected = (
      <ComponentA {...props}>
        <div>smth div</div>
        <ComponentB {...props} />
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 3 wrappers: renderFn -> component -> renderFn', () => {
    const renderFnC = (props) => <ComponentC {...props}/>;
    const renderFnA = (props) => <ComponentA {...props}/>;

    const actual = chainWrapChildren(props, [
      renderFnC,
      <ComponentB />,
      renderFnA,
    ]);

    const expected = (
      <ComponentA {...props}>
        <ComponentB {...props}>
          <ComponentC {...props}/>
        </ComponentB>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 3 wrappers, middle component is null', () => {
    const actual = chainWrapChildren(props, [
      <ComponentC />,
      null,
      <ComponentA />,
    ]);

    const expected = (
      <ComponentA {...props}>
        <ComponentC {...props}/>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 3 wrappers, middle component is function returned null', () => {
    const renderFnB = () => null;

    const actual = chainWrapChildren(props, [
      <ComponentC />,
      renderFnB,
      <ComponentA />,
    ]);

    const expected = (
      <ComponentA {...props}>
        <ComponentC {...props}/>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test.skip('called with 3 wrappers, lower component is null', () => {
    const actual = chainWrapChildren(props, [
      null,
      <ComponentB />,
      <ComponentA />,
    ]);

    const expected = (
      <ComponentA {...props}>
        <ComponentB {...props}/>
      </ComponentA>
    );

    expect(actual).toEqual(expected);
  });

  test('called with 3 wrappers, all components are null', () => {
    const actual = chainWrapChildren(props, [
      null,
      null,
      null,
    ]);

    expect(actual).toBeNull();
  });
});