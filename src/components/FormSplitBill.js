import { useState } from "react";
import Button from "./Button";

export default function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleBill(bill) {
    if (!bill) return;

    setBill(bill);
  }

  function handlePaidByUser(expense) {
    if (!expense) return;

    setPaidByUser(expense > bill ? paidByUser : expense);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    // If bill is paid by user, then friend owes user the money he spent, so its positive in this case, else negative
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Bill With {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => handleBill(+e.target.value)}
      />
      <label>🕴 Your Expanse</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => handlePaidByUser(+e.target.value)}
      />
      <label>👬 {selectedFriend.name}'s Expanse</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who's paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
