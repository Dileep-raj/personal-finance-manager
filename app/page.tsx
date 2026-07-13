export default function Home() {
  return (
    <div className="stats-dashboard flex gap-2 justify-center items-center sm:gap-8 flex-col sm:flex-row mt-8">
      <div className="card stats-card stats-current-month-expense ">
        <div className="card-title stats-card-title"> Monthly expense </div>
        <div className="stats-currency currency-display"> $ 0.0 </div>
      </div>
      <div className="card stats-card stats-loans">
        <div className="card-title stats-card-title"> Loans </div>
        <div className="stats-currency currency-display"> $ 0.0 </div>
      </div>
      <div className="card stats-card stats-debts">
        <div className="card-title stats-card-title"> Debts </div>
        <div className="stats-currency currency-display"> $ 0.0 </div>
      </div>
    </div>
  );
}
