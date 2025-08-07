import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [population, setPopulation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/dashboard/population-summary')
      .then((res) => res.json())
      .then((data) => {
        setPopulation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch population summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading population summary...</p>;

  const grandTotal = {
    lambs: 0,
    weaners: 0,
    hoggets: 0,
    adults: 0,
    males: 0,
    females: 0,
  };

  return (
    <div>
      <h2>Dashboard: Population Summary</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Farm</th>
            <th>Lambs</th>
            <th>Weaners</th>
            <th>Hoggets</th>
            <th>Adults</th>
            <th>Males</th>
            <th>Females</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {population.map((farm) => {
            const total = farm.lambs + farm.weaners + farm.hoggets + farm.adults;
            grandTotal.lambs += farm.lambs;
            grandTotal.weaners += farm.weaners;
            grandTotal.hoggets += farm.hoggets;
            grandTotal.adults += farm.adults;
            grandTotal.males += farm.males;
            grandTotal.females += farm.females;

            return (
              <tr key={farm.farm_name}>
                <td>{farm.farm_name}</td>
                <td>{farm.lambs}</td>
                <td>{farm.weaners}</td>
                <td>{farm.hoggets}</td>
                <td>{farm.adults}</td>
                <td>{farm.males}</td>
                <td>{farm.females}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Grand Total</th>
            <th>{grandTotal.lambs}</th>
            <th>{grandTotal.weaners}</th>
            <th>{grandTotal.hoggets}</th>
            <th>{grandTotal.adults}</th>
            <th>{grandTotal.males}</th>
            <th>{grandTotal.females}</th>
            <th>
              {grandTotal.lambs +
                grandTotal.weaners +
                grandTotal.hoggets +
                grandTotal.adults}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DashboardPage;
