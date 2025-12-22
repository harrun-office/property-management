// Helper function to get IP address from request
function getIpAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
}

module.exports = {
  getIpAddress
};

