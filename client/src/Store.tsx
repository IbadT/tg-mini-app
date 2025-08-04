import { configureStore } from "@reduxjs/toolkit";
import BaseApi from "./Baseapi";

const Store = configureStore({
    reducer: {
        [BaseApi.reducerPath]: BaseApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BaseApi.middleware)
});

export default Store;