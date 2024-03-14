const AuthComponent = {
    isAuthenticated: false,
    JSONToken:"",
    UserNickname:"",
    authenticate: (user:string, password:string, callback:any) => {
      if (user === "Admin" && password === "Admin") {
        AuthComponent.isAuthenticated = true;
        setTimeout(() => {
          callback("Success");
        }, 100);
      } else {
        setTimeout(() => {
          callback("Invalid data login or password");
        }, 100);
      }
    },
    unAuthenticate: (callback:any) => {
      AuthComponent.isAuthenticated = false;
      setTimeout(callback, 100);
    }
  };
  
  export default AuthComponent;