let transactions = JSON.parse(localStorage.getItem("data")) || [];

const history = document.getElementById("history");

function updateTime() {
    document.getElementById("datetime").textContent =
        new Date().toLocaleString("en-IN");
}
setInterval(updateTime, 1000);

// Add
document.getElementById("addBtn").addEventListener("click", () => {
    let title = document.getElementById("title").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;

    if (!title || isNaN(amount)) return alert("Fill fields");

    const tx = {
        id: Date.now(),
        title,
        amount,
        type,
        category,
        date: new Date()
    };

    transactions.push(tx);
    localStorage.setItem("data", JSON.stringify(transactions));

    render();
});

// Render
function render() {
    history.innerHTML = "";

    let income = 0, expense = 0;

    let dates = [];
    let values = [];

    transactions.forEach(tx => {
        const li = document.createElement("li");

        let time = new Date(tx.date).toLocaleDateString("en-IN");

        if (tx.type === "income") {
            income += tx.amount;
            values.push(tx.amount);
        } else {
            expense += tx.amount;
            values.push(-tx.amount);
        }

        dates.push(time);

        li.innerHTML = `
            ${tx.title} (${tx.category}) <small>${time}</small>
            <span class="${tx.type === "income" ? "income-item" : "expense-item"}">
                ${tx.type === "income" ? "+" : "-"} ₹${tx.amount}
            </span>
            <button class="delete-btn" onclick="deleteTx(${tx.id})">X</button>
        `;

        history.appendChild(li);
    });

    document.getElementById("totalIncome").textContent = `₹${income}`;
    document.getElementById("totalExpense").textContent = `₹${expense}`;
    document.getElementById("balance").textContent = `₹${income - expense}`;

    updateChart(dates, values);
}

// Delete
function deleteTx(id) {
    transactions = transactions.filter(tx => tx.id !== id);
    localStorage.setItem("data", JSON.stringify(transactions));
    render();
}

// Chart
let chart;

function updateChart(labels, data) {
    const ctx = document.getElementById("myChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Balance Trend",
                data: data,
                tension: 0.4
            }]
        }
    });
}

// Theme toggle
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

// Init
render();