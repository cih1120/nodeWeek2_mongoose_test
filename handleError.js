const headers = require('./header');

const handleError = (res, message) => {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: message || '欄位未填寫正確或無此 id'
    })
  );
  res.end();
};

module.exports = handleError;
