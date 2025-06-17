import { craftingCategories } from "../data/crafts/craftingCategories";

const RecipeList = ({ category, craftList }) => {

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">{craftingCategories[category]}</h2>
            <ul>
                {Object.entries(craftList).map(craft => (
                    <li key={craft[0]}>{craft[1].displayName}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;
