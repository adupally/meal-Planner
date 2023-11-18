
function calculateBMR(age, height, weight, gender) {
    let basalMetabolicRate;

    if (gender === 'male') {
        basalMetabolicRate = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        basalMetabolicRate = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Adjust BMR based on activity level if needed
    // For simplicity, let's assume a sedentary activity level with a multiplier of 1.2
    const totalCalories = Math.round(basalMetabolicRate * 1.2);

    return totalCalories;
}

// Function to make API request to Edamam Nutrition’s recipe search API
async function getRecipes(calories,health,day) {
    const appKey = 'Enter Your API Key';
    const apiUrl = `https://api.spoonacular.com/mealplanner/generate?apiKey=${appKey}&timeFrame=${day}&targetCalories=${calories}&diet=${health}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // console.log(data.hits)
        return data; // Extracting recipe information from the API response
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealNames = ['Breakfast', 'Lunch', 'Dinner'];

function generateMealPlan() {
    const healthSpecification = document.getElementById('healthSpecification').value;
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    let calories = document.getElementById('calories').value;
    const dayWeak = document.getElementById('numMeals').value;

    // If calories are not provided, calculate them based on user inputs
    if (!calories) {
        calories = calculateBMR(age, height, weight, gender);
        document.getElementById('calories').value = calories; // Update the calories input field
    }

    // Call the function to get recipes based on user inputs
    getRecipes(calories, healthSpecification, dayWeak)
    .then((mealPlanData) => {
        console.log(mealPlanData);
        console.log('API Response:', mealPlanData.week.monday);
        // Check if the API response contains the expected days of the week
        if (mealPlanData) {
            // Generate a table for the meal plan
            
            let mealPlanHTML = '<table>';
            mealPlanHTML += '<tr><th></th>';

            // Create table headers with days of the week
            for (const day of daysOfWeek) {
                mealPlanHTML += `<th>${day}</th>`;
            }
            mealPlanHTML += '</tr>';

            // Create table rows with meal names, recipe images, and ingredients
            for (let i = 0; i < mealNames.length; i++) {
                mealPlanHTML += `<tr><td>${mealNames[i]}</td>`;

                for (let j = 0; j < daysOfWeek.length; j++) {
                    const mealData = mealPlanData.week[daysOfWeek[j]].meals[i] || {};
                    const recipeName = mealData.title || '';
                    const recipeImage = mealData.imageType ? `https://spoonacular.com/recipeImages/${mealData.id}-90x90.${mealData.imageType}` : '';
                    const recipeUrl = mealData.sourceUrl || '';
                    const recipeIngredients = mealData.ingredientLines || [];

                    mealPlanHTML += `
                        <td>
                            <strong>${recipeName}</strong><br>
                            <a href="${recipeUrl}" target="_blank">
                                <img src="${recipeImage}" alt="${recipeName}" style="max-width: 100px; max-height: 100px;">
                            </a><br>
                            <ul>
                                ${recipeIngredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </td>
                    `;
                }

                mealPlanHTML += '</tr>';
            }

            mealPlanHTML += '</table>';

            // Display the generated meal plan on the page
            document.getElementById('mealPlanResult').innerHTML = mealPlanHTML;
        } else {
            console.error('Invalid API response format');
        }
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}