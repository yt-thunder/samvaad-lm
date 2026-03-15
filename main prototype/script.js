const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMain = document.querySelector('main');
const suggestionButtons = document.getElementById('suggestion-buttons');

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

suggestionButtons.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const message = e.target.textContent;
        addUserMessage(message);
        getBotResponse(message);
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addUserMessage(message);
        chatInput.value = '';
        getBotResponse(message);
    }
}

function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex items-end gap-3 justify-end';
    messageElement.innerHTML = `
        <div class=\"flex flex-col gap-1 items-end\">
            <p class=\"text-sm text-gray-500 dark:text-gray-400\">Student</p>
            <div class=\"max-w-xs rounded-lg bg-primary px-4 py-2.5 text-white\">
                <p>${message}</p>
            </div>
        </div>
        <img src=\"./pictures/avatar.jpg\" alt=\"User Icon\" class=\"w-10 h-10 shrink-0 rounded-full bg-cover bg-center\">
    `;
    chatMain.appendChild(messageElement);
    setTimeout(() => {
        chatMain.scrollTop = chatMain.scrollHeight;
    }, 0);
}

function getBotResponse(message) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'flex items-end gap-3';
    loadingElement.innerHTML = `
    <img src=\"./pictures/icon.png\" alt=\"Chatbot Icon\" class=\"w-10 h-10 shrink-0 rounded-full bg-cover bg-center\">
        <div class=\"flex flex-col gap-1 items-start\">
            <p class=\"text-sm text-gray-500 dark:text-gray-400\">Samvaad LM</p>
            <div class=\"max-w-xs rounded-lg bg-background-dark/50 dark:bg-background-light/5 px-4 py-2.5 text-gray-900 dark:text-white\">
                <p class=\"typing-indicator\"><span></span><span></span><span></span></p>
            </div>
        </div>
    `;
    chatMain.appendChild(loadingElement);
    setTimeout(() => {
        chatMain.scrollTop = chatMain.scrollHeight;
    }, 0);

    setTimeout(() => {
        let answer;
        if (message === 'छुट्टी के बाद कॉलेज फिर से कब खुलेंगे?') {
            answer = 'नमस्ते! सेमेस्टर ब्रेक के बाद कॉलेज 5 अगस्त 2025 को फिर से खुलेंगे। सभी छात्रों से अनुरोध है कि वे अपनी कक्षाओं के लिए समय पर रिपोर्ट करें।\n\nSource: Academic Calendar 2025-26.pdf, Page 2';
        } else if (message === "What is the university's policy on attendance for medical leave?") {
            answer = "According to the university's attendance policy, students can get attendance credit for medical leave if they submit a valid medical certificate from a registered medical practitioner within 3 working days of rejoining college. The leave application must be approved by the Head of the Department.\n\nSource: Student Rulebook 2025.pdf, Section 5, Clause 2.1";
        } else if (message === 'Which lab is scheduled for the 3rd semester Electronics students on Tuesday afternoon?') {
            answer = 'The Digital Circuits Lab is scheduled for 3rd semester Electronics students on Tuesday from 2:00 PM to 4:00 PM in the VLSI Lab (Room E-104).\n\nSource: ECE Timetable Fall 2025.xlsx';
        } else if (message === 'How can I apply for the "Innovate for India" scholarship?') {
            answer = 'To apply for the "Innovate for India" scholarship, you need to fill out the application form available on the university portal, attach your academic transcripts, and submit a 500-word essay on your proposed project idea. The deadline is October 15th, 2025.\n\nSource: Scholarship Circular (12-Sept-2025).pdf';
        } else if (message === 'Fee deadlines') {
            answer = "The fee deadlines for the current semester are as follows: Early bird discount ends on July 15th, Regular deadline is August 1st, and late payment with penalty is allowed until August 15th.";
        } else if (message === 'Course schedule') {
            answer = "The course schedule for the current semester is available on the university website. You can find it under the 'Academics' section.";
        } else if (message === 'Contact admin') {
            answer = "You can contact the admin office at admin@example.com or call them at (123) 456-7890.";
        } else {
            answer = "I'm sorry, I don't understand that question. Please try asking something else.";
        }
        loadingElement.querySelector('.typing-indicator').parentElement.innerHTML = `<p>${answer.replace(/\n/g, '<br>')}</p>`;
        setTimeout(() => {
            chatMain.scrollTop = chatMain.scrollHeight;
        }, 0);
        setTimeout(() => {
            chatMain.scrollTop = chatMain.scrollHeight;
        }, 0);
    }, 1500);
}
