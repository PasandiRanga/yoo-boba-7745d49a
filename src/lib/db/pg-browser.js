// pg-browser.js
export default {
    Pool: class {
      connect() {
        throw new Error('Database operations cannot be performed in the browser');
      }
    }
  };