let currentIndex = 0;
let mediaRecorder;
let chunks = [];

const scripts = [
    {
        nepali: "अझै पनि म नेपालको सौन्दर्यमा मोहित छु। हरेक पहाड र किनाराहरूले मलाई प्रेरित गर्दछ। त्यसकारण, मेरो हृदय धेरै प्रसन्न छ। तर यो सौन्दर्यलाई नेपालको सांस्कृतिक धरोहरले थप गर्दछ। यसले मेरो भावनाहरूलाई गहिरो रूपमा प्रभावित गर्दछ। नेपालको ऐतिहासिक गौरवले मलाई गर्वित बनाउँछ, र मैले उसको अनुभव गर्नेहरूमा समाहित हुँ।",
        english: "I am still enchanted by the beauty of Nepal. Every mountain and shoreline inspires me. Therefore, my heart is filled with joy. But Nepal's cultural heritage adds to this beauty. It deeply influences my emotions. Nepal's historic glory makes me proud, and I feel privileged to experience it."
    },
    {
        nepali: "नेपालमा साह्रै सुन्दर स्थानहरू छन्। हरेक ठाउँको आफ्नै विशेषता छ र ती सबैले मलाई रोमाञ्चित बनाउँछन्। नेपालको सांस्कृतिक विविधता र सम्पदा यसको प्रमुख आकर्षण हो।",
        english: "Nepal has incredibly beautiful places. Each location has its own uniqueness, and they all fascinate me. Nepal's cultural diversity and heritage are its main attractions."
    },
    {
        nepali: "सगरमाथाको चुचुरोबाट संसारको सुन्दरता अद्भुत देखिन्छ। यस पर्वतारोहण यात्राले मेरो आत्मालाई प्रेरणा र आनन्द दिएको छ।",
        english: "The beauty of the world looks amazing from the peak of Everest. This mountaineering journey has given my soul inspiration and joy."
    },
    {
        nepali: "पोखरा झीलको किनारमा समय बिताउनु एउटा अद्भुत अनुभव हो। यसले मनलाई शान्ति र आनन्द दिन्छ।",
        english: "Spending time by the shores of Pokhara Lake is a wonderful experience. It brings peace and joy to the mind."
    },
    {
        nepali: "लुम्बिनीमा बुद्धको जन्मस्थल अवलोकन गर्न पाउँदा गर्व महसुस हुन्छ। यसले मेरो आत्मालाई आध्यात्मिक शान्ति प्रदान गर्दछ।",
        english: "Visiting the birthplace of Buddha in Lumbini fills me with pride. It provides spiritual peace to my soul."
    }
];

function updateScripts() {
    document.getElementById('nepali-script').innerHTML = scripts[currentIndex].nepali;
    document.getElementById('english-script').innerHTML = scripts[currentIndex].english;
    console.log("Scripts updated");
}

function nextPage() {
    currentIndex = (currentIndex + 1) % scripts.length; // Loop back to the first script
    updateScripts();
    console.log("Next page, currentIndex:", currentIndex);
}

function readAndRecord(language) {
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert("Please enter your name before recording.");
        return;
    }

    const recordButton = document.getElementById(`record-${language}`);
    const stopButton = document.getElementById(`stop-${language}`);

    if (recordButton.style.display === 'none') {
        stopRecording(language);
        return;
    }

    console.log("Starting to access microphone...");
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        mediaRecorder = new MediaRecorder(stream);
        chunks = [];
        console.log("MediaRecorder initialized");

        mediaRecorder.ondataavailable = function(e) {
            console.log("Data available from media recorder");
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function() {
            console.log("MediaRecorder stopped");
            let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            let audioURL = URL.createObjectURL(blob);
            console.log("Recording stopped, audio URL:", audioURL);

            // Create a download link
            let downloadLink = document.createElement('a');
            downloadLink.href = audioURL;
            downloadLink.download = `recording_${language}.ogg`; // Filename for the downloaded file
            document.body.appendChild(downloadLink);
            downloadLink.click();
            // You can now send the audioURL to your server or process it further

            document.getElementById(`record-${language}`).style.display = 'block';
            document.getElementById(`stop-${language}`).style.display = 'none';
        };

        mediaRecorder.start();
        console.log("Recording started");

        // Show stop button and hide record button
        recordButton.style.display = 'none';
        stopButton.style.display = 'block';
    })
    .catch(function(err) {
       
        console.error("Error accessing microphone:", err);
    });
}

function stopRecording(language) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        console.log("Stopping the recording...");
        mediaRecorder.stop();

        // Hide stop button for the specified language
        document.getElementById(`stop-${language}`).style.display = 'none';
        document.getElementById(`record-${language}`).style.display = 'block';
        document.getElementById(`record-${language}`).innerText = 'Record your script';
    }
}

// Initialize the page with the first script pair
document.addEventListener('DOMContentLoaded', updateScripts);
