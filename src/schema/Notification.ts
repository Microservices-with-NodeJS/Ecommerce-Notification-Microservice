import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

const NotificationType = new GraphQLObjectType({
  name: "Notification",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
  }),
});

export default NotificationType;
