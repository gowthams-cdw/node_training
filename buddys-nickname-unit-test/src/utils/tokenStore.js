// create a token store
const tokens = new Set();

// method to add token to the set
export const addToken = (token) => tokens.add(token);

// method to remove token from the set
export const removeToken = (token) => tokens.delete(token);

// check for the existence of token in the set
export const isValidToken = (token) => tokens.has(token);
