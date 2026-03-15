document.addEventListener('DOMContentLoaded', () => {
    // Animations
    const animatedElements = document.querySelectorAll('.animated-element');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('slide-up');
        }, index * 100);
    });

    // Chart
    if (typeof Chart !== 'undefined') {
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Interactions',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
                fill: false,
                borderColor: '#137fec',
                tension: 0.1
            }]
        };

        const config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );

        const updateStats = (period) => {
            const newData = Array.from({
                length: 12
            }, () => Math.floor(Math.random() * 100));
            myChart.data.datasets[0].data = newData;
            myChart.update();

            const responseRate = Math.floor(Math.random() * 21) + 80; // 80-100
            const avgResponseTime = (Math.random() * 4 + 1).toFixed(1); // 1.0-5.0

            const responseRateText = document.getElementById('response-rate-text');
            const responseRateCircle = document.getElementById('response-rate-circle');
            const avgResponseTimeElement = document.getElementById('avg-response-time');

            if (responseRateText && responseRateCircle && avgResponseTimeElement) {
                responseRateText.textContent = `${responseRate}%`;
                responseRateCircle.style.strokeDasharray = `${responseRate}, 100`;
                avgResponseTimeElement.textContent = `${avgResponseTime}s`;
            }
        };

        document.getElementById('time-buttons').addEventListener('click', (e) => {
            if (e.target.closest('.time-button')) {
                const period = e.target.closest('.time-button').dataset.period;
                updateStats(period);
                document.querySelectorAll('.time-button').forEach(btn => {
                    btn.classList.remove('bg-primary', 'text-white');
                    btn.classList.add('bg-gray-200', 'dark:bg-background-dark/50', 'text-text-secondary-light', 'dark:text-text-secondary-dark');
                });
                e.target.closest('.time-button').classList.add('bg-primary', 'text-white');
                e.target.closest('.time-button').classList.remove('bg-gray-200', 'dark:bg-background-dark/50', 'text-text-secondary-light', 'dark:text-text-secondary-dark');
            }
        });

        updateStats('30days');
    }

    // File Uploads
    let uploadedPDFs = [];
    let uploadedTimetables = [];

    const renderUploadedFiles = (fileList, elementId, fileType) => {
        const listElement = document.getElementById(elementId);
        listElement.innerHTML = '';
        fileList.forEach(fileName => {
            listElement.innerHTML += `
                <li class="bg-gray-100 dark:bg-background-dark p-2 rounded-md flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="material-icons text-green-500 mr-2">check_circle</span>
                        <span class="text-sm text-text-light dark:text-text-dark">${fileName}</span>
                    </div>
                    <button data-filename="${fileName}" data-filetype="${fileType}" class="delete-file-btn text-red-500 hover:text-red-700">
                        <span class="material-icons">delete</span>
                    </button>
                </li>`;
        });
    };

    const setupDropZone = (dropZoneId, fileInputId, fileType) => {
        const dropZone = document.getElementById(dropZoneId);
        const fileInput = document.getElementById(fileInputId);
        if (!dropZone || !fileInput) return;

        const originalContent = dropZone.innerHTML;

        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => handleFiles(fileInput.files));

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drop-zone-active');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drop-zone-active');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drop-zone-active');
            handleFiles(e.dataTransfer.files);
        });

        const handleFiles = (files) => {
            if (files.length > 0) {
                uploadFile(files[0], dropZone, fileType);
            }
        };
    };

    const uploadFile = async (file, dropZone, fileType) => {
        dropZone.innerHTML = `
            <div class="flex flex-col items-center text-text-secondary-light dark:text-text-secondary-dark">
                <span class="material-icons text-4xl animate-spin">hourglass_top</span>
                <p class="mb-2 font-semibold text-text-light dark:text-text-dark">Processing file...</p>
                <p class="text-xs">${file.name}</p>
            </div>`;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Mock upload
            const randomChars = Math.floor(Math.random() * 10000) + 2000;
            dropZone.innerHTML = `
                <div class="flex flex-col items-center text-green-500">
                    <span class="material-icons text-4xl">check_circle</span>
                    <p class="mb-2 font-semibold">PDF uploaded successfully!</p>
                    <p class="text-xs">${randomChars.toLocaleString()} characters extracted successfully.</p>
                    <button class="mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors text-sm upload-another-btn">Upload another file</button>
                </div>`;

            if (fileType === 'pdf') {
                uploadedPDFs.push(file.name);
                renderUploadedFiles(uploadedPDFs, 'pdf-file-list', 'pdf');
            } else if (fileType === 'timetable') {
                uploadedTimetables.push(file.name);
                renderUploadedFiles(uploadedTimetables, 'timetable-file-list', 'timetable');
            }

            const uploadAnotherBtn = dropZone.querySelector('.upload-another-btn');
            if (uploadAnotherBtn) {
                uploadAnotherBtn.addEventListener('click', () => {
                    dropZone.innerHTML = originalContent;
                });
            }

        } catch (error) {
            dropZone.innerHTML = `
                <div class="flex flex-col items-center text-red-500">
                    <span class="material-icons text-4xl">error</span>
                    <p class="mb-2 font-semibold">Upload failed</p>
                    <p class="text-xs">Could not upload ${file.name}.</p>
                </div>`;
        }
    };

    const deleteFile = (fileName, fileType) => {
        if (fileType === 'pdf') {
            uploadedPDFs = uploadedPDFs.filter(f => f !== fileName);
            renderUploadedFiles(uploadedPDFs, 'pdf-file-list', 'pdf');
        } else if (fileType === 'timetable') {
            uploadedTimetables = uploadedTimetables.filter(f => f !== fileName);
            renderUploadedFiles(uploadedTimetables, 'timetable-file-list', 'timetable');
        }
    };

    const pdfFileList = document.getElementById('pdf-file-list');
    if (pdfFileList) {
        pdfFileList.addEventListener('click', (e) => {
            if (e.target.closest('.delete-file-btn')) {
                const button = e.target.closest('.delete-file-btn');
                const fileName = button.dataset.filename;
                const fileType = button.dataset.filetype;
                deleteFile(fileName, fileType);
            }
        });
    }

    const timetableFileList = document.getElementById('timetable-file-list');
    if (timetableFileList) {
        timetableFileList.addEventListener('click', (e) => {
            if (e.target.closest('.delete-file-btn')) {
                const button = e.target.closest('.delete-file-btn');
                const fileName = button.dataset.filename;
                const fileType = button.dataset.filetype;
                deleteFile(fileName, fileType);
            }
        });
    }

    setupDropZone('pdf-drop-zone', 'pdf-file-input', 'pdf');
    setupDropZone('timetable-drop-zone', 'timetable-file-input', 'timetable');

    const renderTopQueries = () => {
        const topQueriesBody = document.getElementById('top-queries-body');
        if (!topQueriesBody) return;

        const topQueries = [
            { query: 'What are the library hours?', frequency: 120, avgResponseTime: '2.1s' },
            { query: 'How to reset my password?', frequency: 95, avgResponseTime: '1.8s' },
            { query: 'What is the fee structure?', frequency: 80, avgResponseTime: '3.5s' },
            { query: 'When is the last day to register for courses?', frequency: 75, avgResponseTime: '2.9s' },
            { query: 'How to apply for a scholarship?', frequency: 60, avgResponseTime: '4.2s' },
        ];

        topQueriesBody.innerHTML = topQueries.map(q => `
            <tr class="border-b border-gray-200 dark:border-gray-700/50">
                <td class="py-3 px-4 text-sm text-text-light dark:text-text-dark">${q.query}</td>
                <td class="py-3 px-4 text-sm text-center text-text-secondary-light dark:text-text-secondary-dark">${q.frequency}</td>
                <td class="py-3 px-4 text-sm text-center text-text-secondary-light dark:text-text-secondary-dark">${q.avgResponseTime}</td>
            </tr>
        `).join('');
    };

    const renderTopLanguages = () => {
        const topLanguagesContainer = document.getElementById('top-languages');
        if (!topLanguagesContainer) return;

        const topLanguages = [
            { language: 'English', percentage: 65 },
            { language: 'Hindi', percentage: 20 },
            { language: 'Marathi', percentage: 10 },
            { language: 'Spanish', percentage: 5 },
        ];

        topLanguagesContainer.innerHTML = topLanguages.map(l => `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-text-light dark:text-text-dark">${l.language}</span>
                    <span class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">${l.percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div class="bg-primary h-2 rounded-full" style="width: ${l.percentage}%"></div>
                </div>
            </div>
        `).join('');
    };

    renderTopQueries();
    renderTopLanguages();

    const testOnSiteButton = document.getElementById('test-on-site-button');
    if (testOnSiteButton) {
        testOnSiteButton.addEventListener('click', () => {
            const websiteUrl = document.getElementById('website-url').value.trim();
            if (websiteUrl) {
                window.location.href = `embedded_chatbot.html?site=${encodeURIComponent(websiteUrl)}`;
            } else {
                alert('Please enter a website URL.');
            }
        });
    }
});