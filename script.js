//Visualize button JS
// Smooth scroll to the input-container when the "Visualise" button is clicked
document.getElementById('visualise-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default anchor link behavior
    document.querySelector('#input-container').scrollIntoView({ behavior: 'smooth' });
});

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('downloadButton');

    downloadButton.addEventListener('mousedown', generatePDF);


    function generatePDF() {
        const chartContainer = document.getElementById('chartContainerSection');
        const doc = new jsPDF();

        const chartItems = chartContainer.getElementsByClassName('chart-item');
        for (const item of chartItems) {
            const canvas = item.getElementsByTagName('canvas')[0];
            if (canvas) {
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 10, 10, 190, 100);
                doc.addPage();
            }
        }

        // Prompt user for file name and download
        const pdfName = prompt('Enter the PDF file name', 'visualization.pdf');
        if (pdfName) {
            doc.save(pdfName);
        }
    }
});



// Function to toggle the visibility of the chart container section
function toggleChartContainer() {
    var chartContainerSection = document.getElementById("chartContainerSection");
    chartContainerSection.style.display = chartContainerSection.style.display === "none" ? "block" : "none";
}

// Function to generate GPA Visualization
function generateGPAVisualization() {
    var creditPoints = [3, 4, 4, 3, 1, 1, 1, 2];

    var fileInput = document.getElementById("csvFileInput");
    var file = fileInput.files[0];

    if (!file) {
        alert("Please upload a file.");
        return;
    }

    if (!file.name.endsWith(".csv")) {
        alert("Invalid file type. Please upload a .csv file.");
        return;
    }

    Papa.parse(file, {
        complete: function (results) {
            var studentData = results.data.slice(2); // Skip the header and lecture hours row
            var lectureHoursRow = results.data[1];
            var lectureHours = lectureHoursRow.slice(1, 9).map(parseFloat);
            var gpaData = [];

            studentData.forEach(function (row) {
                var studentRegNo = row[0];
                var subjectMarks = row.slice(1, 9).map(parseFloat);

                var totalCredits = 0;
                var weightedGradePointsSum = 0;

                for (var i = 0; i < subjectMarks.length; i++) {
                    var marksValue = subjectMarks[i];
                    var credits = creditPoints[i];
                    var hours = lectureHours[i];

                    totalCredits += credits;
                    weightedGradePointsSum += (getGradePoints(marksValue) * credits);
                }

                var gpa = weightedGradePointsSum / totalCredits;
                gpaData.push({ studentRegNo, gpa: gpa.toFixed(2) });
            });

            createHistogram(gpaData.map(entry => entry.gpa), gpaData.map(entry => entry.studentRegNo));
            createBarChart(gpaData.map(entry => entry.gpa));
            createPieChart(gpaData.map(entry => entry.gpa));
            createDoughnutChart(gpaData.map(entry => entry.gpa));
            //createRadarChart(studentData[0].slice(1)); // Assuming the first row contains subject names
            createScatterChart(gpaData.map(entry => entry.gpa));
            displayRankTable(gpaData);
            fileInput.value = "";
            gpaData.length = 0;
        }
    });

    // Show the chart container section
    toggleChartContainer();
}

// Add an event listener to the "Generate GPA Visualization" button
document.getElementById("generateBtn").addEventListener("click", generateGPAVisualization);



function validateData(data) {
    // Basic validation to ensure there are at least two rows (header + data)
    return data && data.length >= 2 && Array.isArray(data[0]);
}


function getGradePoints(marks) {
    // (Same code as before...)
    if (marks >= 90) {
        return 10;
    } else if (marks >= 80) {
        return 9;
    } else if (marks >= 70) {
        return 8;
    } else if (marks >= 60) {
        return 7;
    } else if (marks >= 50) {
        return 6;
    } else if (marks >= 40) {
        return 5;
    } else if (marks >= 35) {
        return 4;
    } else {
        return 0;
    }
}

// Other functions (createHistogram, createBarChart, etc.) are assumed to be defined elsewhere in your code.




