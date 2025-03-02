const blacklistedTokens = new Set(); 

const addToBlacklist = (token) => {
  blacklistedTokens.add(token);
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

module.exports = { addToBlacklist, isTokenBlacklisted };
