import { useSelector } from "react-redux";
import axios from "axios";

export default function Form() {
  const data = useSelector((state) => state.interaction.formData);

  const save = async () => {
    await axios.post("http://127.0.0.1:8000/save", data);
    alert("Saved");
  };

  return (
    <div>
      <h3>Auto-filled Form</h3>

      <input value={data.hcp_name || ""} placeholder="HCP Name" readOnly />
      <input value={data.specialty || ""} placeholder="Specialty" readOnly />
      <input value={data.products_discussed || ""} placeholder="Products" readOnly />
      <input value={data.follow_up_date || ""} placeholder="Follow Up" readOnly />
      <textarea value={data.notes || ""} placeholder="Notes" readOnly />

      <button onClick={save}>Save</button>
    </div>
  );
}