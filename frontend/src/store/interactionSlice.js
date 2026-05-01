import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  form: {
    hcp_name: "",
    specialty: "",
    interaction_type: "Meeting",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    attendees: "",
    products_discussed: "",
    materials_shared: "",
    samples_distributed: "",
    sentiment: "Neutral",
    outcomes: "",
    follow_up_date: "",
    notes: "",
  },
  chatMessages: [],
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    updateForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },

    setForm(state, action) {
      state.form = action.payload;
    },

    addChatMessage(state, action) {
      state.chatMessages.push(action.payload);
    },

    clearChat(state) {
      state.chatMessages = [];
    },
  },
});

export const { updateForm, setForm, addChatMessage } =
  interactionSlice.actions;

export default interactionSlice.reducer;