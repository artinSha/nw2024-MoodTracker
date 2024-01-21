/**
 * GLOBAL VARIABLES
 *
 * lastClickedAnchor: This variable is used to help us store the id of the last clicked day bubble (which is an anchor tag) so that we can change its color based on the mood rating the user gave
 */
let lastClickedAnchor = 0;
let redColor = "#EA616B";
let orangeColor = "#EF8551";
let yellowColor = "#FBD237";
let lightGreenColor = "#9DE26E";
let darkGreenColor = "#7ED284";

// ? START HELPER FUCNTIONS

/**
 * Function
 * Sets color of text and background in a day bubble to a certain color
 * Also removes the blue border on unfilled in bubble
 */
function setDayBubbleColor(elementParam, colorParam) {
     elementParam.style.color = colorParam;
     elementParam.style.backgroundColor = colorParam;
     elementParam.style.border = "0px";
}

/**
 * This functon closes the popup and resets background opacity to 100%
 */
function closeAndResetFormAndResetOpacity() {
     document.getElementById("popup-new-submission").style.visibility = "hidden";
     document.getElementById("popup-new-submission-form").reset();

     const elementsToBlur = document.querySelectorAll(".blur");

     elementsToBlur.forEach((element) => {
          element.style.filter = "opacity(100%)";
     });
}

// ? END HELPER FUNCTIONS

/**
 * On page load, parse through local storage to see if there are existing entries
 * If so, color in the bubbles as necessary
 */
window.onload = function () {
     // Retrieving info from the local storage
     const retrievedFormDataLocalStorage = JSON.parse(localStorage.getItem("formData"));

     // This if statement is to check if there's anything in local storage. If yes, it will run what comes after, if not, nothing will run
     if (retrievedFormDataLocalStorage) {
          retrievedFormDataLocalStorage.forEach((entry) => {
               const date = document.getElementById(entry.date);
               if (entry.moodRating == 1) {
                    setDayBubbleColor(date, redColor);
               } else if (entry.moodRating == 2) {
                    setDayBubbleColor(date, orangeColor);
               } else if (entry.moodRating == 3) {
                    setDayBubbleColor(date, yellowColor);
               } else if (entry.moodRating == 4) {
                    setDayBubbleColor(date, lightGreenColor);
               } else {
                    setDayBubbleColor(date, darkGreenColor);
               }
          });
     }
};

/**
 * Function
 * @param clickedAnchor
 * This function turns the popup visible once the user has clicked on one of the day bubbles
 * It stores the bubble's clicked id in the global variable lastClickedAnchor for use in the submitNewSubmissionFromPopup
 * Blurs
 */
function showPopup(clickedAnchor) {
     document.getElementById("popup-new-submission").style.visibility = "visible";
     lastClickedAnchor = clickedAnchor.id;

     const elementsToBlur = document.querySelectorAll(".blur");

     elementsToBlur.forEach((element) => {
          element.style.filter = "opacity(20%)";
     });
}

/**
 * Function
 * This function grabs the input value from the form for the user
 * Afterwards, it changes the day bubble's color to a number corresponding to the user's mood rating
 * Turns the popup form back invisible and resets its field so it won't be pre-populated when reshown
 * Finally, it saves the form data to localstorage using the function saveFormDataToLocalStorage()
 */
function submitNewSubmissionFromPopup() {
     // Prevent page refresh
     event.preventDefault();

     // Grabbing MONTH data
     let month = document.getElementById("month-header").textContent;

     // Grabbing the DATE data
     let date = lastClickedAnchor;

     // Grabbing the YEAR data
     let year = document.getElementById("year-header").textContent;

     // Grabbing FORM data
     let moodRating = document.querySelector('input[name="daily-mood-rating"]:checked').value;
     let impactCheckedCheckboxes = document.querySelectorAll('input[name="impact"]:checked');
     let impactArray = Array.from(impactCheckedCheckboxes).map((checkbox) => checkbox.value);
     let journalEntry = document.querySelector('textarea[name="journal"]').value;

     // Grab currently clicked bubble's id
     let currentId = document.getElementById(lastClickedAnchor);

     // Changes the bubble to a color according to the mood rating by the user
     if (moodRating == 1) {
          setDayBubbleColor(currentId, redColor);
     } else if (moodRating == 2) {
          setDayBubbleColor(currentId, orangeColor);
     } else if (moodRating == 3) {
          setDayBubbleColor(document.getElementById(lastClickedAnchor), yellowColor);
     } else if (moodRating == 4) {
          setDayBubbleColor(currentId, lightGreenColor);
     } else {
          setDayBubbleColor(currentId, darkGreenColor);
     }

     // Turn popup back invisible and reset its fields
     closeAndResetFormAndResetOpacity();

     saveFormDataToLocalStorage(month, date, year, moodRating, impactArray, journalEntry);
}

/**
 * This function saves the user input from the form to localstorage
 * @param {*} moodRatingParam
 * @param {*} impactArrayParam
 * @param {*} journalEntryParam
 */
function saveFormDataToLocalStorage(monthParam, dateParam, yearParam, moodRatingParam, impactArrayParam, journalEntryParam) {
     // Get existing data from localStorage
     const existingData = JSON.parse(localStorage.getItem("formData")) || [];

     // Get form data
     const formData = {
          month: monthParam,
          date: dateParam,
          year: yearParam,
          moodRating: moodRatingParam,
          impactArray: impactArrayParam,
          journalEntry: journalEntryParam,
     };

     // Append the new data to existing data
     existingData.push(formData);

     // Save data to localStorage
     localStorage.setItem("formData", JSON.stringify(existingData));
}

/**
 * This function exports the data from localstorage as a CSV file
 */
function exportToCSV() {
     // Get data from localStorage
     const existingDataString = localStorage.getItem("formData");
     const existingData = existingDataString ? JSON.parse(existingDataString) : [];

     if (existingData.length === 0) {
          alert("No data to export!");
          return;
     }

     // Convert data to CSV format
     const csvContent =
          "data:text/csv;charset=utf-8," +
          Object.keys(existingData[0]).join(",") +
          "\n" +
          existingData
               .map((entry) =>
                    Object.values(entry)
                         .map((value) => JSON.stringify(value))
                         .join(",")
               )
               .join("\n");

     // Create a CSV file link and trigger download
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "formData.csv");
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
}
