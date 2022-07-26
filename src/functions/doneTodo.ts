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

    const todo = response.Items[0];
    todo.done = !todo.done;
    
    await document
      .put({
        TableName: "todos",
        Item: todo,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Invalid TODO!",
    }),
  };
};