import { helloWorld } from "./queries/index.js";
import { setHello } from "./mutation/index.js";
const resolvers = {
  Query: { helloWorld },
  Mutation: { setHello },
  Subscription: {
    subToChat: {
      subscribe: (parent, args, context, info) => {
        const { chatId } = args;
        return context.pubsub.asyncIterator([chatId]);
      },
    },
  },
};

export default resolvers;
