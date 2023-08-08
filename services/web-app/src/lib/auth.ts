import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { clientId, clientSecret, awsAccessKeyId, awsSecretKey, awsRegion } from "./config";
import { debug } from 'util';

export const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: awsAccessKeyId as string,
    secretAccessKey: awsSecretKey as string,
  },
  region: awsRegion,
};

const dynamoClient = DynamoDBDocument.from(new DynamoDB(dynamoConfig), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

export const authOptions: NextAuthOptions = ({
  providers: [
    GithubProvider({
      clientId: clientId as string,
      clientSecret: clientSecret as string,
    }),
  ],
  adapter: DynamoDBAdapter(dynamoClient, { 
    tableName: "dev-web-app-user-data",
    partitionKey: "id",
    sortKey: "name",
  }),
  debug: true,
});