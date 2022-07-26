import { APIGatewayEvent } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler = async (event: APIGatewayEvent) => {
  const { id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  if (response.Items[0]) {
    await document
      .delete({
        TableName: "todos",
        Key: {
          id: id,
        },
      })
      .promise();

    return {
      statusCode: 204,
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Invalid TODO!",
    }),
  };
};
