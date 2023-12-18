import { useState } from "react";
import Button from "./Button";
import FrindsList from "./FrindsList";
import FormAddFriend from "./FormAddFriend";
import FormSplitBill from "./FormSplitBill";

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

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Add friend to friends list
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);

    setShowAddFriend(false); // Hides FromAddFriend component
  }

  // Show/hide Add friend component
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  // Select a friend
  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));

    setShowAddFriend(false); // Hides FromAddFriend component
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

    setSelectedFriend(null); // Hides FromSplitBill component
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
