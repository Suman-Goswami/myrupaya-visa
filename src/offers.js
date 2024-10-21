import React, { useState, useEffect } from "react";
import Papa from "papaparse"; 
import "./offers.css";

const CreditCardSearch = () => {
  const [cardData, setCardData] = useState([]); // Stores all the card data from the main CSV
  const [searchValue, setSearchValue] = useState(""); // Stores the search input value
  const [filteredCards, setFilteredCards] = useState([]); // Stores the filtered card names
  const [selectedCard, setSelectedCard] = useState(null); // Stores the selected card and its category
  const [offers, setOffers] = useState([]); // Stores the offers for the selected Visa type

  // Fetch and parse the main CSV file containing card information
  useEffect(() => {
    Papa.parse("/Credit-Card-Products.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setCardData(results.data);
      },
      error: (error) => {
        console.error("Error fetching CSV:", error);
      },
    });
  }, []);

  // Handle search input and filter the card names
  const handleSearchInput = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);

    if (value.length > 0) {
      const filtered = cardData.filter(
        (card) =>
          card["Credit Card Name"] && 
          card["Credit Card Name"].toLowerCase().includes(value)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards([]);
    }
  };

  // Fetch and display offers for the selected Visa type
  const fetchVisaTypeOffers = (visaType) => {
    let fileName = "";
    
    // Map Visa type to corresponding CSV file
    switch (visaType) {
      case "Visa Gold":
        fileName = "/Visa Gold.csv";
        break;
      case "Visa Platinum":
        fileName = "/Visa Platinum.csv";
        break;
      case "Visa Signature":
        fileName = "/Visa Signature.csv";
        break;
      case "Visa Infinite":
        fileName = "/Visa Infinite.csv";
        break;
      default:
        fileName = "/Visa Standard.csv";
    }

    // Fetch the CSV file containing offers for the selected Visa type
    Papa.parse(fileName, {
      download: true,
      header: true,
      complete: (results) => {
        setOffers(results.data);
      },
      error: (error) => {
        console.error("Error fetching offers CSV:", error);
      },
    });
  };

  // Handle card selection and find its category
  const displayCardCategory = (creditCardName) => {
    const selected = cardData.find((card) => card["Credit Card Name"] === creditCardName);
    setSelectedCard(selected);
    setFilteredCards([]);
    setSearchValue(creditCardName);

    // Fetch offers based on the selected Visa type
    if (selected && selected["Visa type"]) {
      fetchVisaTypeOffers(selected["Visa type"]);
    }
  };

  return (
    <div className="container">
      <h1>Credit Card Category Finder</h1>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchInput}
        placeholder="Enter credit card name"
        autoComplete="off"
        className="search-input"
      />

      {/* Dropdown to display matching cards */}
      {filteredCards.length > 0 && (
        <ul className="dropdown">
          {filteredCards.map((card, index) => (
            <li key={index} onClick={() => displayCardCategory(card["Credit Card Name"])} className="dropdown-item">
              {card["Credit Card Name"]}
            </li>
          ))}
        </ul>
      )}

      {/* Display card category if a card is selected */}
      {selectedCard && (
        <div className="card-details">
          <h2>Card Details</h2>
          <p>
            <strong>Card Name:</strong> {selectedCard["Credit Card Name"]}
          </p>
          <p>
            <strong>Visa Type:</strong> {selectedCard["Visa type"] || "No category found"}
          </p>
          <p>
            <strong>Rating:</strong> {selectedCard["Rating"] || "No rating available"}
          </p>
        </div>
      )}

      {/* Display offers if any Visa type is selected */}
      {offers.length > 0 && (
        <div className="offers-section">
          <h2>{selectedCard["Visa type"]} Offers</h2>
          <div className="offer-cards">
            {offers.map((offer, index) => (
              <div key={index} className="offer-card">
                <img src={offer["Image"]} alt={offer["Title"]} className="offer-image" />
                <div className="offer-details">
                  <h3>{offer["Title"]}</h3>
                  <a href={offer["Link"]} target="_blank" rel="noopener noreferrer" className="offer-link">
                    View Offer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCardSearch;
