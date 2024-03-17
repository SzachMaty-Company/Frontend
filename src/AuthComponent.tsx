const AuthComponent = {
    isAuthenticated: false,
    JSONToken:"",
    UserNickname:"",
    authenticate: (user:string, password:string, callback:any) => {
      if (user === "Admin" && password === "Admin") {
        AuthComponent.isAuthenticated = true;
        AuthComponent.JSONToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ6YnlzemVrQG8yLnBsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlpieXN6ZWsiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MTA2OTM2NjAsImlzcyI6IlN6YWNobWF0eV9BdXRoZW50aWNhdGlvbl9TZXJ2aWNlIiwiYXVkIjoiU3phY2htYXR5X0Zyb250ZW5kIn0.B728Xlo7JqTicWb2_8XBpYChFeke_AvyX4kbs6gfxuY";
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