import axios from "axios";
import { useDispatch } from "react-redux";
import { setFormData } from "../store/interactionSlice";
import { useState } from "react";

export default function ChatLogger() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const send = async () => {
  if (!message.trim()) return;

  try {
    const res = await axios.post("http://127.0.0.1:8000/chat", {
      message,
    });

    console.log("AI Response:", res.data);

    dispatch(setFormData(res.data));

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <h3>Chat</h3>
      <textarea onChange={(e) => setMessage(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}