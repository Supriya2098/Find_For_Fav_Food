import { formatINR } from '../utils/format';
import SafeImage from './SafeImage';

export default function MenuItemCard({ item }) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 flex gap-4 hover:shadow-sm transition">
      <SafeImage
        src={item.imageUrl}
        alt={item.name}
        className="w-24 h-24 rounded-lg bg-stone-100 flex-shrink-0 object-cover"
        fallback="🍴"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-stone-900">{item.name}</h4>
          <span className="font-semibold text-brand-600 whitespace-nowrap">
            {formatINR(item.price)}
          </span>
        </div>
        <p className="text-sm text-stone-500 mt-1">{item.description}</p>
        <span className="inline-block mt-2 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
          {item.category}
        </span>
      </div>
    </div>
  );
}
