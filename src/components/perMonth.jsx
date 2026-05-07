
const PerMonth =({val,max})=>{
    const count = val.count;
    const mese = val.label.slice(0,3);
    const anno = val.label.slice(-2);
    return(
        <div className="perMonth">
            {/* {JSON.stringify(val)} - {count} - {mese} - {anno} */}
            <div className="countPossible">
                <div className="count" style={{height:`calc(${count}px * 20)`}}></div>
            </div>
            <label htmlFor="" className="periodoGraph">{mese}</label>
            <label htmlFor="" className="periodoGraph">'{anno}</label>
        </div>
    );
}

export default PerMonth;