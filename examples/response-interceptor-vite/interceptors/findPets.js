export const interceptor = (response) => {
    response.data[0].interceptor = "findPets";
    return response;
}