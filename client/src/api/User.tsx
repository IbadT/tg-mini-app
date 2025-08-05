import BaseApi from "../Baseapi";

const UserEndpoint = BaseApi.injectEndpoints({
    endpoints: (builder)=> ({
        LoginUser: builder.mutation({
            query: (arg)=>({
                url: "/users/login",
                method: "POST",
                body: arg
            })
        }),
        GetUserProfile: builder.query({
            query: () => ({
                url: "/users/profile",
                method: "GET"
            })
        })
    })
});

const user = {
    LoginUser: UserEndpoint.useLoginUserMutation,
    GetUserProfile: UserEndpoint.useGetUserProfileQuery
}

export default user;