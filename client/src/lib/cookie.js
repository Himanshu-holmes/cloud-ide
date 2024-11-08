function getCookie(name){
    let cookies = document.cookie;
    let cookieArr = cookies.split(";");
    
    let cleanedCookie = cookieArr.map(c => c.trim())
    console.log(cleanedCookie);
    let targetCookie = cleanedCookie.find(c=>c.startsWith(`${name}=`));
    if(targetCookie) return targetCookie.split("=")[1];
    return null
  }

  export {
    getCookie
  }