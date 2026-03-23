// 1. Data Initialization
let transactions = JSON.parse(localStorage.getItem("data")) || [];
const history = document.getElementById("history");
let chart; // Global chart variable

// 2. Real-time Clock
function updateTime() {
    document.getElementById("datetime").textContent = new Date().toLocaleString("en-IN");
}
setInterval(updateTime, 1000);

// 3. Add Transaction Logic
document.getElementById("addBtn").addEventListener("click", () => {
    let title = document.getElementById("title").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;

    if (!title || isNaN(amount)) return alert("Please enter a valid title and amount.");

    const tx = {
        id: Date.now(),
        title,
        amount,
        type,
        category,
        date: new Date()
    };

    transactions.push(tx);
    saveAndRender();
    
    // Clear inputs after adding
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
});

// 4. Save and Update UI
function saveAndRender() {
    localStorage.setItem("data", JSON.stringify(transactions));
    render();
}

// 5. Main Render Function
function render() {
    history.innerHTML = "";
    let income = 0, expense = 0, runningBalance = 0;

    let labels = [];
    let balanceTrend = [];

    // Sort transactions by date so the graph flows correctly
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    transactions.forEach(tx => {
        const li = document.createElement("li");
        let dateLabel = new Date(tx.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });

        if (tx.type === "income") {
            income += tx.amount;
            runningBalance += tx.amount;
        } else {
            expense += tx.amount;
            runningBalance -= tx.amount;
        }

        // Prepare data for Chart
        labels.push(dateLabel);
        balanceTrend.push(runningBalance);

        // Create List Item
        li.innerHTML = `
            <div>
                <strong>${tx.title}</strong> <br>
                <small>${tx.category} | ${dateLabel}</small>
            </div>
            <div class="tx-right">
                <span class="${tx.type === "income" ? "income-item" : "expense-item"}">
                    ${tx.type === "income" ? "+" : "-"} ₹${tx.amount.toLocaleString()}
                </span>
                <button class="delete-btn" onclick="deleteTx(${tx.id})">×</button>
            </div>
        `;
        history.appendChild(li);
    });

    // Update Header Cards
    document.getElementById("totalIncome").textContent = `₹${income.toLocaleString()}`;
    document.getElementById("totalExpense").textContent = `₹${expense.toLocaleString()}`;
    document.getElementById("balance").textContent = `₹${(income - expense).toLocaleString()}`;

    updateChart(labels, balanceTrend);
}

// 6. Delete Logic
function deleteTx(id) {
    transactions = transactions.filter(tx => tx.id !== id);
    saveAndRender();
}

// 7. Optimized Chart Function
function updateChart(labels, data) {
    const ctx = document.getElementById("myChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Wallet Balance (₹)",
                data: data,
                borderColor: "#3498db",
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                fill: true,
                tension: 0.4,
                // Data Science Touch: Points change color based on positive/negative balance
                pointBackgroundColor: data.map(val => val >= 0 ? "#2ecc71" : "#e74c3c"),
                pointBorderColor: data.map(val => val >= 0 ? "#2ecc71" : "#e74c3c"),
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)" // Better for dark mode
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// 8. Theme Toggle
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
    // Change icon
    const btn = document.getElementById("themeToggle");
    btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Start the app
render();
