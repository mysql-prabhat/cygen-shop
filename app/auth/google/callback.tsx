import { useEffect } from "react";

export default function Callback() {

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("accessToken");
    console.log("Received:", token);

        // save token
        localStorage.setItem("token", token);

        // redirect to dashboard
        window.location.href = "/products";
    
  }, []);

  return <h1>Logging you in...</h1>;
}
