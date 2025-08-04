import BaseApi from "../Baseapi";

const KeysEndpoint = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserKeys: builder.query({
            query: () => ({
                url: "/keys/user",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        }),
        
        createKey: builder.mutation({
            query: (keyData) => ({
                url: "/keys/create",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
                body: keyData
            })
        }),
        
        deleteKey: builder.mutation({
            query: (keyId) => ({
                url: `/keys/${keyId}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        }),
        
        updateKey: builder.mutation({
            query: ({ keyId, keyData }) => ({
                url: `/keys/${keyId}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
                body: keyData
            })
        }),
        
        getUserProfile: builder.query({
            query: () => ({
                url: "/user/profile",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        })
    })
});

const keys = {
    getUserKeys: KeysEndpoint.useGetUserKeysQuery,
    createKey: KeysEndpoint.useCreateKeyMutation,
    deleteKey: KeysEndpoint.useDeleteKeyMutation,
    updateKey: KeysEndpoint.useUpdateKeyMutation,
    getUserProfile: KeysEndpoint.useGetUserProfileQuery
}

export default keys; 