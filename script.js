document.addEventListener('DOMContentLoaded', function () {
    const datepicker = document.getElementById('datepicker');
    const selectedDateLabel = document.getElementById('selectedDateLabel');
    const saveButton = document.getElementById('saveButton');

    datepicker.addEventListener('input', function () {
        const selectedDate = new Date(datepicker.value);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString('el-GR', options);

        selectedDateLabel.textContent = `Ημερομηνία: ${formattedDate}`;
        updateTotals();
        loadSavedDataForDate(selectedDate);
    });

    saveButton.addEventListener('click', function () {
        saveDataToLocalStorage();
    });

    const today = new Date();
    loadSavedDataForDate(today);
  
});

function saveDataToLocalStorage() {
    const selectedDate = document.getElementById('datepicker').value;
    const cashIncome = parseFloat(document.getElementById('cashIncome').value) || 0;
    const cardIncome = parseFloat(document.getElementById('cardIncome').value) || 0;
    const cashExpense = parseFloat(document.getElementById('cashExpense').value) || 0;
    const cardExpense = parseFloat(document.getElementById('cardExpense').value) || 0;

    // Έλεγχος αν υπάρχουν ήδη δεδομένα για τη συγκεκριμένη ημερομηνία
    const existingData = localStorage.getItem(selectedDate);
    if (existingData) {
        if (window.confirm('Υπάρχουν ήδη δεδομένα για αυτήν την ημερομηνία. Θέλετε να τα αντικαταστήσετε;')) {
            localStorage.removeItem(selectedDate);
        } else {
            return; // Αν ο χρήστης δεν επιθυμεί την αντικατάσταση, τερματίζουμε την συνάρτηση
        }
    }

    const dataToSave = {
        date: selectedDate,
        income: {
            cash: cashIncome,
            card: cardIncome
        },
        expense: {
            cash: cashExpense,
            card: cardExpense
        }
    };

    localStorage.setItem(selectedDate, JSON.stringify(dataToSave));
    localStorage.setItem('lastSelectedDate', selectedDate);
    alert('Τα δεδομένα αποθηκεύτηκαν επιτυχώς!');
    // Καλούμε τη συνάρτηση για να ανανεώσουμε τον πίνακα αποθηκευμένων δεδομένων
    loadSavedDataForDate(new Date(selectedDate));
}

function loadSavedDataForDate(selectedDate) {
    const savedDataTable = document.getElementById('savedDataTable').getElementsByTagName('tbody')[0];
    savedDataTable.innerHTML = ''; // Καθαρίζουμε τον πίνακα πριν προσθέσουμε νέα δεδομένα

    const savedData = localStorage.getItem(selectedDate.toISOString().split('T')[0]);
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        displaySavedData(parsedData);
    }
}

// Υπόλοιπος κώδικας παραμένει ίδιος


function displaySavedData(data) {
    const savedDataTable = document.getElementById('savedDataTable').getElementsByTagName('tbody')[0];
    const row = savedDataTable.insertRow();
    const dateCell = row.insertCell(0);
    const cashIncomeCell = row.insertCell(1);
    const cardIncomeCell = row.insertCell(2);
    const totalIncomeCell = row.insertCell(3);
    const cashExpenseCell = row.insertCell(4);
    const cardExpenseCell = row.insertCell(5);
    const totalExpenseCell = row.insertCell(6);
    const totalCashCell = row.insertCell(7);
    const totalCardCell = row.insertCell(8);

    dateCell.textContent = data.date;
    cashIncomeCell.textContent = formatCurrency(data.income.cash);
    cardIncomeCell.textContent = formatCurrency(data.income.card);
    totalIncomeCell.textContent = formatCurrency(data.income.cash + data.income.card);
    cashExpenseCell.textContent = formatCurrency(data.expense.cash);
    cardExpenseCell.textContent = formatCurrency(data.expense.card);
    totalExpenseCell.textContent = formatCurrency(data.expense.cash + data.expense.card);
    totalCashCell.textContent = formatCurrency(data.income.cash - data.expense.cash);
    totalCardCell.textContent = formatCurrency(data.income.card - data.expense.card);


}
// Οι υπόλοιπες συναρτήσεις παραμένουν ίδιες

function calculateTotalIncome() {
    const cashIncome = parseFloat(document.getElementById('cashIncome').value) || 0;
    const cardIncome = parseFloat(document.getElementById('cardIncome').value) || 0;
    const totalIncome = cashIncome + cardIncome;

    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    updateTotals();
}

