
document.addEventListener('DOMContentLoaded', function ()  {

    const quotes = [
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


        addQuoteContainer.append(inputText, inputCategory, addQuoteButton);
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

    let newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    quotes.push(newQuote);
    
    showRandomQuote();
};

document.getElementById("addQuote").addEventListener("click", () => {
    addQuote();
    alert("The quote has been added.");

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();
})
 
showRandomQuote();
});

