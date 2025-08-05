import WebApp from "@twa-dev/sdk";
import logo from "../assets/logo.png";
import user from "../api/User";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
    const [trigger, { data, error, isLoading }] = user.LoginUser();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Splash: Starting login process");
        console.log("WebApp.initData:", WebApp.initData);
        trigger({ key: WebApp.initData });
    }, [trigger]);

    useEffect(() => {
        console.log("Splash: Data received:", data);
        console.log("Splash: Error:", error);
        console.log("Splash: Loading:", isLoading);
        
        if (data?.data?.token) {
            console.log("Splash: Token received, navigating to /app");
            sessionStorage.setItem("token", data.data.token);
            navigate("/app", { replace: true });
        }
    }, [data?.data?.token, navigate, data, error, isLoading]);

    return (
        <div style={{ background: `${WebApp.themeParams.bg_color}` }} className="flex items-center justify-center min-h-screen relative">
            <img src={logo} className="w-40" alt="logo from logo" />
            <span className="loading loading-spinner loading-lg absolute bottom-5 left-[50%] -translate-x-[50%]"></span>
        </div>
    );
};

export default Splash;