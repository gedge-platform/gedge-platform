function catchError(error, navigate){
    if(error.response){
        if(error.response.status == 401){
            auth401Error(error, navigate);
        }
    }
}

function auth401Error(error, navigate){
    navigate('/login');
}


export {catchError};