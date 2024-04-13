const headers = require('./header');

const handleSuccess = (res, message) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      message: message || ''
    })
  );
  res.end();
};

module.exports = handleSuccess;
