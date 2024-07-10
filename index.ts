import * as fs from 'fs';
import * as readline from 'readline';

interface Expense {
  date: string;
  category: string;
  amount: number;
}

class ExpenseTracker {
  private expenses: Expense[] = [];

  addExpense(date: string, category: string, amount: number) {
    this.expenses.push({ date, category, amount });
    console.log('Expense added successfully.');
  }

  editExpense(index: number, date: string, category: string, amount: number) {
    if (index >= 0 && index < this.expenses.length) {
      this.expenses[index] = { date, category, amount };
      console.log(`Expense at index ${index} updated successfully.`);
    } else {
      console.log('Invalid index.');
    }
  }

  deleteExpense(index: number) {
    if (index >= 0 && index < this.expenses.length) {
      this.expenses.splice(index, 1);
      console.log(`Expense at index ${index} deleted successfully.`);
    } else {
      console.log('Invalid index.');
    }
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  getExpenseByCategory(category: string): Expense[] {
    return this.expenses.filter(expense => expense.category.toLowerCase() === category.toLowerCase());
  }

  printAllExpenses(): void {
    this.expenses.forEach((expense, index) => {
      console.log(`Index: ${index}, Date: ${expense.date}, Category: ${expense.category}, Amount: ${expense.amount}`);
    });
  }

  saveExpensesToFile(filename: string): void {
    const data = JSON.stringify(this.expenses, null, 2);
    fs.writeFileSync(filename, data);
    console.log(`Expenses saved to ${filename}.`);
  }

  loadExpensesFromFile(filename: string): void {
    try {
      const data = fs.readFileSync(filename, 'utf-8');
      this.expenses = JSON.parse(data);
      console.log(`Expenses loaded from ${filename}.`);
    } catch (err) {
      console.error(`Error loading expenses from ${filename}:`, err);
    }
  }

  async promptUserInput(prompt: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise<string>(resolve => {
      rl.question(prompt, answer => {
        resolve(answer);
        rl.close();
      });
    });
  }
}

// Example usage
async function main() {
  const expenseTracker = new ExpenseTracker();
  const filename = 'expenses.json';

  // Load expenses from file if available
  expenseTracker.loadExpensesFromFile(filename);

  while (true) {
    console.log('\n===== Expense Tracker Menu =====');
    console.log('1. Add Expense');
    console.log('2. Edit Expense');
    console.log('3. Delete Expense');
    console.log('4. Print All Expenses');
    console.log('5. Save Expenses to File');
    console.log('6. Exit\n');

    const choice = await expenseTracker.promptUserInput('Enter your choice: ');

    switch (choice.trim()) {
      case '1':
        const date = await expenseTracker.promptUserInput('Enter date (YYYY-MM-DD): ');
        const category = await expenseTracker.promptUserInput('Enter category: ');
        const amountStr = await expenseTracker.promptUserInput('Enter amount: ');
        const amount = parseFloat(amountStr);
        expenseTracker.addExpense(date, category, amount);
        break;
      case '2':
        const indexStr = await expenseTracker.promptUserInput('Enter index of expense to edit: ');
        const editIndex = parseInt(indexStr);
        const newDate = await expenseTracker.promptUserInput('Enter new date (YYYY-MM-DD): ');
        const newCategory = await expenseTracker.promptUserInput('Enter new category: ');
        const newAmountStr = await expenseTracker.promptUserInput('Enter new amount: ');
        const newAmount = parseFloat(newAmountStr);
        expenseTracker.editExpense(editIndex, newDate, newCategory, newAmount);
        break;
      case '3':
        const deleteIndexStr = await expenseTracker.promptUserInput('Enter index of expense to delete: ');
        const deleteIndex = parseInt(deleteIndexStr);
        expenseTracker.deleteExpense(deleteIndex);
        break;
      case '4':
        expenseTracker.printAllExpenses();
        break;
      case '5':
        expenseTracker.saveExpensesToFile(filename);
        break;
      case '6':
        console.log('Exiting program.');
        return;
      default:
        console.log('Invalid choice. Please enter a number between 1 and 6.');
    }
  }
}

main().catch(err => console.error('Error in main:', err));