function calculateTotalExpense() {
    const cashExpense = parseFloat(document.getElementById('cashExpense').value) || 0;
    const cardExpense = parseFloat(document.getElementById('cardExpense').value) || 0;
    const totalExpense = cashExpense + cardExpense;

    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    updateTotals();
}

function updateTotals() {
    const totalCash = parseFloat(document.getElementById('cashIncome').value) - parseFloat(document.getElementById('cashExpense').value) || 0;
    const totalCard = parseFloat(document.getElementById('cardIncome').value) - parseFloat(document.getElementById('cardExpense').value) || 0;

    document.getElementById('totalCash').textContent = formatCurrency(totalCash);
    document.getElementById('totalCard').textContent = formatCurrency(totalCard);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount);
}
function generateDailyReport() {
    const reportDate = document.getElementById('reportDate').value;
    const parsedDate = new Date(reportDate);
    const formattedDate = parsedDate.toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const savedData = localStorage.getItem(parsedDate.toISOString().split('T')[0]);

    if (savedData) {
        const parsedData = JSON.parse(savedData);
        displayDailyReport(parsedData, formattedDate);
    } else {
        alert('Δεν υπάρχουν αποθηκευμένα δεδομένα για την επιλεγμένη ημερομηνία.');
    }
}

function displayDailyReport(data, date) {
    const dailyReportTable = document.getElementById('dailyReportTable').getElementsByTagName('tbody')[0];
    dailyReportTable.innerHTML = ''; // Καθαρίζουμε τον πίνακα πριν προσθέσουμε νέα δεδομένα

    // Προσθήκη ημερομηνίας
    const rowDate = dailyReportTable.insertRow();
    const dateCell = rowDate.insertCell(0);
    const amountCellDate = rowDate.insertCell(1);

    dateCell.textContent = 'Ημερομηνία';
    amountCellDate.textContent = date;

    // Προσθήκη εσόδων
    const rowCashIncome = dailyReportTable.insertRow();
    const typeCellCashIncome = rowCashIncome.insertCell(0);
    const amountCellCashIncome = rowCashIncome.insertCell(1);

    typeCellCashIncome.textContent = 'Έσοδα από Μετρητά';
    amountCellCashIncome.textContent = formatCurrency(data.income.cash);

    const rowCardIncome = dailyReportTable.insertRow();
    const typeCellCardIncome = rowCardIncome.insertCell(0);
    const amountCellCardIncome = rowCardIncome.insertCell(1);

    typeCellCardIncome.textContent = 'Έσοδα από Κάρτα';
    amountCellCardIncome.textContent = formatCurrency(data.income.card);

    const rowTotalIncome = dailyReportTable.insertRow();
    const typeCellTotalIncome = rowTotalIncome.insertCell(0);
    const amountCellTotalIncome = rowTotalIncome.insertCell(1);

    typeCellTotalIncome.textContent = 'Σύνολο Εσόδων';
    amountCellTotalIncome.textContent = formatCurrency(data.income.cash + data.income.card);

    // Προσθήκη εξόδων
    const rowCashExpense = dailyReportTable.insertRow();
    const typeCellCashExpense = rowCashExpense.insertCell(0);
    const amountCellCashExpense = rowCashExpense.insertCell(1);

    typeCellCashExpense.textContent = 'Έξοδα από Μετρητά';
    amountCellCashExpense.textContent = formatCurrency(data.expense.cash);

    const rowCardExpense = dailyReportTable.insertRow();
    const typeCellCardExpense = rowCardExpense.insertCell(0);
    const amountCellCardExpense = rowCardExpense.insertCell(1);

    typeCellCardExpense.textContent = 'Έξοδα από Κάρτα';
    amountCellCardExpense.textContent = formatCurrency(data.expense.card);

    const rowTotalExpense = dailyReportTable.insertRow();
    const typeCellTotalExpense = rowTotalExpense.insertCell(0);
    const amountCellTotalExpense = rowTotalExpense.insertCell(1);

    typeCellTotalExpense.textContent = 'Σύνολο Εξόδων';
    amountCellTotalExpense.textContent = formatCurrency(data.expense.cash + data.expense.card);

    // Προσθήκη συνολικών υπολοίπων
    const rowTotalCash = dailyReportTable.insertRow();
    const typeCellTotalCash = rowTotalCash.insertCell(0);
    const amountCellTotalCash = rowTotalCash.insertCell(1);

    typeCellTotalCash.textContent = 'Σύνολο Μετρητών';
    amountCellTotalCash.textContent = formatCurrency(data.income.cash - data.expense.cash);

    const rowTotalCard = dailyReportTable.insertRow();
    const typeCellTotalCard = rowTotalCard.insertCell(0);
    const amountCellTotalCard = rowTotalCard.insertCell(1);

    typeCellTotalCard.textContent = 'Σύνολο Καρτών';
    amountCellTotalCard.textContent = formatCurrency(data.income.card - data.expense.card);



     // Υπολογισμός και εμφάνιση των ημερήσιων δημοτικών φόρων
     const dailyTaxesTable = document.getElementById('dailyTaxesTable').getElementsByTagName('tbody')[0];
     dailyTaxesTable.innerHTML = '';
 
     const taxRate = 0.0005; // 0,05% ως δεκαδικό
     const totalIncome = data.income.cash + data.income.card;
     const taxAmount = totalIncome * taxRate;
 
     const rowTax = dailyTaxesTable.insertRow();
     const typeCellTax = rowTax.insertCell(0);
     const amountCellTax = rowTax.insertCell(1);
 
     typeCellTax.textContent = 'Ημερήσιοι Δημοτικοί Φόροι (0,05%)';
     amountCellTax.textContent = formatCurrency(taxAmount);
     generateChart();

}
  



