const typeDefs = `#graphql
type Message {
    clientId: String!
    message: String!
    date: String
}
type Query {
    helloWorld: String
}
type Mutation {
    setHello(message: String!, chatId: String!, clientId: String!):Boolean
}
type Subscription {
    subToChat(chatId: String!): Message
}
`;
export default typeDefs;
