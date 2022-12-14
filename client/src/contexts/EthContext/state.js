const actions = {
  init: "INIT",
};

const initialState = {
  eventArtifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  eventContract: null,
  tokenContract : null, 
  icoContract : null, 
  singleStakingContract : null
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer
};
