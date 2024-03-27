const emailClaims='http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';

const AuthComponent = {
    isAuthenticated: false,
    JSONToken:"",
    UserMail:"",
    authenticate: (jsonstring:string) => {
        AuthComponent.isAuthenticated = true;
        AuthComponent.JSONToken=jsonstring;
        AuthComponent.UserMail=getEmail(jsonstring);
        localStorage.setItem("Token",jsonstring);
    },
    unAuthenticate: () => {
      AuthComponent.isAuthenticated = false;
      AuthComponent.JSONToken="";
      AuthComponent.UserMail="";
      localStorage.removeItem("Token");
    },
    initialize:()=>{
      let token=localStorage.getItem("Token");
      if(token!=null && isValid(token)){
        AuthComponent.isAuthenticated = true;
        AuthComponent.JSONToken=token;
        AuthComponent.UserMail=getEmail(token);
        localStorage.setItem("Token",token);
      }
    }
  };

  function isValid(token:string):boolean{
    return Date.now() < (JSON.parse(atob(token.split('.')[1]))).exp * 1000;
  }

  function getEmail(token:string):string{
    return JSON.parse(atob(token.split('.')[1]))[emailClaims];
  }
  
  export default AuthComponent;