const fontSizeInput = document.getElementById('font-size');
const lineHeightInput = document.getElementById('line-height');
const contrastInput = document.getElementById('contrast');

const fontSizeVal = document.getElementById('font-size-val');
const lineHeightVal = document.getElementById('line-height-val');
const contrastVal = document.getElementById('contrast-val');

let debounceTimer = null;

function updateAccessibilitySettings() {
  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;
  const contrast = contrastInput.value;

  // Live CSS visual update
  document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
  document.documentElement.style.setProperty('--base-line-height', lineHeight);
  document.documentElement.style.setProperty('--base-contrast', `${contrast}%`);

  // Update UI text labels
  fontSizeVal.textContent = `${fontSize}px`;
  lineHeightVal.textContent = lineHeight;
  contrastVal.textContent = `${contrast}%`;

  // Debounce API calls to prevent flooding Flask during smooth slider movement
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    sendDataToFlask({
      fontSize: parseInt(fontSize),
      lineHeight: parseFloat(lineHeight),
      contrast: parseInt(contrast)
    });
  }, 300);
}

function sendDataToFlask(settings) {
  fetch('/accessibility/changer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  })
  .then(response => {
    if (!response.ok) {
      console.error('Failed to update settings on server.');
    }
  })
  .catch(error => console.error('Error:', error));
}

// Event Listeners for live slider updates
fontSizeInput.addEventListener('input', updateAccessibilitySettings);
lineHeightInput.addEventListener('input', updateAccessibilitySettings);
contrastInput.addEventListener('input', updateAccessibilitySettings);