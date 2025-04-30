let clients = [];

const addClient = (client) => {
  clients.push(client);
};

const removeClient = (clientId) => {
  clients = clients.filter(c => c.id !== clientId);
};

const emitNotification = (notification) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify({
      type: "NEW_NOTIFICATION",
      payload: notification
    })}\n\n`);
  });
};

module.exports = {
  clients,
  addClient,
  removeClient,
  emitNotification
};