const exampleToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ6YnlzemVrQG8yLnBsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlpieXN6ZWsiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MTE3OTM2NjAsImlzcyI6IlN6YWNobWF0eV9BdXRoZW50aWNhdGlvbl9TZXJ2aWNlIiwiYXVkIjoiU3phY2htYXR5X0Zyb250ZW5kIn0.ZZnEn-RLrpRYpFQsg-IDCNF1qmua-7ToAh9hvlKcB4g";

const AuthComponent = {
    isAuthenticated: false,
    JSONToken:"",
    UserMail:"",
    authenticate: (user:string, password:string, callback:any) => {
      if (user === "Admin" && password === "Admin") {
        AuthComponent.isAuthenticated = true;
        localStorage.setItem("Token",exampleToken);
        AuthComponent.JSONToken=exampleToken;
        AuthComponent.UserMail="zbyszek@o2.pl";
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
      AuthComponent.JSONToken="";
      localStorage.removeItem("Token");
      setTimeout(callback, 100);
    },
    initialize:()=>{
      let token=localStorage.getItem("Token");
      if(token!=null && isValid(token)){
        AuthComponent.isAuthenticated = true;
        localStorage.setItem("Token",token);
        AuthComponent.JSONToken=token;
      }
    }
  };


  function isValid(token:string):boolean{
    return Date.now() < (JSON.parse(atob(token.split('.')[1]))).exp * 1000;
  }
  
  export default AuthComponent;