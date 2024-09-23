export default () => ({
  upload: {
    baseUrl: process.env.UPLOAD_BASE_URL || "http://127.0.0.1:8081/uploads",
    apiPath: process.env.UPLOAD_API_PATH || "/uploads",
  },
  port: parseInt(process.env.PORT, 10) || 8081,
  database: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sport_complex-db',
});
