import { useEffect } from "react";
import { Outlet } from "react-router";
import useToast from "../hooks/useToast";
import axios from "../API/axios";
import useSearch from "../hooks/useSearch";

function SearchLayout() {
    const { setProducts } = useSearch();
    const { setToastMessage } = useToast();

    const getProducts = async () => {
        try {
            const resp = await axios.get("/api/product/viewAll-product");
            setProducts(resp.data);
        } catch (error) {
            setToastMessage({
                variant: "danger",
                message: "Failed to fetch data"
            });
        }
    };

    useEffect(() => {
        getProducts();
        const intervalId = setInterval(getProducts, 300000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);  

    return <Outlet />;
}

export default SearchLayout;