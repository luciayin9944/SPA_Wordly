// function fetchWordData(word) {
//     fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//         displayExplanation(data);
//     })
//     .catch(error => {
//         displayError(error.message);
//     });
// }



async function fetchWordData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        //console.log(data);
        displayExplanation(data);
    } catch (error) {
        displayError(error.message);
    }
}

//fetchWordData('hello');


function displayExplanation(data) {
    const wordData = data[0];
    const wordDisplay = document.getElementById('word-display');
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add(`hidden`); // Hide error message if present

    let phoneticsHTML = '';
    if (wordData.phonetics && wordData.phonetics.length > 0) {
        const phonetics = wordData.phonetics.find(p => p.audio);

        if (phonetics) {
            phoneticsHTML = `<p><strong>Phonetic:</strong>${phonetics.text || ''}</p>
            <audio controls src="${phonetics.audio}"></audio>
            `;
        }
    }
    
    let meaningsHTML = '';
    if (wordData.meanings && wordData.meanings.length > 0) {
        meaningsHTML = wordData.meanings.map(meaning => {
            const definitionsHTML = meaning.definitions.map(def => {
                return `
                    <li>
                        <strong>Definition:</strong> ${def.definition}
                        ${def.example ? `<br><em>Example:</em> "${def.example}"` : ''}
                    </li>
                `;
            }).join('');

            return `
                <div>
                    <h4>Part of Speech: ${meaning.partOfSpeech}</h4>
                    <ul>${definitionsHTML}</ul>
                </div>
            `;
        }).join('');
    }

    wordDisplay.innerHTML = `
        <h2>${wordData.word}</h2>
        ${phoneticsHTML}
        ${meaningsHTML}
    `;
}

function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    const wordDisplay = document.getElementById('word-display');

    wordDisplay.innerHTML = ''; // Clear the word display section
    errorMessage.textContent = message; // Show the error message
    errorMessage.classList.remove('hidden'); // Make sure the error message is visible
}

// Add event listener for the "Search" button
document.getElementById('fetch-word').addEventListener('click', () => {
    const word = document.getElementById('word-input').value.trim();
    if (word) {
        fetchWordData(word);
    } else {
        displayError('Please enter a word.')
    }
});


// Add event listener for the "New Word" button to reset the page
document.getElementById('reset').addEventListener('click', () => {
    const wordInput = document.getElementById('word-input');
    const wordDisplay = document.getElementById('word-display');
    const errorMessage = document.getElementById('error-message');

    // Clear the input field
    wordInput.value = '';
    // Clear the word display and error message
    wordDisplay.innerHTML = '';
    // Hide the error message if any
    errorMessage.classList.add('hidden');
});
