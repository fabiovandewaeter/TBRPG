import { craftingCategories } from "../data/recipes/craftingCategories";

const RecipeList = ({ category, recipeList }) => {

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">{craftingCategories[category]}</h2>
            <ul>
                {Object.entries(recipeList).map(recipe => (
                    <li key={recipe[0]}>{recipe[1].displayName}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;
