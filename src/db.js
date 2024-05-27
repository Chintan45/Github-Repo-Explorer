
const github = {
    baseURL: process.env.REACT_APP_BASE_URL,
    headers:  {
        "Content-Type": "application/json",
        Authorization: process.env.REACT_APP_AUTH_TOKEN,
    }
}

export default github;