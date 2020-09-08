import combineReducers from '../../src/redux/combineReducers';

describe('combineReducers', () => {
  it('初始状态处理', () => {
    const theDefaultReducer = (state = 0) => state;

    const firstNamedReducer = (state = 1) => state;

    const secondNamedReducer = (state = 2) => state;

    const finalState = {
      theDefaultReducer: 0,
      firstNamedReducer: 1,
      secondNamedReducer: 2
    };

    const rootReducer = combineReducers({
      theDefaultReducer,
      firstNamedReducer,
      secondNamedReducer
    });

    expect(typeof rootReducer).toBe('function');
    expect(rootReducer()).toEqual(finalState);
  });

  it('状态不变性校验', () => {
    const previousState = {
      todos: ['1'],
      count: 0
    };

    const todoReducer = (state = [], action) => {
      if (action === 'add') {
        return [...state, '2'];
      }
    };

    const countReducer = (state = 0) => {
      return state + 1;
    };

    const rootReducer = combineReducers({
      todos: todoReducer,
      count: countReducer
    });

    const nextState = rootReducer(previousState, 'add');

    expect(nextState).not.toBe(previousState);
    expect(nextState).not.toEqual(previousState);

    expect(previousState).toEqual({
      todos: ['1'],
      count: 0
    });

    expect(nextState).toEqual({
      todos: ['1', '2'],
      count: 1
    });
  });

  it('异常输入校验', () => {
    expect(() => {
      combineReducers(null);
    }).toThrow();
  });
});
