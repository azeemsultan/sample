const logger = (msg: any = 'Test Console', type: any = 'info') => {
  if (process.env.REACT_APP_ENVIRONMENT === 'DEVELOPMENT') {
    switch (type) {
      case 'error':
        console.error(msg);
        break;
      case 'warn':
        console.warn(msg);
        break;
      default:
        console.log(msg);
        break;
    }
  }
};
export default logger;