// Existing JavaScript code

// Υπόλοιπος κώδικας...

function generateWeeklyReport() {
    const datePicker = document.getElementById('datePicker');
    const selectedDate = new Date(datePicker.value);

    // Υπολογισμός της πρώτης και τελευταίας μέρας της εβδομάδας που περιλαμβάνει την επιλεγμένη ημέρα
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Δήλωση και αρχικοποίηση της μεταβλητής weeklyReportData
    const weeklyReportData = getWeeklyReportData(startDate, endDate);

    // Εμφάνιση των δεδομένων στον πίνακα
    displayWeeklyReport(weeklyReportData);

    // Υπολογισμός και εμφάνιση του ημερήσιου μέσου όρου εσόδων
    const averageIncome = calculateAverageIncome(weeklyReportData);
    displayAverageIncome(averageIncome, startDate, endDate);

// Υπολογισμός και εμφάνιση του ημερήσιου μέσου όρου εξόδων
const totalExpense = calculateTotalExpense(weeklyReportData);
displayAverageExpense(totalExpense, startDate, endDate);

  // Υπολογισμός και εμφάνιση του food cost
const foodCost = calculateFoodCost(weeklyReportData);
displayFoodCost(foodCost);

// Έλεγχος για τα μηνύματα
if (foodCost < 30) {
    showMessage("Η επιχείρηση λειτουργεί εξαιρετικά και καλύπτει τα έξοδα της. Επομένως, ο στόχος θα πρέπει να είναι ακόμη χαμηλώτερο ποσοστό.");
} else {
    showMessage("Η επιχείρηση με αυτή την αναλογία εσόδων-εξόδων δεν μπορεί να πραγματοποιήσει κέρδη.");
}

// Υπολογισμός του δημοτικού φόρου (0.5% των συνολικών εσόδων)
const municipalTaxRatio = 0.005;
const totalIncome = calculateTotalIncome(weeklyReportData);
const municipalTax = totalIncome * municipalTaxRatio;
displayMunicipalTax(municipalTax);


    // Υπολογισμός του ΦΠΑ (18% των συνολικών εσόδων)
    const vatRate = 0.18;
    const vatAmount = totalIncome * vatRate;

    // Καλείτε τη συνάρτηση ως εξής:
    displayVATMessage(totalIncome, vatAmount);
}

// Υπόλοιπος κώδικας...



function calculateTotalIncome(weeklyReportData) {
    // Calculate total income for the week
    return weeklyReportData.reduce((total, data) => total + (data.income.cash + data.income.card), 0);
}

function calculateTotalExpense(weeklyReportData) {
    // Calculate total expense for the week
    const totalExpense = weeklyReportData.reduce((total, data) => total + (data.expense.cash + data.expense.card), 0);

    // Calculate average expense
    const averageExpense = totalExpense / weeklyReportData.length;

    return averageExpense;
}

function calculateFoodCost(weeklyReportData) {
    // Calculate total income and total expense for the week
    const totalIncome = calculateTotalIncome(weeklyReportData);
    const totalExpense = calculateTotalExpense(weeklyReportData);

    // Calculate food cost as the ratio of total expense to total income
    const foodCost = (totalExpense / totalIncome) * 100;
    return foodCost.toFixed(2); // Round to 2 decimal places
}

// Υπόλοιπος κώδικας...


function showMessage(message) {
    // Βρίσκει το στοιχείο με το αντίστοιχο id
    const additionalMessageRow = document.getElementById('additionalMessageRow');

    // Αδειάζει το περιεχόμενο του στοιχείου
    additionalMessageRow.innerHTML = '';

    // Δημιουργεί ένα νέο κείμενο
    const messageText = document.createTextNode(message);

    // Προσθέτει το κείμενο στο στοιχείο
    additionalMessageRow.appendChild(messageText);
}



