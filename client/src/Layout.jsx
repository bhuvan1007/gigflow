import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import CursorParticles from "./components/CursorParticles";
import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const Layout = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) {
            const socket = io("http://localhost:8800");
            const notificationQueue = [];

            socket.emit("addUser", currentUser._id);

            const showNotification = (message) => {
                toast.success(message, {
                    duration: 5000,
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            };

            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible' && notificationQueue.length > 0) {
                    notificationQueue.forEach(msg => showNotification(msg));
                    notificationQueue.length = 0; // Clear queue
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            socket.on("notification", (data) => {
                // 1. Dispatch event so Gig page knows to refresh
                window.dispatchEvent(new Event("gigJobUpdate"));

                // 2. Handle Notification
                if (document.hidden) {
                    notificationQueue.push(data.message);
                } else {
                    showNotification(data.message);
                }
            });

            return () => {
                socket.disconnect();
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [currentUser]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
            {/* Particles Background - z-0 to be behind cards but above body background if body is transparent. 
                 Since bg-gray-50 is on this div, particles should be inside. 
                 CursorParticles has fixed position, so it overlays viewport. 
                 To make it behind cards (which are in Outlet), we rely on z-index.
                 CursorParticles has z-0. Outlet content needs z-1 relative.
             */}
            <CursorParticles />
            <div className="relative z-10">
                <Navbar />
                <div className="max-w-7xl mx-auto p-6 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
