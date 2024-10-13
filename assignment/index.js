const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const calculateTotalTarget = (startDate, endDate, totalAnnualTarget) => {
    // Helper function to check if a date is a Friday
    const isFriday = (date) => {
        return new Date(date).getDay() === 5; // 5 is Friday
    };

    // Helper function to get the number of days in a month excluding Fridays
    const getWorkingDaysInMonth = (year, month) => {
        let date = new Date(year, month, 1);
        let workingDays = 0;
        while (date.getMonth() === month) {
            if (!isFriday(date)) {
                workingDays++;
            }
            date.setDate(date.getDate() + 1);
        }
        return workingDays;
    };

    // Helper function to get working days within a specific range excluding Fridays
    const getWorkingDaysInRange = (startDate, endDate) => {
        let start = new Date(startDate);
        let end = new Date(endDate);
        let workingDays = 0;
        while (start <= end) {
            if (!isFriday(start)) {
                workingDays++;
            }
            start.setDate(start.getDate() + 1);
        }
        return workingDays;
    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Initialize arrays for storing results
    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];

    let totalTarget = 0;
    let currentMonth = start.getMonth();
    let currentYear = start.getFullYear();

    // Iterate through each month in the range
    while (currentYear < end.getFullYear() || (currentYear === end.getFullYear() && currentMonth <= end.getMonth())) {
        // Get total working days in the current month
        const totalWorkingDays = getWorkingDaysInMonth(currentYear, currentMonth);
        daysExcludingFridays.push(totalWorkingDays);

        // Get the working days in the range for this month
        let startOfMonth = new Date(currentYear, currentMonth);
        let endOfMonth = new Date(currentYear, currentMonth + 1, 0); // last day of the month

        // Constrain start and end dates to the range
        let startInRange = start > startOfMonth ? start : startOfMonth;
        let endInRange = end < endOfMonth ? end : endOfMonth;

        const workedDays = getWorkingDaysInRange(startInRange, endInRange);
        daysWorkedExcludingFridays.push(workedDays);

        // Proportionally distribute the target
        const monthlyTarget = (workedDays / totalWorkingDays) * (totalAnnualTarget / 12);
        monthlyTargets.push(monthlyTarget);

        totalTarget += monthlyTarget;

        // Move to the next month
        currentMonth++;
        if (currentMonth === 12) {
            currentMonth = 0;
            currentYear++;
        }
    }

    console.log("\nResults:");
    console.log('Total working days excluding Fridays:', daysExcludingFridays);
    console.log('Working days in range excluding Fridays:', daysWorkedExcludingFridays);
    console.log('Monthly Targets:', monthlyTargets);
    console.log('Total Target:', totalTarget);
};

// Take manual input for startDate, endDate, and totalAnnualTarget
rl.question('Enter the start date (YYYY-MM-DD): ', (startDate) => {
    rl.question('Enter the end date (YYYY-MM-DD): ', (endDate) => {
        rl.question('Enter the total annual target: ', (totalAnnualTarget) => {
            // Convert totalAnnualTarget to a number before passing it to the function
            calculateTotalTarget(startDate, endDate, parseFloat(totalAnnualTarget));
            rl.close();
        });
    });
});
