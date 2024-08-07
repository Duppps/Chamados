const ItemsPerPage = ({ pageSize, onPageSizeChange }) => {
    return (
        <div>
            <label htmlFor="page-size" className="label-page-selector">Itens por página: </label>
            <select
                id="page-size"
                className="select-page-selector"
                value={pageSize}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    );
}

export default ItemsPerPage;