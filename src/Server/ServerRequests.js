import axios from "axios";
function GetRequest(URL, token) {
    return axios.get(URL, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}

function PostRequest(URL, data) {
    return axios.post(URL,data);
}

function SpecialPostRequest(URL, data, token) {
    return axios.post(URL, data, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}

function PutRequest(URL,token,data){
    return axios.put(URL,data,{
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}

function SpecialPutRequest(URL,token,data){
    return axios.put(URL,data,{
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type":'multipart/form-data'
        }
    })
}

function ImagePostRequest(URL,token,data,isImage){
    if(isImage){
        return axios.post(URL,data,{
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type":'multipart/form-data'
            }
        })
    }else{
        return axios.post(URL,data,{
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    }
}

export {
    GetRequest, PostRequest,SpecialPostRequest,PutRequest,SpecialPutRequest,ImagePostRequest
};