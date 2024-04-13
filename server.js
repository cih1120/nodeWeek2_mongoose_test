const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const headers = require('./header');
const Posts = require('./model/posts');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'))
  .catch((error) => {
    console.log(error);
  });

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/posts') {
    switch (req.method) {
      /* 取得所有貼文 */
      case 'GET': {
        const allPosts = await Posts.find();
        handleSuccess(res, allPosts);
        return;
      }
      /* OPTION */
      case 'OPTION': {
        handleSuccess(res);
        return;
      }
      /* 刪除所有貼文 */
      case 'DELETE': {
        const deletedCount = await Posts.deleteMany({});
        handleSuccess(res, deletedCount);
        return;
      }
      /* 新增單筆貼文 */
      case 'POST': {
        try {
          req.on('end', async () => {
            const data = JSON.parse(body);
            if (data.tags == [] || !data.tags) {
              handleError(res, '貼文tag 未填寫');
            }
            await Posts.create({
              name: data.name,
              content: data.content,
              tags: data.tags,
              type: data.type
            })
              .then((newPost) => {
                handleSuccess(res, newPost);
              })
              .catch((e) => {
                handleError(res, e.errors);
              });
          });
        } catch (err) {
          handleError(res, err);
        }
        return;
      }
      default: {
        break;
      }
    }
  }

  if (req.url.startsWith('/posts/')) {
    const id = req.url.split('/').pop();
    console.log(id);
    switch (req.method) {
      /* 編輯單筆貼文完整內容 */
      case 'PATCH': {
        try {
          req.on('end', async () => {
            const data = JSON.parse(body);
            if (data.tags == [] || !data.tags) {
              handleError(res, '貼文tag 未填寫');
            }
            await Posts.findByIdAndUpdate(id, {
              name: data.name,
              content: data.content,
              tags: data.tags,
              type: data.type
            })
              .then((newPost) => {
                handleSuccess(res, '編輯成功');
              })
              .catch((e) => {
                handleError(res, e.errors);
              });
          });
        } catch (err) {
          handleError(res, err);
        }
        return;
      }
      /* 刪除單筆貼文 */
      case 'DELETE': {
        try {
          req.on('end', async () => {
            await Posts.findByIdAndDelete(id)
              .then((newPost) => {
                handleSuccess(res, newPost);
              })
              .catch((e) => {
                handleError(res, e.errors);
              });
          });
        } catch (err) {
          handleError(res, err);
        }
        return;
      }
      default: {
        break;
      }
    }
  }

  /* 路由錯誤 */
  res.writeHead(404, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: '無此路由'
    })
  );
  res.end();
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
