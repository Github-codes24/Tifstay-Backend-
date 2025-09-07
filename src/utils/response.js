// src/utils/response.js

function ok(res, data) {
  return res.status(200).json({
    status: 200,
    success: true,
    ...data
  });
}

function created(res, data) {
  return res.status(201).json({
    status: 201,
    success: true,
    ...data
  });
}

function badRequest(res, message) {
  return res.status(400).json({
    status: 400,
    success: false,
    message
  });
}

function serverError(res, message) {
  return res.status(500).json({
    status: 500,
    success: false,
    message
  });
}

module.exports = {
  ok,
  created,
  badRequest,
  serverError
};
