const setHello = async (_, args, ctx) => {
  const { message, chatId, clientId } = args;
  ctx.pubsub.publish(chatId, {
    subToChat: {
      message,
      clientId,
      date: new Date()
    },
  });
  return true;
};

export { setHello };
