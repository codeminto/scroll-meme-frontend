import axios from 'axios';
import { ENV_CONFIGS } from '../configs/env';

const axiosHelper = async (url, method, formData = null, JSONData = null) => {
    console.log({ url: ENV_CONFIGS.VITE_BACKEND_URL })
    const headers = {};
    // Authorization: `Bearer ${localStorage.getItem('token')}`,

    if (formData) {
        headers['Content-Type'] = 'multipart/form-data';
    }
    if (JSONData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await axios({
        method,
        url: ENV_CONFIGS.VITE_BACKEND_URL + url,
        data: formData || JSONData || null,
        // headers,
    });
    return response;
};

export default axiosHelper;
