import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import NumberInput from '../../../components/common/NumberInput';
import DatePicker from '../../../components/common/DatePicker';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import Button from '../../../components/common/Button';

const PropertiesForm = () => {
  return (
    <form className="space-y-6 bg-white rounded-lg shadow p-6">
      <Select label="الحالة" options={[]} />
      <NumberInput label="الحد الأقصى للأجهزة" />
      <DatePicker label="تاريخ الانتهاء" />
      <ToggleSwitch label="السماح بالوصول الأوفلاين" />
      <ToggleSwitch label="السماح بجلسات متعددة" />
      <Button type="submit">حفظ التغييرات</Button>
    </form>
  );
};

export default PropertiesForm;
