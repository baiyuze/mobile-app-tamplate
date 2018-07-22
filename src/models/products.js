
import { query } from '../services/products';

export default {
  namespace: 'products',

  state: {
    list: [
      { name: 'dva', id: 1 },
      { name: 'antd', id: 2 },
    ],
  },

  effects: {
    *query(_, { call, put }) {
      const response = yield call(query,1231);
      yield put({
        type: 'saveObj',
        obj: response
      });
    },
  },

  reducers: {
    saveObj(state, action) {
      return {
        ...state,
        obj: action.obj
      };
    },
    'delete'(state, { payload: id }) {
      
      return state.filter(item => item.id !== id);
    },
  },
};


