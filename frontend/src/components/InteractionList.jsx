import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function InteractionList() {
  const [interactions, setInteractions] = useState([]);

  const loadInteractions = async () => {
    try {
      const response = await axios.get(`${API_URL}/interactions`);
      setInteractions(response.data);
    } catch (error) {
      console.error(error);
      alert("Could not load interactions.");
    }
  };

  return (
    <div className="card list-card">
      <div className="list-header">
        <h2>Saved Interactions</h2>
        <button onClick={loadInteractions}>Refresh</button>
      </div>

      {interactions.length === 0 ? (
        <p className="subtitle">No interactions loaded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>HCP</th>
              <th>Specialty</th>
              <th>Products</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {interactions.map((item) => (
              <tr key={item.id}>
                <td>{item.hcp_name}</td>
                <td>{item.specialty}</td>
                <td>{item.products_discussed}</td>
                <td>{item.follow_up_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InteractionList;