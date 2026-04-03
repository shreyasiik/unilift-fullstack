function FilterBox() {
  return (
    <div className="filter-box">
      <select>
        <option>Vehicle Type</option>
        <option>Bike</option>
        <option>Car</option>
      </select>

      <select>
        <option>Time</option>
        <option>Morning</option>
        <option>Evening</option>
      </select>
    </div>
  );
}

export default FilterBox;
