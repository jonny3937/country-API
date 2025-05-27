async function analyzeName(name) {
  const resultsDiv = document.getElementById("nationality-results");
  const errorMessageDiv = document.getElementById("error-message");
  const analyzeButton = document.querySelector("button");

  analyzeButton.textContent = "Fetching data...";
  analyzeButton.disabled = true;

  resultsDiv.innerHTML = "";
  errorMessageDiv.textContent = "";

  const getCountryNames = new Intl.DisplayNames(['en'], { type: 'region' });

  try {
    const response = await fetch(`https://api.nationalize.io/?name=${(name)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const topCountry = data.country[0];

    if (!topCountry) {
      resultsDiv.innerHTML = `<p>No nationality data found for "${name}".</p>`;
    } else {
      const countryCode = topCountry.country_id;
      const countryName = getCountryNames.of(countryCode) || countryCode;
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      resultsDiv.innerHTML = `<p>${capitalizedName} is likely from <strong>${countryName}</strong> with <strong>${(topCountry.probability * 100).toFixed(2)}%</strong> certainty.</p>`;
    }
  } catch (error) {
    errorMessageDiv.textContent = "An error occurred: " + error.message;
  } finally {
    analyzeButton.textContent = "Analyze";
    analyzeButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const nameInput = document.getElementById("name");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (name) {
      analyzeName(name);
    }
  });
});
