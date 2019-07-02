import book from '@/api/book';

const state = () => ({ items: null });

const mutations = {
  UPDATE_BOOKS(sta, data) {
    sta.items = data;
  },
};

const actions = {
  async fetch({ commit }) {
    const data = await book.get();
    commit('UPDATE_BOOKS', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
