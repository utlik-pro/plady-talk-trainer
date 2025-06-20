
interface FinancialStatsProps {
  totalRevenue: number;
  totalSpent: number;
  netProfit: number;
}

export const FinancialStats = ({ totalRevenue, totalSpent, netProfit }: FinancialStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
        <div className="text-sm text-gray-600">Общая выручка</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-2xl font-bold text-red-600">${totalSpent.toFixed(4)}</div>
        <div className="text-sm text-gray-600">Затраты ElevenLabs</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${netProfit.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600">Чистая прибыль</div>
      </div>
    </div>
  );
};