function createHistogram(gpaData, studentRegNos) {
    var ctx = document.getElementById("histogramContainer").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: studentRegNos.map(regNo => "" + regNo),
            datasets: [
                {
                    label: "GPA Histogram",
                    data: gpaData,
                    backgroundColor: "#2e86de"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: "GPA Histogram"
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "Students"
                        }
                    }
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "GPA"
                        },
                        ticks: {
                            beginAtZero: true,
                            precision: 1
                        }
                    }
                ]
            }
        }
    });
}

function createBarChart(data) {
    var ctx = document.getElementById("barChartContainer").getContext("2d");

    var gpaLabels = [
        "9-10: FCD",
        "8-9: First Class",
        "7-8: Second Class",
        "6-7: Pass Class",
        "below 6: Fail"
    ];

    var gpaCounts = [0, 0, 0, 0, 0];

    data.forEach(function (gpa) {
        if (gpa >= 9) {
            gpaCounts[0]++;
        } else if (gpa >= 8) {
            gpaCounts[1]++;
        } else if (gpa >= 7) {
            gpaCounts[2]++;
        } else if (gpa >= 6) {
            gpaCounts[3]++;
        } else {
            gpaCounts[4]++;
        }
    });

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: gpaLabels,
            datasets: [
                {
                    label: "Number of Students",
                    data: gpaCounts,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF"
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: "GPA Bar Chart"
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "GPA Range"
                        }
                    }
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "Number of Students"
                        },
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        }
                    }
                ]
            }
        }
    });
}

function createPieChart(data) {
    var ctx = document.getElementById("pieChartContainer").getContext("2d");

    var gpaLabels = [
        "GPA 9-10: First Class with Distinction",
        "GPA 8-9: First Class",
        "GPA 7-8: Second Class",
        "GPA 6-7: Pass Class",
        "GPA below 6: Fail"
    ];

    var gpaCounts = [0, 0, 0, 0, 0];

    data.forEach(function (gpa) {
        if (gpa >= 9) {
            gpaCounts[0]++;
        } else if (gpa >= 8) {
            gpaCounts[1]++;
        } else if (gpa >= 7) {
            gpaCounts[2]++;
        } else if (gpa >= 6) {
            gpaCounts[3]++;
        } else {
            gpaCounts[4]++;
        }
    });

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: gpaLabels,
            datasets: [
                {
                    data: gpaCounts,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF"
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: "GPA Pie Chart"
            }
        }
    });
}



function createScatterChart(data) {
    var ctx = document.getElementById("scatterChartContainer").getContext("2d");

    var scatterData = {
        datasets: [
            {
                label: "GPA Scatter Chart",
                data: data.map((gpa, index) => ({ x: index + 1, y: gpa })),
                backgroundColor: "#2e86de"
            }
        ]
    };

    new Chart(ctx, {
        type: "scatter",
        data: scatterData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: "GPA Scatter Chart"
            },
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: {
                        display: true,
                        text: "Student"
                    },
                    ticks: {
                        precision: 0
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "GPA"
                    },
                    ticks: {
                        beginAtZero: true,
                        precision: 1
                    }
                }
            }
        }
    });
}



function createRadarChart(data) {
    var ctx = document.getElementById("radarChartContainer").getContext("2d");

    var radarData = {
        labels: ["21MAT41", "21CS42", "21CS43", "21CS44", "Ability Enhancemnt", "CIP", "Python Lab", "Biology"],
        datasets: [
            {
                label: "Subject Marks Radar Char",
                data: data,
                backgroundColor: "rgba(46, 134, 222, 0.4)",
                borderColor: "#2e86de",
                pointBackgroundColor: "#2e86de",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#2e86de"
            }
        ]
    };

    new Chart(ctx, {
        type: "radar",
        data: radarData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: "Subject Marks Radar Chart"
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    stepSize: 2
                }
            }
        }
    });
}

