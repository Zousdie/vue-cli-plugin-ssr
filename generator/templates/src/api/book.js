function get() {
  return new Promise((r) => {
    setTimeout(r, 1000, [
      {
        id: 0,
        name: '《地球往事》',
        desc: '《三体》1',
      },
      {
        id: 1,
        name: '《黑暗森林》',
        desc: '《三体》2',
      },
      {
        id: 2,
        name: '《死神永生》',
        desc: '《三体》3',
      },
    ]);
  });
}

export default {
  get,
};
