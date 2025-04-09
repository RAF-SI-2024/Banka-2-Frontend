import React from "react";
import "@/style/Loader.css";

const Loader: React.FC = () => {
    return (
        <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Loader;