// Συνάρτηση για εμφάνιση του μηνύματος για τον δημοτικό φόρο
function displayMunicipalTax(municipalTax) {
    const municipalTaxRow = document.getElementById('municipalTaxRow');
    municipalTaxRow.innerHTML  = `Οι εισφορές στον <strong>Δήμο</strong> για την τρέχουσα εβδομάδα είναι<strong> ${formatCurrency(municipalTax)}</strong>`;
}

// Συνάρτηση για εμφάνιση του μηνύματος για τον ΦΠΑ
function displayVATMessage(totalIncome, vatAmount) {
    const vatMessageRow = document.getElementById('vatMessageRow');
    vatMessageRow.innerHTML = ` Τα <strong>έσοδα </strong>της εβδομάδας ανέρχονται στα<strong> ${formatCurrency(totalIncome)}</strong>. Ο <strong>ΦΠΑ </strong>που πρέπει να καταβληθεί ανέρχεται σε <strong>${formatCurrency(vatAmount)}</strong> `;
}



function formatDate(date) {
    // Format the date as "Ημέρα, Ημερομηνία" (π.χ., "Δευτέρα, 01/02")
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('el-GR', options);
}







function calculateAverageIncome(weeklyReportData) {
    // Calculate average income for the week
    const totalIncome = weeklyReportData.reduce((total, data) => total + (data.income.cash + data.income.card), 0);
    return totalIncome / weeklyReportData.length;
}

function displayAverageIncome(averageIncome) {
    // Display the message with only the average income
    const weeklyAverageRow = document.getElementById('weeklyAverageRow');
    weeklyAverageRow.innerHTML = `Ο <strong>Ημερήσιος Μέσος Όρος Εσόδων</strong> για την εβδομάδα είναι<strong> ${formatCurrency(averageIncome)}</strong>`;
}



function displayAverageExpense(averageExpense, selectedWeek) {
    const weeklyExpenseRow = document.getElementById('weeklyExpenseRow');
    weeklyExpenseRow.innerHTML = `Ο <strong>Ημερήσιος Μέσος Όρος Εξόδων</strong> για την εβδομάδα από "${selectedWeek}" είναι <strong>${formatCurrency(averageExpense)}</strong>`;
}






function calculateAverageExpense(weeklyReportData) {
    // Calculate total expense for the week
    const totalExpense = weeklyReportData.reduce((total, data) => total + (data.expense.cash + data.expense.card), 0);

    // Calculate average expense
    const averageExpense = totalExpense / weeklyReportData.length;

    return averageExpense;
}








function calculateFoodCost(weeklyReportData) {
    // Calculate total income and total expense for the week
    const totalIncome = weeklyReportData.reduce((total, data) => total + (data.income.cash + data.income.card), 0);
    const totalExpense = weeklyReportData.reduce((total, data) => total + (data.expense.cash + data.expense.card), 0);

    // Calculate food cost as the ratio of total expense to total income
    const foodCost = (totalExpense / totalIncome) * 100;
    return foodCost.toFixed(2); // Round to 2 decimal places
}

function displayFoodCost(foodCost) {
    // Display the message with the food cost
    const weeklyFoodCostRow = document.getElementById('weeklyFoodCostRow');
    weeklyFoodCostRow.innerHTML = `Το <strong>Food Cost της εβδομάδας</strong> είναι <strong>${foodCost}% </strong>`;
}

const datePicker = document.getElementById('datepicker');
const selectedDate = new Date(datePicker.value);

// Ορισμός των μεταβλητών startDate και endDate
const startDate = new Date(selectedDate);
startDate.setDate(selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));

const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 6);

// Κλήση των συναρτήσεων μετά τον ορισμό των startDate και endDate
const weeklyReportData = getWeeklyReportData(startDate, endDate);
const averageExpense = calculateAverageExpense(weeklyReportData);
displayAverageExpense(averageExpense);

const foodCost = calculateFoodCost(weeklyReportData);
displayFoodCost(foodCost);




function getWeeklyReportData(startDate, endDate) {
    // Retrieve data from Local Storage for the given date range
    const weeklyReportData = [];
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const data = localStorage.getItem(currentDate.toISOString().split('T')[0]);
        if (data) {
            weeklyReportData.push(JSON.parse(data));
        }
    }
    return weeklyReportData;
}

