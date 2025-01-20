import React, { useState, useEffect } from "react";
import Papa from "papaparse"; 
import "./offers.css";

const CreditCardSearch = () => {
  const [cardData, setCardData] = useState([]); // Stores all the card data from the main CSV
  const [searchValue, setSearchValue] = useState(""); // Stores the search input value
  const [filteredCards, setFilteredCards] = useState([]); // Stores the filtered card names
  const [selectedCard, setSelectedCard] = useState(null); // Stores the selected card and its category
  const [offers, setOffers] = useState([]); // Stores the offers for the selected Visa type
  const [noResultsMessage, setNoResultsMessage] = useState(""); // Stores the message for invalid or incomplete card names

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
    setNoResultsMessage(""); // Clear previous results message

    if (value.length > 0) {
      const filtered = cardData.filter(
        (card) =>
          card["Credit Card Name"] && 
          card["Credit Card Name"].toLowerCase().includes(value)
      );
      setFilteredCards(filtered);

      if (filtered.length === 0) {
        setNoResultsMessage("No Offers Available on this credit card.");
      }
    } else {
      setFilteredCards([]);
      setOffers([]);
      setSelectedCard(null); // Clear card details
      setNoResultsMessage(""); // Clear message when input is cleared
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
    } else {
      setOffers([]); // Clear offers if no valid Visa type found
    }
  };

  return (
    <div className="container" style={styles.container}>
      {/* Navbar Component */}
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <a href="https://www.myrupaya.in/">
            <img
              src="https://static.wixstatic.com/media/f836e8_26da4bf726c3475eabd6578d7546c3b2~mv2.jpg/v1/crop/x_124,y_0,w_3152,h_1458/fill/w_909,h_420,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/dark_logo_white_background.jpg"
              alt="MyRupaya Logo"
              style={styles.logo}
            />
          </a>
          {/* Move the links here */}
          <div style={styles.linksContainer}>
            <a href="https://www.myrupaya.in/" style={styles.link}>
              Home
            </a>
          </div>
        </div>
      </nav>

      <h1>Card Offers</h1>

      {/* Centered Search Box and Dropdown */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchInput}
          placeholder="Enter credit card name"
          autoComplete="off"
          className="search-input"
          style={styles.searchInput}
        />

        {/* Dropdown to display matching cards */}
        {filteredCards.length > 0 && (
          <ul className="dropdown" style={styles.dropdown}>
            {filteredCards.map((card, index) => (
              <li
                key={index}
                onClick={() => displayCardCategory(card["Credit Card Name"])}
                className="dropdown-item"
                style={styles.dropdownItem}
              >
                {card["Credit Card Name"]}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* No offers message if no valid card is selected */}
      {noResultsMessage && !selectedCard && (
        <p className="no-results-message">{noResultsMessage}</p>
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
      {offers.length > 0 && selectedCard && (
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#CDD1C1",
    width: "100%",
    padding : "10px"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "100px",
    height: "100px",
    marginRight: "20px",
  },
  linksContainer: {
    display: "flex",
    gap: "35px",
    flexWrap: "wrap",
    marginLeft: "40px", // Adjust spacing from the logo
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "18px", // Increased font size
    fontFamily: "Arial, sans-serif",
    transition: "color 0.3s ease", // Smooth transition effect
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  searchInput: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    width: "80%",
    maxWidth: "500px",
  },
  dropdown: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    backgroundColor: "#f1f1f1",
    width: "80%",
    maxWidth: "500px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default CreditCardSearch;
