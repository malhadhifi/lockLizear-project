import Input from '../../../components/common/Input';
import { WATERMARK_VARIABLES } from '../../../utils/buildWatermarkText';

const WatermarkSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">إعدادات العلامة المائية</h3>
      <Input label="نص العلامة" />
      <div className="text-sm text-gray-600">
        <p>المتغيرات المتاحة:</p>
        <ul className="list-disc list-inside">
          {Object.values(WATERMARK_VARIABLES).map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WatermarkSettings;
