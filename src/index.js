async function analyzeName(name) {
  var resultsDiv = document.getElementById("nationality-results");
  var errorMessageDiv = document.getElementById("error-message");
  var analyzeButton = document.querySelector("button");

  analyzeButton.textContent = "Fetching data...";
  analyzeButton.disabled = true;

  resultsDiv.innerHTML = "";
  errorMessageDiv.textContent = "";

  var getCountryNames = new Intl.DisplayNames(['en'], { type: 'region' });

  try {
    var response = await fetch("https://api.nationalize.io/?name=" + name);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    var data = await response.json();
    var topCountry = data.country[0];

    if (!topCountry) {
      resultsDiv.innerHTML = "<p>No nationality data found for \"" + name + "\".</p>";
    } else {
      var countryCode = topCountry.country_id;
      var countryName = getCountryNames.of(countryCode);
      var capitalizedName = name[0].toUpperCase() + name.substring(1);

      resultsDiv.innerHTML = "<p><strong>"+ capitalizedName + "</strong>  is likely from <strong>" + countryName + "</strong> with <strong>" + (topCountry.probability * 100).toFixed(2) + "%</strong> certainty.</p>";
    }
  } catch (error) {
    errorMessageDiv.textContent = "An error occurred: " + error.message;
  } finally {
    analyzeButton.textContent = "Analyze";
    analyzeButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("form");
  var nameInput = document.getElementById("name");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameInput.value;
    if (name !== "") {
      analyzeName(name);
    }
  });
});
