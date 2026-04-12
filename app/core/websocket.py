import json
from fastapi import WebSocket
from typing import Dict, List
import uuid

class ConnectionManager:
    def __init__(self):
        # active_connections: user_id -> List[WebSocket]
        # Using a list because a user might have multiple tabs open
        self.active_connections: Dict[uuid.UUID, List[WebSocket]] = {}

    async def connect(self, user_id: uuid.UUID, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: uuid.UUID, websocket: WebSocket):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: uuid.UUID):
        if user_id in self.active_connections:
            # Send to all active tabs for this user
            message_json = json.dumps(message, default=str)
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message_json)
                except Exception:
                    # In case of broken connection that hasn't cleaned up yet
                    pass

# Global instance
manager = ConnectionManager()