function createDoughnutChart(gpaData) {
    var ctx = document.getElementById("doughnutChartContainer").getContext("2d");

    // Count the number of students falling in each GPA range
    var gpaDistribution = {
        "First Class with Distinction (GPA 9-10)": 0,
        "First Class (GPA 8-9)": 0,
        "Second Class (GPA 7-8)": 0,
        "Pass Class (GPA 6-7)": 0,
        "Fail (GPA below 6)": 0
    };

    gpaData.forEach((gpa) => {
        if (gpa >= 9) {
            gpaDistribution["First Class with Distinction (GPA 9-10)"]++;
        } else if (gpa >= 8) {
            gpaDistribution["First Class (GPA 8-9)"]++;
        } else if (gpa >= 7) {
            gpaDistribution["Second Class (GPA 7-8)"]++;
        } else if (gpa >= 6) {
            gpaDistribution["Pass Class (GPA 6-7)"]++;
        } else {
            gpaDistribution["Fail (GPA below 6)"]++;
        }
    });

    var doughnutData = {
        labels: Object.keys(gpaDistribution),
        datasets: [
            {
                data: Object.values(gpaDistribution),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF"
                ]
            }
        ]
    };

    new Chart(ctx, {
        type: "doughnut",
        data: doughnutData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: "GPA Distribution on Doughnut Chart"
            }
        }
    });
}


// Optional: Smooth scroll to section when clicking on taskbar links
document.querySelectorAll('.taskbar a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});

function getGradeDescription(gpa) {
    if (gpa >= 9 && gpa <= 10) {
        return "First Class with Distinction";
    } else if (gpa >= 8 && gpa < 9) {
        return "First Class";
    } else if (gpa >= 7 && gpa < 8) {
        return "Second Class";
    } else if (gpa >= 6 && gpa < 7) {
        return "Pass Class";
    } else {
        return "Fail";
    }
}

function displayRankTable(gpaData) {
    // Sort the gpaData array in descending order based on GPA
    gpaData.sort((a, b) => b.gpa - a.gpa);

    // Get the container element where the rank table will be displayed
    var tableContainer = document.getElementById("rankTableContainer");

    // Create a table element
    var table = document.createElement("table");

    // Create the table header row
    var headerRow = table.insertRow();
    var rankHeader = headerRow.insertCell();
    var regNoHeader = headerRow.insertCell();
    var gpaHeader = headerRow.insertCell();
    var gradeDescHeader = headerRow.insertCell();
    rankHeader.textContent = "Rank";
    regNoHeader.textContent = "Student Registration Number";
    gpaHeader.textContent = "GPA";
    gradeDescHeader.textContent = "Grade Description";

    // Add rows for each student in the gpaData array
    gpaData.forEach(function (entry, index) {
        var row = table.insertRow();
        var rankCell = row.insertCell();
        var regNoCell = row.insertCell();
        var gpaCell = row.insertCell();
        var gradeDescCell = row.insertCell();
        rankCell.textContent = index + 1;
        regNoCell.textContent = entry.studentRegNo;
        gpaCell.textContent = entry.gpa;
        gradeDescCell.textContent = getGradeDescription(entry.gpa);
    });

    // Add the table to the container element
    tableContainer.innerHTML = ""; // Clear any previous content
    tableContainer.appendChild(table);
}



const buttons = document.querySelectorAll('#visualise-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        this.appendChild(ripples);

        setTimeout(() => {
            ripples.remove();
        }, 1000);
    });
});

//Website reset
// Add event listener to the Reset button
// Add event listener to the Reset button
document.getElementById('resetButton').addEventListener('click', function () {
    // Scroll to the top of the page smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Delay the page reload for a smooth scroll experience
    setTimeout(function () {
        // Reload the website
        location.reload();
    }, 1000); // Set the delay time (in milliseconds) for a smooth scroll before reloading
});


document.getElementById('generateBtn').addEventListener('click', function () {
    // Gently scroll down 70vh in 500ms
    const screenHeight = window.innerHeight;
    const scrollDistance = screenHeight * 1;
    window.scrollBy({
        top: scrollDistance,
        behavior: 'smooth',
        duration: 500
    });
});

