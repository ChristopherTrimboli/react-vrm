import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import VRM from "./VRM";

const Multiplayer = () => {
    const [users, setUsers] = useState<Record<string, any>>({});
    const [ws, setWs] = useState<WebSocket>();
    const clientUserId = useMemo(() => uuidv4(), []);

    useEffect(() => {
        if (!ws) {
            // ws://localhost:80
            // wss://react-vrm.herokuapp.com/
            const webSocket = new WebSocket("wss://react-vrm.herokuapp.com/");
            setWs(webSocket);
        }
    }, [ws]);

    useEffect(() => {
        if (ws) {
            ws.addEventListener("open", (event) => {
                ws.send(JSON.stringify({
                    type: "position",
                    userId: clientUserId,
                    x: 0,
                    y: 0,
                    z: 0
                }));
            });

            ws.addEventListener("message", (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "users":
                        setUsers(data.users);
                        break;
                    default:
                        break;
                }
            });
        }
        return () => ws?.close();
    }, [ws])

    const handleUpdatePosition = (position: [number, number, number]) => {
        const [x, y, z] = position;
        ws?.send(JSON.stringify({
            type: "position",
            userId: clientUserId,
            x,
            y,
            z
        }));
    }

    return <>
        {
            Object.entries(users || {}).map(([userId, info]) => {
                return <VRM
                    url="vrms/setuna.vrm"
                    key={userId}
                    position={[info.x, info.y, info.z]}
                    updatePosition={handleUpdatePosition}
                    isClientUser={userId === clientUserId}
                />
            })
        }
    </>
}

export default Multiplayer;