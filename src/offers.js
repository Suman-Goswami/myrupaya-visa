import React, { useState, useEffect } from "react";
import Papa from "papaparse"; 
import "./offers.css";

const CreditCardSearch = () => {
  const [cardData, setCardData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [offers, setOffers] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchValue]);

  // Fetch and parse the main CSV file
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

  // Filter cards based on search terms
  useEffect(() => {
    if (debouncedSearchValue.length > 0) {
      const searchTerms = debouncedSearchValue.toLowerCase().split(' ');
      
      const filtered = cardData.filter((card) => {
        if (!card["Credit Card Name"]) return false;
        const cardNameLower = card["Credit Card Name"].toLowerCase();
        return searchTerms.every(term => cardNameLower.includes(term));
      });

      setFilteredCards(filtered);
      setNoResultsMessage(filtered.length === 0 ? "No Offers Available on this credit card." : "");
    } else {
      setFilteredCards([]);
      setNoResultsMessage("");
    }
  }, [debouncedSearchValue, cardData]);

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setSelectedCard(null);
    setOffers([]);
  };

  const fetchVisaTypeOffers = (visaType) => {
    let fileName = "";
    
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

  const displayCardCategory = (creditCardName) => {
    const selected = cardData.find((card) => card["Credit Card Name"] === creditCardName);
    setSelectedCard(selected);
    setSearchValue(creditCardName);

    if (selected && selected["Visa type"]) {
      fetchVisaTypeOffers(selected["Visa type"]);
    } else {
      setOffers([]);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <a href="https://www.myrupaya.in/">
            <img
              src="https://static.wixstatic.com/media/f836e8_26da4bf726c3475eabd6578d7546c3b2~mv2.jpg/v1/crop/x_124,y_0,w_3152,h_1458/fill/w_909,h_420,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/dark_logo_white_background.jpg"
              alt="MyRupaya Logo"
              style={styles.logo}
            />
          </a>
          <div style={styles.linksContainer}>
            <a href="https://www.myrupaya.in/" style={styles.link}>
              Home
            </a>
          </div>
        </div>
      </nav>

      <h1>Card Offers</h1>

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

      {noResultsMessage && !selectedCard && (
        <p className="no-results-message">{noResultsMessage}</p>
      )}

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

      {offers.length > 0 && selectedCard && (
        <div className="offers-section">
          <h2>{selectedCard["Visa type"]} Offers</h2>
          <div className="offer-cards">
            {offers.map((offer, index) => (
              <div key={index} className="offer-card">
                <img src={offer["Image"]} alt={offer["Title"]} className="offer-image" />
                <div className="offer-details">
                  <h3>{offer["Title"]}</h3>
               <button>   <a href={offer["Link"]} target="_blank" rel="noopener noreferrer" className="offer-link">
                    View Offer
                  </a> </button> 
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
    padding: "10px"
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
    marginLeft: "40px",
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "18px",
    fontFamily: "Arial, sans-serif",
    transition: "color 0.3s ease",
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
    "&:hover": {
      backgroundColor: "#ddd",
    }
  },
};

export default CreditCardSearch;