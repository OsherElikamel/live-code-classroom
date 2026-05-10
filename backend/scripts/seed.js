require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config");
const CodeBlock = require("../src/models/CodeBlock");

const codeBlocks = [
  {
    title: "Array Map",
    description:
      "Use the map method to double every number in the array.",
    initialCode:
      'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers; // Use map to double each number\nconsole.log(doubled);',
    solution:
      'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);',
  },
  {
    title: "Array Filter",
    description:
      "Use the filter method to keep only even numbers from the array.",
    initialCode:
      'const numbers = [1, 2, 3, 4, 5, 6, 7, 8];\nconst evens = numbers; // Use filter to keep even numbers\nconsole.log(evens);',
    solution:
      'const numbers = [1, 2, 3, 4, 5, 6, 7, 8];\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens);',
  },
  {
    title: "Async/Await",
    description:
      "Complete the async function to fetch data and handle errors with try/catch.",
    initialCode:
      'async function fetchData(url) {\n  // Fetch data from the url\n  // Return the parsed JSON\n  // Handle errors with try/catch\n}',
    solution:
      'async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Failed to fetch:", error);\n  }\n}',
  },
  {
    title: "Closure Counter",
    description:
      "Create a counter function using closures that returns an object with increment, decrement, and getCount methods.",
    initialCode:
      'function createCounter() {\n  // Create a variable to hold the count\n  // Return an object with increment, decrement, and getCount\n}',
    solution:
      'function createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count,\n  };\n}',
  },
];

async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    await CodeBlock.deleteMany({});
    await CodeBlock.insertMany(codeBlocks);
    console.log(`Seeded ${codeBlocks.length} code blocks`);
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
