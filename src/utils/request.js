import config from './config';
import 'isomorphic-fetch';

const request = async (url, options={ method:'get', query: {} }) => {
    if(!options.method){
        options.method = 'get';
    }
    try{
        var form = new FormData();
        var query = '?';
        if(options.method=='post') {
            Object.keys(options.query).forEach(key => {
                form.append(key, options.query[key]);
            });
        } else {
            Object.keys(options.query).forEach(key => {
                query += `${key}=${options.query[key]}&`;
            });
        }


        let data = await fetch((url.indexOf('http')==-1 ? `${config.api_endPoint}${url}` : url) + query, {
            method: options.method,
            body: options.method == 'post' ? form:undefined,
            credentials: 'include',
        }).then(function(response) {
            return response.json();
        });

        // if(data.status===401) {
        //     config.goSSO();
        // }
        return { err: data.error, data: data };
    }catch(err){
        let resu;
        if(err.response){
            resu = { err: err.response.data.error, status: err.response.data.status , data: err.response.data.data};
        }else{
            resu = { err: '请求网络资源失败', status: 400};
		}
		console.log(resu);
        return resu;
    }
};

export default request;