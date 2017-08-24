# React Helpers

Helpers contains 2 methods:

**Join Children**

```
const renderComponent = (props, index) => <Component {...props} key={index} />;

joinChildren(items, renderComponent, <Separator />);
```

or

```
joinChildren(items, <Component />, <Separator />);
```

or

```
joinChildren(items, renderComponent, renderSeparator);
```

Examples:
```
const items = [
    { value: 'foo', label: 'foo' },
    { value: 'bar', label: 'bar' },
];

joinChildren(items, <Component />, <Separator />);

[
  <Component value="foo" key={0} />,
  <Separator value="foo" key={1} />,
  <Component value="bar" key={2} />,
];
```

```
export default class MyComponent extends React.Component {
  renderItem = (item, index) => {
    return <Item key={ index } className="item" />
  }
  
  renderSeparator = key => {
    return <Separator className="separator" key={ key } />
  }

  render () {
    const renderedItems = joinChildren(
      this.props.items,
      this.renderItem,
      this.renderSeparator
    );

    // with 3 items, joinChildren
    // returns [<Item>, <Separator>, <Item>, <Separator>, <Item>]
    return (
      <div>
        {renderedItems}
      </div>
    );
  }
}
```

**Chain Wrap Children**
chainWrapChildren - allow you define
structure, which takes each element from left to right and pass it
like children to next. All props and children will be combined.

```
chainWrapChildren(props, wrappers)
props - props
wrappers - array of wrappers
```

Examples:
```
chainWrapChildren(props, [<ComponentC />, <ComponentB />, <ComponentA />])

<ComponentA {...props}>
  <ComponentB {...props}>
    <ComponentC {...props}/>
  </ComponentB>
</ComponentA>
```

```
chainWrapChildren(props, [
  <ComponentC lower />,
  <ComponentB middle />,
  <ComponentA upper />
]);

<ComponentA upper {...props}>
  <ComponentB middle {...props}>
    <ComponentC lower {...props}/>
  </ComponentB>
</ComponentA>
```

```
chainWrapChildren(props, [
  <ComponentB />,
  <ComponentA>
    text node
    <div>smth div</div>
  </ComponentA>
]);

<ComponentA {...props}>
  text node
  <div>smth div</div>
  <ComponentB {...props} />
</ComponentA>
```

```
chainWrapChildren(props, [
  <ComponentC />,
  null,
  <ComponentA />,
]);

<ComponentA {...props}>
  <ComponentC {...props}/>
</ComponentA>
```

```
const renderFnB = () => null;

chainWrapChildren(props, [
  <ComponentC />,
  renderFnB,
  <ComponentA />,
]);

<ComponentA {...props}>
  <ComponentC {...props}/>
</ComponentA>
```