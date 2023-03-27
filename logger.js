const logger = (req, res, next) => {
    const current_datetime = new Date();
    const formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes()
      const method = req.method;
      const url = req.url;
      const status = res.statusCode;
      const ipAddress = req.socket.remoteAddress;
      const log = `[${formatted_date}] ${method}:${url} ${status} ${ipAddress}`;
    console.log(log);
    next();
  };

  module.exports= logger