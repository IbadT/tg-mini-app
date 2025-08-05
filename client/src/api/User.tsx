import BaseApi from "../Baseapi";

const UserEndpoint = BaseApi.injectEndpoints({
    endpoints: (builder)=> ({
        LoginUser: builder.mutation({
            query: (arg)=>({
                url: "/users/login",
                method: "POST",
                body: arg
            }),
            transformResponse: (response: { token: string }) => {
                console.log("API Response:", response);
                // RTK Query ожидает data в ответе
                return { data: response };
            },
            transformErrorResponse: (response: { status: number; data: string }) => {
                console.log("API Error Response:", response);
                return response;
            }
        })
    })
});

const user = {
    LoginUser: UserEndpoint.useLoginUserMutation
}

export default user;