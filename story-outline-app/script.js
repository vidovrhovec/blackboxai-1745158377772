document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('storyForm');

  // Simulate AI response generation based on section and inputs
  function generateAIResponse(section, inputs) {
    switch (section) {
      case 'brainstorm':
        return `Generated ${inputs.brainstormNumber} high-concept pitches for a bestselling ${inputs.brainstormGenre} story with unique twists, intriguing characters, and gripping emotional stakes.`;
      case 'outline':
        return `Story synopsis for a ${inputs.outlineGenre} book based on pitch:\n${inputs.outlinePitch}\n\nDetailed summary using ${inputs.outlineMethod} method, broken into ${inputs.outlineChaptersNumber || 'N/A'} chapters.\n\nAdditional details fleshed out from synopsis:\n${inputs.outlineSynopsis}`;
      case 'setting':
        return `Potential locations, weather conditions, culture, technology, magic systems, symbols, and economy details for a novel about:\n${inputs.settingSynopsis}`;
      case 'character':
        return `Character possibilities, profiles, conflicts, strengths, and flaws for a novel based on summary:\n${inputs.characterSummary}`;
      case 'writing':
        return `1000 words of a chapter in genre ${inputs.writingGenre} with tone ${inputs.writingTone}, POV ${inputs.writingPOV}, setting ${inputs.writingSetting}, key characters:\n${inputs.writingCharacters}\nSummary:\n${inputs.writingSummary}\nConflict:\n${inputs.writingConflict}\n\n(Realistic dialogue, deep point of view, show don’t tell.)`;
      case 'editing':
        return `Editing suggestions for genre ${inputs.editingGenre}:\n- Stronger hook and opening paragraph for scene:\n${inputs.editingScene}\n- More description for paragraph:\n${inputs.editingParagraph}\n- Expanded text with more dialogue:\n${inputs.editingText}\n- Proofread according to style guide: ${inputs.editingStyleGuide}`;
      case 'title':
        return `Potential titles and improved book descriptions for a ${inputs.titleGenre} novel based on pitch/theme:\n${inputs.titlePitchTheme}\nCurrent description:\n${inputs.titleDescription}`;
      default:
        return 'No AI response available for this section.';
    }
  }

  // Handle generate button clicks
  form.querySelectorAll('.generate-btn').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.getAttribute('data-section');
      const outputEl = document.getElementById(section + 'Output');

      // Gather inputs for the section
      const inputs = {};
      form.querySelectorAll(`[name^="${section}"]`).forEach(input => {
        inputs[input.name] = input.value.trim();
      });

      // Validate required inputs for some sections
      if (section === 'brainstorm') {
        if (!inputs.brainstormNumber || !inputs.brainstormGenre) {
          outputEl.textContent = 'Please enter both number and genre.';
          return;
        }
      }

      // Generate AI response (simulated)
      const response = generateAIResponse(section, inputs);
      outputEl.textContent = response;
    });
  });

  // Download functionality for generated content
  function downloadContent(section, format) {
    const outputEl = document.getElementById(section + 'Output');
    const content = outputEl.textContent.trim();
    if (!content) {
      alert('No content to download for ' + section);
      return;
    }
    if (format === 'md') {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${section}-output.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Use jsPDF to generate PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - margin * 2;
      const lines = doc.splitTextToSize(content, maxLineWidth);
      doc.text(lines, margin, 20);
      doc.save(`${section}-output.pdf`);
    }
  }

  // Handle download button clicks
  form.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.getAttribute('data-section');
      const format = button.getAttribute('data-format');
      downloadContent(section, format);
    });
  });

  // Modal and API settings logic
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const apiSettingsForm = document.getElementById('apiSettingsForm');
  const refreshModelsBtn = document.getElementById('refreshModelsBtn');
  const modelSelect = document.getElementById('modelSelect');
  const apiEndpointInput = document.getElementById('apiEndpoint');
  const apiKeyInput = document.getElementById('apiKey');

  // Store API config in memory
  let apiConfig = {
    endpoint: '',
    key: '',
    models: [],
    selectedModel: ''
  };

  // Open modal
  settingsBtn.addEventListener('click', () => {
    initModal();
    settingsModal.classList.remove('opacity-0', 'pointer-events-none');
  });

  // Close modal function
  function closeModal() {
    settingsModal.classList.add('opacity-0', 'pointer-events-none');
  }

  closeModalBtn.addEventListener('click', closeModal);
  cancelSettingsBtn.addEventListener('click', closeModal);

  // Save settings
  apiSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    apiConfig.endpoint = apiEndpointInput.value.trim();
    apiConfig.key = apiKeyInput.value.trim();
    apiConfig.selectedModel = modelSelect.value;
    closeModal();
    alert('API settings saved.');
  });

  // Fetch models from API endpoint dynamically with console logs and error handling
  async function fetchModels() {
    const endpoint = apiEndpointInput.value.trim();
    const key = apiKeyInput.value.trim();
    console.log('Fetch models triggered');
    if (!endpoint) {
      console.error('API endpoint is empty');
      alert('Please enter a valid API endpoint.');
      return;
    }
    if (!key) {
      console.error('API key is empty');
      alert('Please enter a valid API key.');
      return;
    }
    refreshModelsBtn.disabled = true;
    refreshModelsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
      // Use endpoint as is if ends with /models, else append /models
      let url = endpoint;
      if (!url.endsWith('/models')) {
        url = url.replace(/\/+$/, '') + '/models';
      }
      console.log('Fetching models from URL:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        console.error('HTTP error status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Models response data:', data);
      // Expecting data.models or data.data array of models
      let models = [];
      if (Array.isArray(data.models)) {
        models = data.models;
      } else if (Array.isArray(data.data)) {
        models = data.data;
      } else {
        console.error('Models list not found in response');
        throw new Error('Models list not found in response');
      }
      // Extract model ids or names
      const modelNames = models.map(m => m.id || m.name || m);
      apiConfig.models = modelNames;
      modelSelect.innerHTML = '';
      modelNames.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
      if (apiConfig.selectedModel && modelNames.includes(apiConfig.selectedModel)) {
        modelSelect.value = apiConfig.selectedModel;
      }
      console.log('Models loaded successfully');
    } catch (error) {
      console.error('Failed to fetch models:', error);
      alert('Failed to fetch models: ' + error.message);
      modelSelect.innerHTML = '<option value="">No models loaded</option>';
    } finally {
      refreshModelsBtn.disabled = false;
      refreshModelsBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    }
  }

  refreshModelsBtn.addEventListener('click', fetchModels);

  // Initialize modal inputs with saved config if any
  function initModal() {
    apiEndpointInput.value = apiConfig.endpoint || '';
    apiKeyInput.value = apiConfig.key || '';
    modelSelect.innerHTML = '';
    if (apiConfig.models.length > 0) {
      apiConfig.models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
      if (apiConfig.selectedModel) {
        modelSelect.value = apiConfig.selectedModel;
      }
    } else {
      modelSelect.innerHTML = '<option value="">No models loaded</option>';
    }
  }
});
