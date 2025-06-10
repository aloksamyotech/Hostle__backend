export const createResponse = (
  status = 200,
  message = "SUCCESS",
  data,
  additionaData
) => {
  const response = {
    status,
    message,
  };

  if (data) {
    response.data = data;
  }
  if (additionaData) {
    response.additionaData = additionaData;
  }

  return response;
};

export const sendResponse = async (res, jsonData) => {
  const { status } = jsonData;
 

  switch (true) {
    case status === 200:
      return res.status(200).json(jsonData);

    case status === 201:
      return res.status(201).json(jsonData);

    case status === 500:
      return res.status(500).json(jsonData);

    case status === 404:
      return res.status(200).json(jsonData);

    case status === 409:
      return res.status(200).json(jsonData);

    case status === 401:
      return res.status(200).json(jsonData);

    case status === 400:
      return res.status(200).json(jsonData);

    case status === 422:
      return res.status(200).json(jsonData);

    default:
      return res.status(200).json(jsonData);
  }
};