function displayWeeklyReport(weeklyReportData) {
    const weeklyReportTable = document.getElementById('weeklyReportTable');
    weeklyReportTable.innerHTML = ''; // Καθαρίζουμε τον πίνακα πριν προσθέσουμε νέα δεδομένα

    // Προσθήκη κεφαλίδων πίνακα με στυλ
    const headerRow = weeklyReportTable.insertRow();
    const headers = ['Ημέρα', 'Ημερομηνία', 'Έσοδα Μετρητά', 'Έσοδα Κάρτα', 'Σύνολο Έσοδων', 'Έξοδα Μετρητά', 'Έξοδα Κάρτα', 'Σύνολο Εξόδων', 'Σύνολο Μετρητών', 'Σύνολο Καρτών'];
    headers.forEach(headerText => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = headerText;
        headerCell.classList.add('header-cell'); // Προσθήκη κλάσης για στυλ
    });

    // Προσθήκη δεδομένων σε κάθε γραμμή με στυλ
    let totalCashIncome = 0;
    let totalCardIncome = 0;
    let totalIncome = 0;
    let totalCashExpense = 0;
    let totalCardExpense = 0;
    let totalExpense = 0;
    let totalCash = 0;
    let totalCard = 0;

    weeklyReportData.forEach(data => {
        const row = weeklyReportTable.insertRow();
        const dayOfWeekCell = row.insertCell(0);
        const dateCell = row.insertCell(1);
        const cashIncomeCell = row.insertCell(2);
        const cardIncomeCell = row.insertCell(3);
        const totalIncomeCell = row.insertCell(4);
        const cashExpenseCell = row.insertCell(5);
        const cardExpenseCell = row.insertCell(6);
        const totalExpenseCell = row.insertCell(7);
        const totalCashCell = row.insertCell(8);
        const totalCardCell = row.insertCell(9);

        // Προσθήκη ημέρας της εβδομάδας με στυλ
        const options = { weekday: 'long' };
        dayOfWeekCell.textContent = new Date(data.date).toLocaleDateString('el-GR', options);
        dayOfWeekCell.classList.add('day-cell'); // Προσθήκη κλάσης για στυλ

        // Προσθήκη ημερομηνίας
        dateCell.textContent = data.date;
        cashIncomeCell.textContent = formatCurrency(data.income.cash);
        cardIncomeCell.textContent = formatCurrency(data.income.card);
        totalIncomeCell.textContent = formatCurrency(data.income.cash + data.income.card);
        cashExpenseCell.textContent = formatCurrency(data.expense.cash);
        cardExpenseCell.textContent = formatCurrency(data.expense.card);
        totalExpenseCell.textContent = formatCurrency(data.expense.cash + data.expense.card);
        totalCashCell.textContent = formatCurrency(data.income.cash - data.expense.cash);
        totalCardCell.textContent = formatCurrency(data.income.card - data.expense.card);

        // Υπολογισμός συνολικών τιμών
        totalCashIncome += data.income.cash;
        totalCardIncome += data.income.card;
        totalIncome += data.income.cash + data.income.card;
        totalCashExpense += data.expense.cash;
        totalCardExpense += data.expense.card;
        totalExpense += data.expense.cash + data.expense.card;
        totalCash += data.income.cash - data.expense.cash;
        totalCard += data.income.card - data.expense.card;
    });

    // Προσθήκη γραμμής με συνολικές τιμές με στυλ
    const totalRow = weeklyReportTable.insertRow();
    const totalLabelCell = totalRow.insertCell(0);
    totalLabelCell.textContent = 'Σύνολα:';
    totalLabelCell.classList.add('total-label-cell'); // Προσθήκη κλάσης για στυλ
    totalRow.insertCell(1).classList.add('empty-cell'); // Κενή στήλη για την ημερομηνία
    totalRow.insertCell(2).textContent = formatCurrency(totalCashIncome);
    totalRow.insertCell(3).textContent = formatCurrency(totalCardIncome);
    totalRow.insertCell(4).textContent = formatCurrency(totalIncome);
    totalRow.insertCell(5).textContent = formatCurrency(totalCashExpense);
    totalRow.insertCell(6).textContent = formatCurrency(totalCardExpense);
    totalRow.insertCell(7).textContent = formatCurrency(totalExpense);
    totalRow.insertCell(8).textContent = formatCurrency(totalCash);
    totalRow.insertCell(9).textContent = formatCurrency(totalCard);
    totalRow.classList.add('total-row'); // Προσθήκη κλάσης για στυλ
}



// Remaining functions and code



// Στο script.js
// Προσθέστε τον παρακάτω κώδικα στο αρχείο script.js

function toggleMenu() {
    const container3 = document.querySelector('.container3');
    container3.classList.toggle('show');
}


