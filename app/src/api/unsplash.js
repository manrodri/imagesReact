import axios from "axios";

export default axios.create({
    headers: {
        Authorization: 'Client-ID jBCZGI98kMmAlMCZftCdiey1a5uNU603NrOGPYaXwkQ'
    },
    baseURL: "https://api.unsplash.com"
})

