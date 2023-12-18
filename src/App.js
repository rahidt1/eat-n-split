import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([...initialFriends]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Add friend to friends list
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);

    setShowAddFriend(false);
  }

  // Show/hide Add friend component
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  // Select a friend
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));

    setShowAddFriend(false);
  }

  // Split bill
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriend.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FrindsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onFormAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FrindsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)} {}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you ${Math.abs(friend.balance)} {}
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          You and {friend.name} are even {}
        </p>
      )}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onFormAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID(); // Generate random unique id

    const newFriend = { name, image: `${image}?u=${id}`, balance: 0, id };

    onFormAddFriend(newFriend); // Add friend to frindlist

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👬 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
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
