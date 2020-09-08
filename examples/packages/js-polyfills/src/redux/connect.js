import React, { Component } from 'react';

/**
 * Description: 高阶函数，将某个组件绑定到 Redux 状态树中
 * Usage: const VisibleTodoList = connect(
      mapStateToProps,
      mapDispatchToProps
    )(TodoList)
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @return {Function}
 */
export default function connect(mapStateToProps, mapDispatchToProps) {
  const storeKey = 'CustomStoreKey';

  class HOCComponent extends Component {
    constructor(props, context) {
      super(props, context);

      // 获取 Store 对象，需要判断是从 Props 传入还是从 Context 传入
      this.store = props[storeKey] || context[storeKey];
    }

    getChildContext() {
      return {
        [storeKey]: this.context[storeKey],
      };
    }

    mergeProps() {
      const props = this.props || {};

      return {
        ...props,
        ...mapStateToProps(this.store.getState()),
        ...mapDispatchToProps(this.store.dispatch),
      };
    }

    render() {
      return React.createElement(
        HOCComponent.WrappedComponent,
        this.mergeProps()
      );
    }
  }

  return function(WrappedComponent) {
    HOCComponent.WrappedComponent = WrappedComponent;

    return HOCComponent;
  };
}
