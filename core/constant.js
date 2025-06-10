export const code = {
  SUCCESS: "SUCCESS",
};

export const statusCodes = {
  OK: 200, // Request succeeded
  CREATED: 201, // Resource created successfully
  NO_CONTENT: 204, // Successful request, but no content returned

  BAD_REQ: 400, // Bad request (e.g., missing parameters)
  UNAUTHORIZED: 401, // Unauthorized access (authentication required)
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409, // Conflict (e.g., duplicate resource or conflict in data)

  INTERNAL_SERVER_ERROR: 500, // Internal server error
  BAD_GATEWAY: 502, // Bad gateway (usually in case of a proxy or gateway issue)
  REQIRED_ENTITY: 422, //Required Entity
  FORBIDDEN: 403, // server understands the request but refuses to authorize it due to insufficient permissions
};
