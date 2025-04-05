import React from "react";

interface ProgressBarLoaderProps {
    LoadingText?: string;
    secondCounter?: number;
}

const ProgressBarLoader: React.FC<ProgressBarLoaderProps> = ({
    LoadingText,
    secondCounter = 5, // Default duration as 5 seconds if not provided
}) => {
    return (
        <div className="page-loader fixed inset-0 flex items-center justify-center z-50">
            <div className="loader_wrap max-w-md w-full bg-white p-4 pt-6 text-center shadow-xl rounded">
                <div className="loader-strip bg-gray-200 rounded-full w-full h-2 mb-4">
                    <div
                        className="load-line rounded-full bg-primary"
                        style={{
                            width: '0%',
                            animation: `loaderAnim ${secondCounter}s linear forwards`,
                        }}
                    ></div>
                </div>
                {LoadingText && (
                    <div className="loading-text text-sm text-secondary">{LoadingText}</div>
                )}
            </div>
        </div>
    );
};

export default ProgressBarLoader;
