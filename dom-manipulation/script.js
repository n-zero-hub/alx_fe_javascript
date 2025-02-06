
document.addEventListener('DOMContentLoaded', function ()  {

    let quotes = [
        {
            text: "The only way to do great work is to love what you do.",
            category: "Inspiration"
          },
          {
            text: "Life is what happens when you're busy making other plans.",
            category: "Life"
          },
          {
            text: "Success is not the key to happiness. Happiness is the key to success.",
            category: "Motivation"
          }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const showNewQuote = document.getElementById("newQuote");

// show Random Quote
    const showRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteDisplay.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><em>${randomQuote.category}</em></p>
        `;        
    };

    showNewQuote.addEventListener('click', () => {
        showRandomQuote();
    });

//creating and adding new Quotes
    const  createAddQuoteForm = () => {
        const addQuoteContainer = document.getElementById("addquote");
        if (!addQuoteContainer) return;

        const inputText = document.createElement("textarea");
        inputText.id = "newQuoteText";
        inputText.type = "text";
        inputText.rows = "3";
        inputText.cols = "40";
        inputText.placeholder = "Enter a new quote";

        const inputCategory = document.createElement("input");
        inputCategory.id = "newQuoteCategory";
        inputCategory.type = "text";
        inputCategory.placeholder = "Enter quote category";

        const addQuoteButton = document.createElement("button");
        addQuoteButton.id = "addQuote"
        addQuoteButton.textContent = "Add Quote";

        addQuoteContainer.appendChild(inputText);
        addQuoteContainer.appendChild(inputCategory);
        addQuoteContainer.appendChild(addQuoteButton);
        
    };
createAddQuoteForm();

//Handling New Quote Submissions
const addQuote = () => {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
    
    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both quote and category!");
        return;
    }

    const isNewCategory = !quotes.some(quote => quote.category === quoteCategory);

    quotes.push({ text: quoteText, category: quoteCategory });

    
    saveQuotesToLocalStorage();

    if (isNewCategory) {
        populateCategories();
    }

    showRandomQuote();

    // Reset input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("The quote has been added.");

};

// saving quotes to a local storage
const saveQuotesToLocalStorage = () => {
    localStorage.setItem("quotes", JSON.stringify(quotes)); 
};

document.getElementById("addQuote").addEventListener("click", () => {
    addQuote();
    alert("The quote has been added.");

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();
})
 
// Loading quotes from Local Storage

const loadQuotesFromLocalStorage = () => {
    const savedQuotes = localStorage.getItem("quotes"); 
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes); 
    }
};

// Attach the event listener to the addQuote button after the form has been created
const attachAddQuoteListener = () => {
    const addQuoteButton = document.getElementById("addQuote");
    if (addQuoteButton) {
        addQuoteButton.addEventListener("click", () => {
            addQuote();
            alert("The quote has been added.");

            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";

            showRandomQuote();
        });
    }
};

loadQuotesFromLocalStorage();
attachAddQuoteListener();
showRandomQuote();

// Export quotes to JSON file
const exportQuotesToJson = () => {
    const quotesBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(quotesBlob);
    downloadLink.download = "quotes.json";
    downloadLink.click();
  };

  // Add event listener for exporting quotes
  document.getElementById("exportQuotes").addEventListener("click", exportQuotesToJson);

  // Import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotesToLocalStorage();
      alert('Quotes imported successfully!');
      showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
  }

// Implement Filtering Logic in JavaScript
const populateCategories = () => {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    const categories = [...new Set(quotes.map(quote => quote.category))];

    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    restoreLastSelectedCategory();
};

//Filter Quotes Based on Selected Category

const filterQuotes = () => {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");

    if (selectedCategory === "all") return;
    // Clear previous quotes
    quoteDisplay.innerHTML = "";

    // Filter quotes based on selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    // Display filtered quotes
    if (filteredQuotes.length > 0) {
        filteredQuotes.forEach(quote => {
            const quoteElement = document.createElement("p");
            quoteElement.innerHTML = `"${quote.text}" <br> <em>${quote.category}</em>`;
            quoteDisplay.appendChild(quoteElement);
        });
    } else {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    }

    // Save selected category in local storage
    localStorage.setItem("selectedCategory", selectedCategory);
};

// Restore last selected category from local storage
const restoreLastSelectedCategory = () => {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        document.getElementById("categoryFilter").value = savedCategory;
        filterQuotes(); // Apply filter on page load
    }
};

restoreLastSelectedCategory();

// Event listener for category change
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Initialize categories and filtering on page load
populateCategories();

//Fetching Quotes from the Server (Simulated)

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated API for fetching quotes

//////////////////////////////////////////////////////////////---------/////////

// Fetch quotes from server (simulated)
const fetchQuotesFromServer = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Simulating categories (random assignment for this demo)
        const fetchedQuotes = data.slice(0, 10).map((post, index) => ({
            text: post.title,
            category: index % 2 === 0 ? "Inspiration" : "Motivation",
        }));

        // Sync local quotes with server data
        syncQuotesWithServer(fetchedQuotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

//-------------------------------------------------------------------//

//Posting New Quotes to the Server

const postQuoteToServer = async (newQuote) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(newQuote),
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();
        console.log("Quote saved on server:", result);
    } catch (error) {
        console.error("Error posting quote:", error);
    }
};

 // ------------------------------------------------------------//

//Implement Data Syncing

let localQuotes = [];  // Simulated local quotes

const syncQuotesWithServer = (fetchedQuotes) => {
    // Simulate checking if the local data is out of sync with the server
    const serverQuoteIds = fetchedQuotes.map(q => q.text);  // Using 'text' as unique ID

    // Merge new server data if discrepancies exist
    const mergedQuotes = [...fetchedQuotes, ...localQuotes.filter(local => !serverQuoteIds.includes(local.text))];
    
    // Sync local storage and update UI
    localQuotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    displayQuotes();  // Function to display quotes on the UI
};

// ----------------------------//

//Handling Conflicts
 
let conflictResolved = false;

const notifyConflict = () => {
    const conflictAlert = document.createElement("div");
    conflictAlert.textContent = "Data conflict detected. The server's data has been prioritized.";
    conflictAlert.classList.add("alert", "alert-warning");
    document.body.appendChild(conflictAlert);

    // Offer the user an option to resolve conflicts manually
    const resolveButton = document.createElement("button");
    resolveButton.textContent = "Resolve Conflict";
    resolveButton.addEventListener("click", () => {
        resolveConflict();
    });
    document.body.appendChild(resolveButton);
};

const resolveConflict = () => {
    // Manually resolve conflict (e.g., allowing the user to choose between server or local data)
    conflictResolved = true;
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    alert("Conflict resolved and local data synced.");
};

//------------------------------------------//

//Periodic Data Fetching and UI Updates

const startAutoSync = () => {
    setInterval(() => {
        console.log("Fetching new quotes...");
        fetchQuotesFromServer();  // Fetch new data from server
    }, 30000); // Fetch new quotes every 30 seconds
};

startAutoSync();



});



