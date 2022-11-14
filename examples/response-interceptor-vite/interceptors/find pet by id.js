export const interceptor = (response) => {
    response.data.interceptor = "find pet by id";
    return response;
}