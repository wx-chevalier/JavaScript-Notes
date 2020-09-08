// @ts-check

/**
 * Description: 组合不同的 Reducer
 * @param reducers
 * @return {Function} finalReducer
 */
export default function combineReducers(reducers) {
  if (typeof reducers !== 'object') {
    throw new Error('Invalid Params');
  }

  // 获取所有函数键，清空所有无效的
  const reducerKeys = Object.keys(reducers).filter(reducerKey => typeof reducers[reducerKey] === 'function');

  // 返回封装之后的函数
  return function finalReducer(state = {}, action) {
    // 最终的状态
    const nextState = {};

    // 依次对于 Reducer 进行处理
    for (let i = 0; i < reducerKeys.length; i += 1) {
      const key = reducerKeys[i];

      // 获取 reducer
      const reducer = reducers[key];

      // 获取状态树中的子对象
      const stateByKey = state[key];

      // 执行 reduce 转换操作
      const nextStateByKey = reducer(stateByKey, action);

      // Redux 需要避免状态空，进行异常检测
      if (typeof nextStateByKey === 'undefined') {
        throw new Error('Invalid Reducer');
      }

      // 将新的状态对象挂载
      nextState[key] = nextStateByKey;
    }

    return nextState;
  };
}
