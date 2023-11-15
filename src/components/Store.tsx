import storIteams from "../data/items.json";
import StoreItem from "./StoreItem";



const Store = () => {
  return (
    <>
      <div className="flex-row md:columns-2 sm:columns-1 lg:columns-3 gap-3">
        {storIteams.map((iteam) => (
          // eslint-disable-next-line react/jsx-key
          <div key={iteam.id} className="flex-col">
            <StoreItem {...iteam} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Store;
