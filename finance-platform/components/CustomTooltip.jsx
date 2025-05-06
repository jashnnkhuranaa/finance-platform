import { formatCurrency } from "@/lib/utils/transaction";

const CustomTooltip = ({ active, payload, label, currency = '₹' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.stroke }}>
            {`${entry.name}: ${currency}${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;